const CREDIT_BANDS = [
  { min: 0, max: 579, grade: 'ungraded', label: 'Below minimum threshold' },
  { min: 580, max: 639, grade: 'subPrime', label: 'High-risk tier' },
  { min: 640, max: 679, grade: 'nearPrime', label: 'Moderate-risk tier' },
  { min: 680, max: 739, grade: 'prime', label: 'Standard tier' },
  { min: 740, max: 850, grade: 'primePlus', label: 'Best tier' },
]

function getCreditGrade(fico) {
  for (const band of CREDIT_BANDS) {
    if (fico >= band.min && fico <= band.max) {
      return band.grade
    }
  }
  return 'ungraded'
}

module.exports = { CREDIT_BANDS, getCreditGrade }
