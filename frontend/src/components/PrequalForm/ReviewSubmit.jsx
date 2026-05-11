import React, { useState } from 'react'

export default function ReviewSubmit({ applicantData, incomeData, projects, onSubmit, onBack, isSubmitting }) {
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const projectsTotal = (projects || []).reduce((sum, p) => sum + p.retailPrice, 0)

  return (
    <div className="form-step">
      <h2>Step 4: Review & Submit</h2>

      <div className="review-section">
        <h3>Applicant Information</h3>
        <div className="review-grid">
          <div className="review-item"><span className="label">Name</span><span>{applicantData.firstName} {applicantData.lastName}</span></div>
          <div className="review-item"><span className="label">Email</span><span>{applicantData.email}</span></div>
          <div className="review-item"><span className="label">Phone</span><span>{applicantData.phone}</span></div>
          <div className="review-item"><span className="label">Date of Birth</span><span>{applicantData.dateOfBirth}</span></div>
          <div className="review-item"><span className="label">SSN</span><span>***-**-{applicantData.ssn?.slice(-4)}</span></div>
          <div className="review-item"><span className="label">Address</span><span>{applicantData.street}, {applicantData.city}, {applicantData.state} {applicantData.zipCode}</span></div>
        </div>
      </div>

      <div className="review-section">
        <h3>Systems</h3>
        <div className="review-grid">
          {(projects || []).map((p, i) => (
            <div key={i} className="review-item">
              <span className="label">{p.projectType}</span>
              <span>${p.retailPrice.toLocaleString()}</span>
            </div>
          ))}
          <div className="review-item" style={{ fontWeight: 600 }}>
            <span className="label">Total</span>
            <span>${projectsTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="review-section">
        <h3>Income</h3>
        <div className="review-grid">
          <div className="review-item"><span className="label">Income Source</span><span>{incomeData.incomeSource}</span></div>
          <div className="review-item"><span className="label">Annual Income</span><span>${Number(incomeData.preTaxAnnualIncome).toLocaleString()}</span></div>
          {incomeData.additionalAnnualIncome > 0 && (
            <div className="review-item"><span className="label">Additional Income</span><span>${Number(incomeData.additionalAnnualIncome).toLocaleString()}</span></div>
          )}
          <div className="review-item"><span className="label">Monthly Housing</span><span>${Number(incomeData.monthlyHousingExpense).toLocaleString()}</span></div>
        </div>
      </div>

      <div className="terms-section">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
          />
          I agree to the Terms & Conditions and authorize a credit inquiry.
        </label>
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={onBack} disabled={isSubmitting}>Back</button>
        <button
          className="btn btn-primary"
          onClick={onSubmit}
          disabled={!agreedToTerms || isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </div>
  )
}
