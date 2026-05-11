const { getAPR } = require('./rateTable')

const DEFAULT_TERM_MONTHS = 120

/**
 * Calculate monthly payment using standard amortization formula:
 * Payment = P * [r(1+r)^n] / [(1+r)^n - 1]
 *
 * Where:
 *   P = principal (installationCost)
 *   r = monthly interest rate (APR / 1200)
 *   n = number of months (termMonths)
 */
function calculateMonthlyPayment(installationCost, apr, termMonths = DEFAULT_TERM_MONTHS) {
  if (installationCost <= 0) return 0
  if (apr <= 0) return installationCost / termMonths

  const r = apr / 1200
  const n = termMonths
  const numerator = r * Math.pow(1 + r, n)
  const denominator = Math.pow(1 + r, n) - 1
  const payment = installationCost * (numerator / denominator)

  return Math.round(payment * 100) / 100
}

/**
 * Get Premier program pricing for an application.
 */
function getPremierPricing(installationCost, creditGrade, termMonths = DEFAULT_TERM_MONTHS, buydownRate = 0) {
  const apr = getAPR(installationCost, creditGrade, buydownRate)
  const monthlyPayment = calculateMonthlyPayment(installationCost, apr, termMonths)

  return {
    installationCost,
    creditGrade,
    apr,
    termMonths,
    monthlyPayment,
    totalCost: Math.round(monthlyPayment * termMonths * 100) / 100,
  }
}

module.exports = { calculateMonthlyPayment, getPremierPricing, DEFAULT_TERM_MONTHS }
