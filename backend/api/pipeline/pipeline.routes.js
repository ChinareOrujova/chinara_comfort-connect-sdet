const express = require('express')
const router = express.Router()
const pipeline = require('./pipeline.service')

router.get('/status/:applicationId', (req, res) => {
  const app = pipeline.getApplication(req.params.applicationId)
  if (!app) {
    return res.status(404).json({ error: 'Application not found' })
  }
  res.json({
    applicationId: app.applicationId,
    currentState: app.currentState,
    premierApplyEligible: app.premierApplyEligible,
    loanPartnerApplyEligible: app.loanPartnerApplyEligible,
    ltoPartnerApplyEligible: app.ltoPartnerApplyEligible,
    decision: app.decision,
    offers: app.offers,
    selectedOffer: app.selectedOffer,
  })
})

module.exports = router
