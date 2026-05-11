const { underwrite } = require('../underwriting/underwriting.service')
const { getPremierPricing } = require('../pricing/pricing.service')
const pipeline = require('../pipeline/pipeline.service')
const loan1 = require('../partners/loan1.service')
const loan2 = require('../partners/loan2.service')
const l2o1 = require('../partners/l2o1.service')
const l2o2 = require('../partners/l2o2.service')
const { getCompanyById, isPartnerEnrolled } = require('../company/company.service')

/**
 * Orchestrator: submit application → run underwriting → generate Premier offer if approved.
 * Now company-aware: filters partners by enrollment, applies buydown, handles multi-project.
 */
function processApplication(applicationId, application, companyConfig) {
  pipeline.createApplication(applicationId, application)

  // Store companyId on the pipeline record
  if (companyConfig) {
    pipeline.updateApplication(applicationId, { companyId: companyConfig.id })
  }

  // Compute total retail price from projects array
  const projects = application.projects || []
  const totalRetailPrice = projects.reduce((sum, p) => sum + (p.retailPrice || 0), 0)

  // Cap at maxApprovalAmount if company config exists
  const maxAmount = companyConfig?.maxApprovalAmount || Infinity
  const retailPrice = Math.min(totalRetailPrice, maxAmount)

  const { creditData, decision } = underwrite(application)
  pipeline.setDecision(applicationId, decision, creditData)

  const offers = { premier: null, loan: [], leaseToOwn: [] }
  const buydownRate = companyConfig?.buyDown?.standard || 0

  if (decision.result === 'approved') {
    if (!companyConfig || isPartnerEnrolled(companyConfig, 'premier')) {
      const pricing = getPremierPricing(retailPrice, decision.grade, 120, buydownRate)
      offers.premier = {
        partner: 'Premier',
        type: 'premier',
        ...pricing,
        accepted: false,
      }
    }
  }

  const annualIncome =
    (application.income?.preTaxAnnualIncome || 0) +
    (application.income?.additionalAnnualIncome || 0)
  const projectType = projects[0]?.projectType || 'HVAC'

  // Only check eligibility for enrolled partners
  const loan1Enrolled = !companyConfig || isPartnerEnrolled(companyConfig, 'loan1')
  const loan2Enrolled = !companyConfig || isPartnerEnrolled(companyConfig, 'loan2')
  const l2o1Enrolled = !companyConfig || isPartnerEnrolled(companyConfig, 'l2o1')
  const l2o2Enrolled = !companyConfig || isPartnerEnrolled(companyConfig, 'l2o2')

  const loanEligible =
    (loan1Enrolled && loan1.isEligible(creditData.fico, annualIncome, retailPrice, projectType)) ||
    (loan2Enrolled && loan2.isEligible(creditData.fico, annualIncome, retailPrice, projectType))
  const leaseToOwnEligible =
    (l2o1Enrolled && l2o1.isEligible(creditData.fico, annualIncome, retailPrice)) ||
    (l2o2Enrolled && l2o2.isEligible(creditData.fico, annualIncome, retailPrice))

  pipeline.updateApplication(applicationId, {
    loanPartnerApplyEligible: loanEligible,
    leaseToOwnPartnerApplyEligible: leaseToOwnEligible,
  })

  pipeline.setOffers(applicationId, offers)

  return pipeline.getApplication(applicationId)
}

/**
 * initiateLoanPartnerFlow: called when user clicks "Show me offers"
 * after declining Premier, OR when Premier is rejected/review.
 */
