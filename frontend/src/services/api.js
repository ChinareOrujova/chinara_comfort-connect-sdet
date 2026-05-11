import axios from 'axios'

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  headers: { 'Content-Type': 'application/json' },
})

export async function submitApplication(applicationData) {
  const response = await api.post('/apply', applicationData)
  return response.data
}

export async function getApplicationStatus(applicationId) {
  const response = await api.get(`/account/${applicationId}`)
  return response.data
}

export async function getOffers(applicationId) {
  const response = await api.get(`/offers/${applicationId}`)
  return response.data
}

export async function selectOffer(applicationId, partner, offerId) {
  const response = await api.post(`/offers/${applicationId}/select`, { partner, offerId })
  return response.data
}

// initiateLoanPartnerFlow — called when "Show me offers" clicked
export async function fetchLoanOffers(applicationId) {
  const response = await api.post(`/offers/${applicationId}/loan`)
  return response.data
}

// initiateLeaseToOwnPartnerFlow — called when "Apply for Lease-to-Own" clicked
export async function fetchLeaseToOwnOffers(applicationId) {
  const response = await api.post(`/offers/${applicationId}/leaseToOwn`)
  return response.data
}

export async function fetchCompanies() {
  const response = await api.get('/companies')
  return response.data
}

export async function fetchCompanyConfig(id) {
  const response = await api.get(`/companies/${id}`)
  return response.data
}

export default api
