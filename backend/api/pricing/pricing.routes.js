const express = require('express')
const router = express.Router()
const { getPremierPricing } = require('./pricing.service')

router.post('/', (req, res) => {
  try {
    const { installationCost, creditGrade, termMonths } = req.body
    if (!installationCost || !creditGrade) {
      return res.status(400).json({ error: 'installationCost and creditGrade are required' })
    }
    const pricing = getPremierPricing(installationCost, creditGrade, termMonths)
    res.json(pricing)
  } catch (err) {
    res.status(500).json({ error: 'Pricing calculation failed', details: err.message })
  }
})

module.exports = router
