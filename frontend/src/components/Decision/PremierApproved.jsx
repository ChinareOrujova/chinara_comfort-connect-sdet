import React from 'react'

export default function PremierApproved({ offer, onAccept, onDecline }) {
  return (
    <div className="decision-screen premier-approved">
      <div className="decision-header decision-header--success">
        <h1>Congratulations! You're Approved!</h1>
        <p>You qualify for the Premier Program — our preferred financing option.</p>
      </div>

      <div className="premier-card">
        <h2 className="premier-card__title">Premier Program</h2>

        <div className="premier-card__payment">
          <span className="premier-card__amount">${offer.monthlyPayment?.toFixed(2)}</span>
          <span className="premier-card__frequency">/Month</span>
        </div>
        <p className="premier-card__payment-label">Total Monthly Payment (incl. Tax)</p>

        <div className="premier-card__structure">
          <div className="premier-card__structure-row">
            <span>APR</span>
            <span>{offer.apr}%</span>
          </div>
          <div className="premier-card__structure-row">
            <span>Term</span>
            <span>{offer.termMonths} Months</span>
          </div>
        </div>

        <div className="premier-card__benefits">
          <h3>Benefits Include:</h3>
          <ul>
            <li>No large up-front payment</li>
            <li>No-charge required maintenance</li>
            <li>Parts &amp; labor coverage</li>
            <li>No-charge system replacement</li>
            <li>Transferable agreement</li>
            <li>Priority service response</li>
            <li>Annual tune-ups included</li>
            <li>Filter replacements included</li>
            <li>100% tax deductible</li>
          </ul>
        </div>

        <div className="premier-card__actions">
          <button className="btn btn-accept" onClick={onAccept}>
            Accept Offer
          </button>
          <button className="btn btn-decline" onClick={onDecline}>
            Decline Offer
          </button>
        </div>
      </div>
    </div>
  )
}
