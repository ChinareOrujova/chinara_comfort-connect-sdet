/**
 * Underwriting criteria rules configuration.
 *
 * Each rule has:
 *   - name: Human-readable rule identifier
 *   - decision: 'reject' or 'review'
 *   - evaluate(input): returns true if the rule triggers
 *
 * Decision priority: reject > review > approved
 * If no rules trigger, the application is approved.
 */

const REJECTION_RULES = [
  {
    name: 'lowFico',
    decision: 'reject',
    reason: 'FICO score below minimum threshold',
    evaluate: (input) => input.fico <= 594,
  },
  {
    name: 'bankruptcy',
    decision: 'reject',
    reason: 'Bankruptcy on record',
    evaluate: (input) => input.bankruptcy >= 1,
  },
  {
    name: 'foreclosure',
    decision: 'reject',
    reason: 'Foreclosure on record',
    evaluate: (input) => input.foreclosure >= 1,
  },
  {
    name: 'highDelinquency',
    decision: 'reject',
    reason: 'Excessive delinquencies on record',
    evaluate: (input) => input.delqAny >= 4,
  },
  {
    name: 'lowIncome',
    decision: 'reject',
    reason: 'Annual income below minimum threshold',
    evaluate: (input) => input.statedAnnualIncome <= 28000,
  },
  {
    name: 'lowFicoHighDti',
    decision: 'reject',
    reason: 'Low FICO combined with high debt-to-income ratio',
    evaluate: (input) => input.fico <= 639 && input.dti > 55,
  },
]

const REVIEW_RULES = [
  {
    name: 'midFico',
    decision: 'review',
    reason: 'FICO score in review range',
    evaluate: (input) => input.fico >= 595 && input.fico <= 639,
  },
  {
    name: 'highDtiNearPrime',
    decision: 'review',
    reason: 'High DTI for near-prime applicant',
    evaluate: (input) => input.fico >= 640 && input.fico <= 679 && input.dti > 55,
  },
  {
    name: 'highAdv',
    decision: 'review',
    reason: 'High project value for credit tier',
    evaluate: (input) => input.adv > 30000 && input.fico <= 739,
  },
  {
    name: 'highLtv',
    decision: 'review',
    reason: 'High loan-to-value ratio for credit tier',
    evaluate: (input) => input.fico <= 639 && input.ltv >= 85,
  },
]

const ALL_RULES = [...REJECTION_RULES, ...REVIEW_RULES]

module.exports = { REJECTION_RULES, REVIEW_RULES, ALL_RULES }
