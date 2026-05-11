const companies = require('../../data/companies.json')

function getAllCompanies() {
  return companies.map(({ id, name }) => ({ id, name }))
}

function getCompanyById(id) {
  return companies.find((c) => c.id === id) || null
}

function isPartnerEnrolled(companyConfig, partnerName) {
  const partner = companyConfig.partners.find((p) => p.partnerName === partnerName)
  return partner ? partner.isEnrolled && partner.isActive : false
}

module.exports = { getAllCompanies, getCompanyById, isPartnerEnrolled }
