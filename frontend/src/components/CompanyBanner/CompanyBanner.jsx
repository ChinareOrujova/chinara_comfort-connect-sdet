import React from 'react'

export default function CompanyBanner({ companies, selectedCompanyId, onCompanyChange }) {
  return (
    <div className="company-banner">
      <div className="company-banner__inner">
        <span className="company-banner__label">Dealer:</span>
        <select
          className="company-banner__select"
          value={selectedCompanyId}
          onChange={(e) => onCompanyChange(e.target.value)}
        >
          {companies.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
