/**
 * In-memory application state management.
 * Tracks application lifecycle from submission to offer selection.
 */

const applications = new Map()

const STATES = {
  SUBMITTED: 'submitted',
  UNDERWRITING_APPROVED: 'underwritingApproved',
  UNDERWRITING_REJECTED: 'underwritingRejected',
  UNDERWRITING_REVIEW: 'underwritingReviewRequired',
  OFFERS_PRESENTED: 'offersPresented',
  OFFER_SELECTED: 'offerSelected',
  APPLICATION_DECLINED: 'applicationDeclined',
}

function createApplication(id, applicationData) {
  const record = {
    applicationId: id,
    currentState: STATES.SUBMITTED,
    applicationData,
    premierApplyEligible: false,
    loanPartnerApplyEligible: false,
    leaseToOwnPartnerApplyEligible: false,
    decision: null,
    creditData: null,
    offers: {
      premier: null,
      loan: [],
      leaseToOwn: [],
    },
    companyId: null,
    selectedOffer: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  applications.set(id, record)
  return record
}

function getApplication(id) {
  return applications.get(id) || null
}

function updateApplication(id, updates) {
  const app = applications.get(id)
  if (!app) return null
  Object.assign(app, updates, { updatedAt: new Date().toISOString() })
  applications.set(id, app)
  return app
}

function setDecision(id, decision, creditData) {
  const stateMap = {
    approved: STATES.UNDERWRITING_APPROVED,
    rejected: STATES.UNDERWRITING_REJECTED,
    'review required': STATES.UNDERWRITING_REVIEW,
  }
  return updateApplication(id, {
    currentState: stateMap[decision.result] || STATES.UNDERWRITING_REJECTED,
    decision,
    creditData,
    premierApplyEligible: decision.result === 'approved',
    loanPartnerApplyEligible: decision.result !== 'approved',
    leaseToOwnPartnerApplyEligible: decision.result !== 'approved',
  })
}

function setOffers(id, offers) {
  return updateApplication(id, {
    currentState: STATES.OFFERS_PRESENTED,
    offers,
  })
}

function selectOffer(id, partner, offerId) {
  const app = applications.get(id)
  if (!app) return null

  // Find the selected offer across all offer types
  let selectedOffer = null
  if (app.offers.premier && partner === 'premier') {
    selectedOffer = { ...app.offers.premier, partner: 'Premier', offerId: 'premier-offer' }
  }
  if (!selectedOffer) {
    selectedOffer = app.offers.loan.find((o) => o.offerId === offerId)
  }
  if (!selectedOffer) {
    selectedOffer = app.offers.leaseToOwn.find((o) => o.offerId === offerId)
  }

  if (!selectedOffer) return null

  return updateApplication(id, {
    currentState: STATES.OFFER_SELECTED,
    selectedOffer,
  })
}

function declineAllOffers(id) {
  return updateApplication(id, {
    currentState: STATES.APPLICATION_DECLINED,
  })
}

function clearAll() {
  applications.clear()
}

module.exports = {
  STATES,
  createApplication,
  getApplication,
  updateApplication,
  setDecision,
  setOffers,
  selectOffer,
  declineAllOffers,
  clearAll,
}
