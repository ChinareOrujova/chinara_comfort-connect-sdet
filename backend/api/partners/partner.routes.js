const express = require('express')
const router = express.Router()
const loan1 = require('./loan1.service')
const loan2 = require('./loan2.service')
const l2o1 = require('./l2o1.service')
const l2o2 = require('./l2o2.service')

/**
 * Get all available partner offers for an application.
 * The comfort orchestrator typically calls this internally,
 * but this route is exposed for direct testing.
 */
router.post('/evaluate', (req, res) => {
  try {
    const { fico, annualIncome, requestedAmount, projectType, incomeFrequency } = req.body

    const loanOffers = [
      ...loan1.getOffers(fico, annualIncome, requestedAmount, projectType).offers,
      ...loan2.getOffers(fico, annualIncome, requestedAmount, projectType).offers,
    ]

    const ltoOffers = [
      ...l2o1.getOffers(fico, annualIncome, requestedAmount).offers,
      ...l2o2.getOffers(fico, annualIncome, requestedAmount, incomeFrequency).offers,
    ]

    res.json({ loanOffers, ltoOffers })
  } catch (err) {
    res.status(500).json({ error: 'Partner evaluation failed', details: err.message })
  }
})

module.exports = router
