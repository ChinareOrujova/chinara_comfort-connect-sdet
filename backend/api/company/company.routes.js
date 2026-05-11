const express = require('express')
const router = express.Router()
const { getAllCompanies, getCompanyById } = require('./company.service')

router.get('/', (req, res) => {
  res.json(getAllCompanies())
})

router.get('/:id', (req, res) => {
  const company = getCompanyById(req.params.id)
  if (!company) {
    return res.status(404).json({ error: 'Company not found' })
  }
  res.json(company)
})

module.exports = router
