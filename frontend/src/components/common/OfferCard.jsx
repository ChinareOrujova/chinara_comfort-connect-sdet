import React from 'react'

function getPaymentFrequencyLabel(frequency) {
  switch (frequency) {
    case 'semi-monthly': return 'Semi-Monthly Payment'
    case '14-day': return '14-day Payment'
    case '28-day': return '28-day Payment'
    default: return 'Monthly Payment'
  }
}

export default function OfferCard({ offer, displayName, onSelect }) {
  const isLoan = offer.type === 'loan'
  const isLeaseToOwn = offer.type === 'leaseToOwn'

  const categoryLabel = isLeaseToOwn ? 'Lease-to-Own' : (offer.category || 'Loan')

  return (
    <div className="offer-card">
      <div className="offer-card__header">
        <h3 className="offer-card__name">{displayName}</h3>
        <span className="offer-card__badge">{categoryLabel}</span>
      </div>

      <div className="offer-card__metrics">
        {isLoan && (
          <>
            <div className="offer-metric">
              <span className="offer-metric__label">Approved</span>
              <span className="offer-metric__value">${offer.approvedAmount?.toLocaleString()}</span>
            </div>
            <div className="offer-metric">
              <span className="offer-metric__label">APR</span>
              <span className="offer-metric__value">{offer.apr}%</span>
            </div>
            <div className="offer-metric">
              <span className="offer-metric__label">Total Term</span>
              <span className="offer-metric__value">{offer.termMonths} Months</span>
            </div>
            <div className="offer-metric">
              <span className="offer-metric__label">Monthly Payment</span>
              <span className="offer-metric__value">${offer.monthlyPayment?.toFixed(2)}</span>
            </div>
          </>
        )}

        {isLeaseToOwn && (
          <>
            <div className="offer-metric">
              <span className="offer-metric__label">Approved</span>
              <span className="offer-metric__value">${(offer.leaseAmount || offer.approvedAmount)?.toLocaleString()}</span>
            </div>
            <div className="offer-metric">
              <span className="offer-metric__label">Requested</span>
              <span className="offer-metric__value">${(offer.retailCashPrice || offer.leaseAmount)?.toLocaleString()}</span>
            </div>
            <div className="offer-metric">
              <span className="offer-metric__label">Total Term</span>
              <span className="offer-metric__value">{(offer.months || offer.term)} Months</span>
            </div>
            <div className="offer-metric">
              <span className="offer-metric__label">{getPaymentFrequencyLabel(offer.paymentFrequency)}</span>
              <span className="offer-metric__value">${(offer.monthlyPayment || offer.paymentAmount)?.toFixed(2)}</span>
            </div>
          </>
        )}
      </div>

      {offer.description && (
        <p className="offer-card__description">{offer.description}</p>
      )}

      {offer.warning && (
        <div className="offer-card__warning">{offer.warning}</div>
      )}

      <button className="offer-card__button" onClick={() => onSelect(offer)}>
        Select Offer
      </button>
    </div>
  )
}
