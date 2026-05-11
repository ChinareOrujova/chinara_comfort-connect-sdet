const { calculateMonthlyPayment } = require('../pricing/pricing.service')

const LOAN1_CONFIG = {
  name: 'Loan1',
  type: 'loan',
  minFico: 560,
  minIncome: 22000,
  maxAmount: 60000,
  minAmount: 2501,
  eligibleProjectTypes: ['HVAC', 'Water Heater', 'Generator', 'Water Filter/Softener'],
  tiers: [
    { term: 60, apr: 9.49, dealerFee: 0 },
    { term: 84, apr: 13.49, dealerFee: 3 },
    { term: 120, apr: 19.49, dealerFee: 5 },
  ],
}

function isEligible(fico, annualIncome, requestedAmount, projectType) {
  return (
    fico >= LOAN1_CONFIG.minFico &&
    annualIncome >= LOAN1_CONFIG.minIncome &&
    requestedAmount >= LOAN1_CONFIG.minAmount &&
    requestedAmount <= LOAN1_CONFIG.maxAmount &&
    LOAN1_CONFIG.eligibleProjectTypes.includes(projectType)
  )
}

function generateOffers(fico, requestedAmount) {
  // Higher FICO gets more tier options
  let availableTiers
  if (fico >= 700) {
    availableTiers = LOAN1_CONFIG.tiers
  } else if (fico >= 640) {
    availableTiers = LOAN1_CONFIG.tiers.slice(1)
  } else {
    availableTiers = LOAN1_CONFIG.tiers.slice(2)
  }

  return availableTiers.map((tier, index) => ({
    offerId: `loan1-offer-${index + 1}`,
    partner: 'Loan1',
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

module.exports = { getOffers, isEligible, LOAN1_CONFIG }
