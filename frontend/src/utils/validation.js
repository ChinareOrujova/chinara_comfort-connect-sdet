export function validateApplicantInfo(data) {
  const errors = {}

  if (!data.firstName?.trim()) errors.firstName = 'First name is required'
  if (!data.lastName?.trim()) errors.lastName = 'Last name is required'

  if (!data.email?.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email format'
  }

  if (!data.phone?.trim()) {
    errors.phone = 'Phone number is required'
  } else if (!/^\d{10}$/.test(data.phone.replace(/\D/g, ''))) {
    errors.phone = 'Phone must be 10 digits'
  }

  if (!data.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required'
  } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data.dateOfBirth)) {
    errors.dateOfBirth = 'Date must be in MM/DD/YYYY format'
  } else {
    const [month, day, year] = data.dateOfBirth.split('/').map(Number)
    const dob = new Date(year, month - 1, day)
    if (isNaN(dob.getTime()) || dob.getMonth() !== month - 1 || dob.getDate() !== day) {
      errors.dateOfBirth = 'Invalid date'
    } else {
      const today = new Date()
      const age = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000))
      if (age < 18) errors.dateOfBirth = 'Applicant must be at least 18 years old'
    }
  }

  if (!data.ssn?.trim()) {
    errors.ssn = 'SSN is required'
  } else if (!/^\d{9}$/.test(data.ssn.replace(/\D/g, ''))) {
    errors.ssn = 'SSN must be exactly 9 digits'
  }

  if (!data.street?.trim()) errors.street = 'Street address is required'
  if (!data.city?.trim()) errors.city = 'City is required'
  if (!data.state?.trim()) errors.state = 'State is required'

  if (!data.zipCode?.trim()) {
    errors.zipCode = 'Zip code is required'
  } else if (!/^\d{5}$/.test(data.zipCode)) {
    errors.zipCode = 'Zip code must be 5 digits'
  }

  return errors
}

export function validateIncomeInfo(data) {
  const errors = {}

  if (!data.incomeSource) errors.incomeSource = 'Income source is required'

  if (!data.preTaxAnnualIncome && data.preTaxAnnualIncome !== 0) {
    errors.preTaxAnnualIncome = 'Pre-tax annual income is required'
  } else if (Number(data.preTaxAnnualIncome) <= 0) {
    errors.preTaxAnnualIncome = 'Income must be greater than 0'
  }

  if (data.additionalAnnualIncome && Number(data.additionalAnnualIncome) < 0) {
    errors.additionalAnnualIncome = 'Additional income cannot be negative'
  }

  if (!data.monthlyHousingExpense && data.monthlyHousingExpense !== 0) {
    errors.monthlyHousingExpense = 'Monthly housing expense is required'
  } else if (Number(data.monthlyHousingExpense) < 0) {
    errors.monthlyHousingExpense = 'Housing expense cannot be negative'
  }

  return errors
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0
}

export const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
  'DC',
]

export const INCOME_SOURCES = ['Employed', 'Self-Employed', 'Retired', 'Other']
