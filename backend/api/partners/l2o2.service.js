const L2O2_CONFIG = {
  name: 'L2O2',
  type: 'leaseToOwn',
  minFico: 520,
  minCombinedMonthlyIncome: 2500,
  maxAmount: 12000,
  termMonths: 60,
  markupFactor: 1.70,
  paymentFrequencies: ['monthly', 'semi-monthly', '28-day', '14-day'],
}

function isEligible(fico, annualIncome, requestedAmount) {
  const monthlyIncome = annualIncome / 12
  return (
    fico >= L2O2_CONFIG.minFico &&
    monthlyIncome >= L2O2_CONFIG.minCombinedMonthlyIncome &&
    requestedAmount <= L2O2_CONFIG.maxAmount
  )
}

function generateOffers(requestedAmount, incomeFrequency) {
  const totalCostOfOwnership = Math.round(requestedAmount * L2O2_CONFIG.markupFactor * 100) / 100
  const termMonths = L2O2_CONFIG.termMonths

  // Map income frequency to payment frequency
  let paymentFrequency = 'monthly'
  if (incomeFrequency === 'biweekly') paymentFrequency = '14-day'
  else if (incomeFrequency === 'semi-monthly') paymentFrequency = 'semi-monthly'
  else if (incomeFrequency === 'weekly') paymentFrequency = '14-day'

  // Calculate payment amount based on frequency
  let paymentsPerYear
  switch (paymentFrequency) {
    case '14-day':
      paymentsPerYear = 26
      break
    case '28-day':
      paymentsPerYear = 13
      break
    case 'semi-monthly':
      paymentsPerYear = 24
      break
    default:
      paymentsPerYear = 12
  }

  const totalPayments = Math.round((paymentsPerYear * termMonths) / 12)
  const paymentAmount = Math.round((totalCostOfOwnership / totalPayments) * 100) / 100

  return [
    {
      offerId: 'l2o2-offer-1',
      partner: 'L2O2',
      type: 'leaseToOwn',
      category: 'Lease-to-Own',
      leaseAmount: requestedAmount,
      term: termMonths,
      paymentAmount,
      paymentFrequency,
      totalCostOfOwnership,
      paymentsRemaining: totalPayments,
      description: 'Lease-to-own option with flexible terms and no credit check required.',
    },
  ]
}

function getOffers(fico, annualIncome, requestedAmount, incomeFrequency = 'monthly') {
  if (!isEligible(fico, annualIncome, requestedAmount)) {
    return { approved: false, offers: [] }
  }
  return { approved: true, offers: generateOffers(requestedAmount, incomeFrequency) }
}

module.exports = { getOffers, isEligible, L2O2_CONFIG }
