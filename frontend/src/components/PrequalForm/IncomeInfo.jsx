import React from 'react'
import FormField from '../common/FormField'
import { INCOME_SOURCES } from '../../utils/validation'

export default function IncomeInfo({ data, errors, onChange, onNext, onBack }) {
  return (
    <div className="form-step">
      <h2>Step 3: Income Information</h2>

      <FormField label="Income Source" name="incomeSource" type="select" value={data.incomeSource} onChange={onChange} error={errors.incomeSource} options={INCOME_SOURCES} required />

      <div className="form-row">
        <FormField label="Pre-Tax Annual Income ($)" name="preTaxAnnualIncome" type="number" value={data.preTaxAnnualIncome} onChange={onChange} error={errors.preTaxAnnualIncome} required />
        <FormField label="Additional Annual Income ($)" name="additionalAnnualIncome" type="number" value={data.additionalAnnualIncome} onChange={onChange} error={errors.additionalAnnualIncome} />
      </div>

      <FormField label="Monthly Housing Expense ($)" name="monthlyHousingExpense" type="number" value={data.monthlyHousingExpense} onChange={onChange} error={errors.monthlyHousingExpense} required />

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={onBack}>Back</button>
        <button className="btn btn-primary" onClick={onNext}>Next</button>
      </div>
    </div>
  )
}
