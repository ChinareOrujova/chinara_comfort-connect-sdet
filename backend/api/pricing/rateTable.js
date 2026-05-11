/**
 * APR rate table by cost range and credit grade.
 * Each entry: { minCost, maxCost, rates: { primePlus, prime, nearPrime, subPrime } }
 */
const RATE_TABLE = [
  {
    minCost: 1000,
    maxCost: 5000,
    rates: { primePlus: 14.5, prime: 18.5, nearPrime: 22.5, subPrime: 26.5 },
  },
  {
    minCost: 5001,
    maxCost: 10000,
    rates: { primePlus: 13.5, prime: 17.5, nearPrime: 21.5, subPrime: 25.5 },
  },
  {
    minCost: 10001,
    maxCost: 20000,
    rates: { primePlus: 12.5, prime: 16.5, nearPrime: 20.5, subPrime: 24.5 },
  },
  {
    minCost: 20001,
    maxCost: 30000,
    rates: { primePlus: 12.0, prime: 16.0, nearPrime: 20.0, subPrime: 24.0 },
  },
  {
    minCost: 30001,
    maxCost: 50000,
    rates: { primePlus: 11.5, prime: 15.5, nearPrime: 19.5, subPrime: 23.5 },
  },
]

/**
 * Look up APR from rate table based on installation cost and credit grade.
 */
function getAPR(installationCost, creditGrade, buydownRate = 0) {
  const row = RATE_TABLE.find(
    (r) => installationCost >= r.minCost && installationCost <= r.maxCost
  )
  let baseAPR
  if (!row) {
    // Default to the highest cost range if outside bounds
    const fallback = RATE_TABLE[RATE_TABLE.length - 1]
    baseAPR = fallback.rates[creditGrade] || fallback.rates.subPrime
  } else {
    baseAPR = row.rates[creditGrade] || row.rates.subPrime
  }
  // Subtract buydown percentage points (buydownRate is decimal, e.g. 0.02 = 2%)
  const adjustedAPR = Math.max(0, baseAPR - buydownRate * 100)
  return Math.round(adjustedAPR * 100) / 100
}

module.exports = { RATE_TABLE, getAPR }