function initiateLoanPartnerFlow(applicationId) {
  const app = pipeline.getApplication(applicationId)
  if (!app) return null

  const { applicationData, creditData } = app
  const companyConfig = app.companyId ? getCompanyById(app.companyId) : null

  // Compute total from projects array
  const projects = applicationData.projects || []
  const totalRetailPrice = projects.reduce((sum, p) => sum + (p.retailPrice || 0), 0)
  const maxAmount = companyConfig?.maxApprovalAmount || Infinity
  const retailPrice = Math.min(totalRetailPrice, maxAmount)
  const projectType = projects[0]?.projectType || 'HVAC'
  const annualIncome =
    (applicationData.income?.preTaxAnnualIncome || 0) +
    (applicationData.income?.additionalAnnualIncome || 0)

  // Only call enrolled partners
  const loan1Enrolled = !companyConfig || isPartnerEnrolled(companyConfig, 'loan1')
  const loan2Enrolled = !companyConfig || isPartnerEnrolled(companyConfig, 'loan2')

  const loan1Result = loan1Enrolled
    ? loan1.getOffers(creditData.fico, annualIncome, retailPrice, projectType)
    : { offers: [] }
  const loan2Result = loan2Enrolled
    ? loan2.getOffers(creditData.fico, annualIncome, retailPrice, projectType)
    : { offers: [] }
  const loanOffers = [...loan1Result.offers, ...loan2Result.offers]

  const loanDecision = loanOffers.length > 0 ? 'approved' : 'rejected'

  const newState = loanDecision === 'approved'
    ? 'loanPartnerOffersApproved'
    : 'loanPartnerOffersRejected'

  const offers = {
    ...app.offers,
    premier: app.offers.premier
      ? { ...app.offers.premier, declined: true }
      : null,
    loan: loanOffers,
  }

  pipeline.setOffers(applicationId, offers)
  pipeline.updateApplication(applicationId, { currentState: newState })

  return {
    ...pipeline.getApplication(applicationId),
    loanDecision,
  }
}

/**
 * initiateLeaseToOwnPartnerFlow: called when user clicks "Apply for Lease-to-Own"
 * after loan offers are rejected.
 */
function initiateLeaseToOwnPartnerFlow(applicationId) {
  const app = pipeline.getApplication(applicationId)
  if (!app) return null

  const { applicationData, creditData } = app
  const companyConfig = app.companyId ? getCompanyById(app.companyId) : null

  // Compute total from projects array
  const projects = applicationData.projects || []
  const totalRetailPrice = projects.reduce((sum, p) => sum + (p.retailPrice || 0), 0)
  const maxAmount = companyConfig?.maxApprovalAmount || Infinity
  const retailPrice = Math.min(totalRetailPrice, maxAmount)
  const annualIncome =
    (applicationData.income?.preTaxAnnualIncome || 0) +
    (applicationData.income?.additionalAnnualIncome || 0)
  const incomeFrequency = applicationData.income?.incomeFrequency || 'monthly'

  // Only call enrolled partners
  const l2o1Enrolled = !companyConfig || isPartnerEnrolled(companyConfig, 'l2o1')
  const l2o2Enrolled = !companyConfig || isPartnerEnrolled(companyConfig, 'l2o2')

  const l2o1Result = l2o1Enrolled
    ? l2o1.getOffers(creditData.fico, annualIncome, retailPrice)
    : { offers: [] }
  const l2o2Result = l2o2Enrolled
    ? l2o2.getOffers(creditData.fico, annualIncome, retailPrice, incomeFrequency)
    : { offers: [] }
  const leaseToOwnOffers = [...l2o1Result.offers, ...l2o2Result.offers]

  const leaseToOwnDecision = leaseToOwnOffers.length > 0 ? 'approved' : 'rejected'

  const newState = leaseToOwnDecision === 'approved'
    ? 'leaseToOwnPartnerOffersApproved'
    : 'leaseToOwnPartnerOffersRejected'

  const offers = { ...app.offers, leaseToOwn: leaseToOwnOffers }
  pipeline.setOffers(applicationId, offers)
  pipeline.updateApplication(applicationId, { currentState: newState })

  return {
    ...pipeline.getApplication(applicationId),
    leaseToOwnDecision,
  }
}

module.exports = { processApplication, initiateLoanPartnerFlow, initiateLeaseToOwnPartnerFlow }
