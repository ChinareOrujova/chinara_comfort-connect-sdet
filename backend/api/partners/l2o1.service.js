const L2O1_CONFIG = {
  name: 'L2O1',
  type: 'leaseToOwn',
  minFico: 520,
  minMonthlyIncome: 1800,
  maxAmount: 20000,
  termOptions: [24, 36, 48, 60],
  markupFactor: 1.55, // total cost of lease vs retail
}

function isEligible(fico, annualIncome, requestedAmount) {
  const monthlyIncome = annualIncome / 12
  return (
    fico >= L2O1_CONFIG.minFico &&
    monthlyIncome >= L2O1_CONFIG.minMonthlyIncome &&
    requestedAmount <= L2O1_CONFIG.maxAmount
  )
}

function generateOffers(requestedAmount) {
  const totalFinancingAmount = Math.round(requestedAmount * L2O1_CONFIG.markupFactor * 100) / 100

  return L2O1_CONFIG.termOptions.map((months, index) => {
    const monthlyPayment = Math.round((totalFinancingAmount / months) * 100) / 100
    return {
      offerId: `l2o1-offer-${index + 1}`,
      partner: 'L2O1',
      type: 'leaseToOwn',
      category: 'Lease-to-Own',
      leaseAmount: requestedAmount,
      retailCashPrice: requestedAmount,
      totalFinancingAmount,
      months,
      monthlyPayment,
      downPaymentAmount: 0,
      paymentFrequency: 'monthly',
      description: 'Lease-to-own option with flexible terms and no credit check required.',
    }
  })
}

function getOffers(fico, annualIncome, requestedAmount) {
  if (!isEligible(fico, annualIncome, requestedAmount)) {
    return { approved: false, offers: [] }
  }
  return { approved: true, offers: generateOffers(requestedAmount) }
}

module.exports = { getOffers, isEligible, L2O1_CONFIG }
