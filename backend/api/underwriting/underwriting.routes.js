const express = require('express')
const router = express.Router()
const { underwrite } = require('./underwriting.service')

router.post('/', (req, res) => {
  try {
    const { application } = req.body
    if (!application || !application.applicant?.ssn) {
      return res.status(400).json({ error: 'Application with applicant SSN is required' })
    }
    const result = underwrite(application)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: 'Underwriting failed', details: err.message })
  }
})

module.exports = router
