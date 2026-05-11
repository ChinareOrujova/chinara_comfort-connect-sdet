const { calculateMonthlyPayment } = require('../pricing/pricing.service')

const LOAN2_CONFIG = {
  name: 'Loan2',
  type: 'loan',
  minFico: 580,
  minIncome: 22000,
  maxAmount: 80000,
  minAmount: 2501,
  eligibleProjectTypes: ['HVAC', 'Water Heater', 'Generator', 'Water Filter/Softener'],
  tiers: [
    { label: 'Tier 1', term: 120, apr: 10.49, dealerFee: 0 },
    { label: 'Tier 2', term: 120, apr: 15.49, dealerFee: 5 },
    { label: 'Tier 3', term: 144, apr: 24.49, dealerFee: 5 },
  ],
}

function isEligible(fico, annualIncome, requestedAmount, projectType) {
  return (
    fico >= LOAN2_CONFIG.minFico &&
    annualIncome >= LOAN2_CONFIG.minIncome &&
    requestedAmount >= LOAN2_CONFIG.minAmount &&
    requestedAmount <= LOAN2_CONFIG.maxAmount &&
    LOAN2_CONFIG.eligibleProjectTypes.includes(projectType)
  )
}

function generateOffers(fico, requestedAmount) {
  let availableTiers
  if (fico >= 720) {
    availableTiers = [LOAN2_CONFIG.tiers[0]]
  } else if (fico >= 660) {
    availableTiers = [LOAN2_CONFIG.tiers[0], LOAN2_CONFIG.tiers[1]]
  } else {
    availableTiers = [LOAN2_CONFIG.tiers[1], LOAN2_CONFIG.tiers[2]]
  }

  return availableTiers.map((tier, index) => ({
    offerId: `loan2-offer-${index + 1}`,
    partner: 'Loan2',
    type: 'loan',
    category: 'Fixed Rate',
    approvedAmount: requestedAmount,
    apr: tier.apr,
    termMonths: tier.term,
    monthlyPayment: calculateMonthlyPayment(requestedAmount, tier.apr, tier.term),
    dealerFee: tier.dealerFee,
    description: `Fixed APR of ${tier.apr}% amortizing loan for ${tier.term} months. Property ownership required.`,
    warning: 'This offer is conditionally approved.',
  }))
}

function getOffers(fico, annualIncome, requestedAmount, projectType) {
  if (!isEligible(fico, annualIncome, requestedAmount, projectType)) {
    return { approved: false, offers: [] }
  }
  return { approved: true, offers: generateOffers(fico, requestedAmount) }
}

module.exports = { getOffers, isEligible, LOAN2_CONFIG }
