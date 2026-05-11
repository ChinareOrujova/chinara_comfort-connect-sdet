import React from 'react'

export default function FormField({ label, name, type = 'text', value, onChange, error, options, placeholder, required }) {
  const inputId = `field-${name}`

  if (type === 'select') {
    return (
      <div className="form-field">
        <label htmlFor={inputId}>
          {label} {required && <span className="required">*</span>}
        </label>
        <select id={inputId} name={name} value={value || ''} onChange={onChange}>
          <option value="">-- Select --</option>
          {options?.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        {error && <span className="field-error">{error}</span>}
      </div>
    )
  }

  return (
    <div className="form-field">
      <label htmlFor={inputId}>
        {label} {required && <span className="required">*</span>}
      </label>
      <input
        id={inputId}
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
      />
      {error && <span className="field-error">{error}</span>}
    </div>
  )
}
