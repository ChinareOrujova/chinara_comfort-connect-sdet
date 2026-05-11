const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const { processApplication, initiateLoanPartnerFlow, initiateLeaseToOwnPartnerFlow } = require('./comfort.service')
const pipeline = require('../pipeline/pipeline.service')
const { getCompanyById } = require('../company/company.service')

// POST /api/apply — Submit prequalification application
router.post('/apply', (req, res) => {
  try {
    const { applicant, income, address, project, projects, companyId } = req.body

    if (!applicant?.ssn || !applicant?.firstName || !applicant?.lastName) {
      return res.status(400).json({ error: 'Applicant info with SSN, firstName, and lastName is required' })
    }
    if (!income?.preTaxAnnualIncome) {
      return res.status(400).json({ error: 'Income information is required' })
    }

    // Normalize: support both projects[] array and legacy single project
    const normalizedProjects = projects || (project ? [project] : [])

    const applicationId = uuidv4()
    const application = { applicant, income, address, projects: normalizedProjects }

    // Load company config if companyId provided
    const companyConfig = companyId ? getCompanyById(companyId) : null

    const result = processApplication(applicationId, application, companyConfig)

    res.json({
      applicationId: result.applicationId,
      currentState: result.currentState,
      decision: result.decision,
      offers: result.offers,
      loanPartnerApplyEligible: result.loanPartnerApplyEligible,
      leaseToOwnPartnerApplyEligible: result.leaseToOwnPartnerApplyEligible,
    })
  } catch (err) {
    res.status(500).json({ error: 'Application processing failed', details: err.message })
  }
})

// GET /api/account/:applicationId — Get application status & decision
router.get('/account/:applicationId', (req, res) => {
  const app = pipeline.getApplication(req.params.applicationId)
  if (!app) {
    return res.status(404).json({ error: 'Application not found' })
  }
  res.json({
    applicationId: app.applicationId,
    currentState: app.currentState,
    decision: app.decision,
    offers: app.offers,
    selectedOffer: app.selectedOffer,
    loanPartnerApplyEligible: app.loanPartnerApplyEligible,
    leaseToOwnPartnerApplyEligible: app.leaseToOwnPartnerApplyEligible,
  })
})

// POST /api/offers/:applicationId/loan — Initiate loan partner flow
// (called when user clicks "Show me offers" after Premier decline,
//  or when Premier rejected and user is routed to loans)
router.post('/offers/:applicationId/loan', (req, res) => {
  try {
    const result = initiateLoanPartnerFlow(req.params.applicationId)
    if (!result) {
      return res.status(404).json({ error: 'Application not found' })
    }

    res.json({
      applicationId: result.applicationId,
      currentState: result.currentState,
      loanDecision: result.loanDecision,
      offers: result.offers,
      leaseToOwnPartnerApplyEligible: result.leaseToOwnPartnerApplyEligible,
    })
  } catch (err) {
    res.status(500).json({ error: 'Loan partner flow failed', details: err.message })
  }
})

// POST /api/offers/:applicationId/leaseToOwn — Initiate Lease-to-Own partner flow
// (called when user clicks "Apply for Lease-to-Own" after loan decline)
router.post('/offers/:applicationId/leaseToOwn', (req, res) => {
  try {
    const result = initiateLeaseToOwnPartnerFlow(req.params.applicationId)
    if (!result) {
      return res.status(404).json({ error: 'Application not found' })
    }

    res.json({
      applicationId: result.applicationId,
      currentState: result.currentState,
      leaseToOwnDecision: result.leaseToOwnDecision,
      offers: result.offers,
    })
  } catch (err) {
    res.status(500).json({ error: 'Lease-to-Own partner flow failed', details: err.message })
  }
})

// GET /api/offers/:applicationId — Get available partner offers
router.get('/offers/:applicationId', (req, res) => {
  const app = pipeline.getApplication(req.params.applicationId)
  if (!app) {
    return res.status(404).json({ error: 'Application not found' })
  }
  res.json(app.offers)
})

// POST /api/offers/:applicationId/select — Select an offer
router.post('/offers/:applicationId/select', (req, res) => {
  const { partner, offerId } = req.body
  if (!partner) {
    return res.status(400).json({ error: 'partner is required' })
  }

  const result = pipeline.selectOffer(req.params.applicationId, partner, offerId)
  if (!result) {
    return res.status(404).json({ error: 'Application or offer not found' })
  }

  res.json({
    applicationId: result.applicationId,
    currentState: result.currentState,
    selectedOffer: result.selectedOffer,
  })
})

module.exports = router
