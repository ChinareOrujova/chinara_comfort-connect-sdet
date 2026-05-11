const { getCreditGrade } = require('./creditBandConfig')
const { ALL_RULES } = require('./criteriaConfig')

/**
 * Generate deterministic credit data from SSN.
 * Same SSN always produces the same data for repeatable results.
 */
function generateCreditData(ssn) {
  const seed = parseInt(ssn.replace(/\D/g, '').slice(-4), 10)
  return {
    fico: 550 + (seed % 300),
    bankruptcy: seed % 50 === 0 ? 1 : 0,
    foreclosure: seed % 75 === 0 ? 1 : 0,
    lien: seed % 100 === 0 ? 1 : 0,
    collection: seed % 30 < 2 ? seed % 3 : 0,
    delqAny: seed % 20 < 3 ? (seed % 4) : 0,
    monthlyDebtPayment: 200 + (seed % 2000),
    propertyValue: 100000 + (seed % 400000),
    propertyLoan: 50000 + (seed % 300000),
  }
}

/**
 * Compute underwriting input fields from application + credit data.
 */
function buildUnderwritingInput(application, creditData) {
  const statedAnnualIncome =
    (application.income?.preTaxAnnualIncome || 0) +
    (application.income?.additionalAnnualIncome || 0)
  const statedMonthlyIncome = statedAnnualIncome / 12
  const monthlyHousingExpense = application.income?.monthlyHousingExpense || 0
  const monthlySubscriptionPayment = 0 // simplified: no subscription data available
  const projects = application.projects || []
  const adv = projects.reduce((sum, p) => sum + (p.retailPrice || 0), 0) || 5000

  const dti =
    statedMonthlyIncome > 0
      ? ((creditData.monthlyDebtPayment + monthlySubscriptionPayment + monthlyHousingExpense) * 100) / statedMonthlyIncome
      : 999

  const ltv =
    creditData.propertyValue > 0
      ? (creditData.propertyLoan * 100) / creditData.propertyValue
      : 0

  return {
    fico: creditData.fico,
    dti: Math.round(dti * 100) / 100,
    ltv: Math.round(ltv * 100) / 100,
    adv,
    statedAnnualIncome,
    statedMonthlyIncome,
    bankruptcy: creditData.bankruptcy,
    foreclosure: creditData.foreclosure,
    lien: creditData.lien,
    collection: creditData.collection,
    delqAny: creditData.delqAny,
  }
}

/**
 * Run the underwriting rules engine.
 * Returns: { result, grade, triggeredRules, denialReasons, monthlyPaymentAllowed }
 */
function evaluate(underwritingInput) {
  const triggeredRules = []

  for (const rule of ALL_RULES) {
    if (rule.evaluate(underwritingInput)) {
      triggeredRules.push({
        name: rule.name,
        decision: rule.decision,
        reason: rule.reason,
      })
    }
  }

  // Decision priority: reject > review > approved
  const hasReject = triggeredRules.some((r) => r.decision === 'reject')
  const hasReview = triggeredRules.some((r) => r.decision === 'review')

  let result
  if (hasReject) {
    result = 'rejected'
  } else if (hasReview) {
    result = 'review required'
  } else {
    result = 'approved'
  }

  const grade = getCreditGrade(underwritingInput.fico)

  // Monthly payment allowed: rough estimate based on income and DTI
  const maxDti = 55
  const monthlyPaymentAllowed = Math.max(
    0,
    (underwritingInput.statedMonthlyIncome * maxDti) / 100 -
      (underwritingInput.dti / 100) * underwritingInput.statedMonthlyIncome
  )

  const denialReasons = {}
  for (const rule of triggeredRules) {
    denialReasons[rule.name] = rule.reason
  }

  return {
    result,
    grade,
    triggeredRules,
    denialReasons,
    monthlyPaymentAllowed: Math.round(monthlyPaymentAllowed * 100) / 100,
  }
}

/**
 * Full underwriting pipeline: credit pull → build input → evaluate.
 */
function underwrite(application) {
  const creditData = generateCreditData(application.applicant.ssn)
  const input = buildUnderwritingInput(application, creditData)
  const decision = evaluate(input)
  return { creditData, underwritingInput: input, decision }
}

module.exports = {
  generateCreditData,
  buildUnderwritingInput,
  evaluate,
  underwrite,
}
