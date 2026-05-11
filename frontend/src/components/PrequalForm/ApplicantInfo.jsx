import React from 'react'
import FormField from '../common/FormField'
import { US_STATES } from '../../utils/validation'

export default function ApplicantInfo({ data, errors, onChange, onNext, onBack }) {
  return (
    <div className="form-step">
      <h2>Step 2: Applicant Information</h2>

      <div className="form-row">
        <FormField label="First Name" name="firstName" value={data.firstName} onChange={onChange} error={errors.firstName} required />
        <FormField label="Last Name" name="lastName" value={data.lastName} onChange={onChange} error={errors.lastName} required />
      </div>

      <div className="form-row">
        <FormField label="Email" name="email" type="email" value={data.email} onChange={onChange} error={errors.email} required />
        <FormField label="Phone" name="phone" value={data.phone} onChange={onChange} error={errors.phone} placeholder="10 digits" required />
      </div>

      <div className="form-row">
        <FormField label="Date of Birth" name="dateOfBirth" value={data.dateOfBirth} onChange={onChange} error={errors.dateOfBirth} placeholder="MM/DD/YYYY" required />
        <FormField label="SSN" name="ssn" type="password" value={data.ssn} onChange={onChange} error={errors.ssn} placeholder="9 digits" required />
      </div>

      <h3>Address</h3>

      <FormField label="Street Address" name="street" value={data.street} onChange={onChange} error={errors.street} required />

      <div className="form-row">
        <FormField label="City" name="city" value={data.city} onChange={onChange} error={errors.city} required />
        <FormField label="State" name="state" type="select" value={data.state} onChange={onChange} error={errors.state} options={US_STATES} required />
        <FormField label="Zip Code" name="zipCode" value={data.zipCode} onChange={onChange} error={errors.zipCode} placeholder="5 digits" required />
      </div>

      <div className="form-actions">
        {onBack && <button className="btn btn-secondary" onClick={onBack}>Back</button>}
        <button className="btn btn-primary" onClick={onNext}>Next</button>
      </div>
    </div>
  )
}
