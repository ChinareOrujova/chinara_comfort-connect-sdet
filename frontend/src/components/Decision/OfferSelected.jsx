import React from 'react'

function getPaymentFrequencyLabel(frequency) {
  switch (frequency) {
    case 'semi-monthly': return 'Semi-Monthly Payment'
    case '14-day': return '14-day Payment'
    case '28-day': return '28-day Payment'
    default: return 'Monthly Payment'
  }
}

export default function OfferSelected({ selectedOffer }) {
  const isPremier = selectedOffer.type === 'premier'
  const isLoan = selectedOffer.type === 'loan'
  const isLeaseToOwn = selectedOffer.type === 'leaseToOwn'

  const title = isPremier
    ? 'Premier Program\u00AE Offer Selected'
    : isLoan
    ? 'Loan Offer Selected'
    : 'Lease-to-Own Offer Selected'

  const subtitle = isPremier
    ? 'Customer has selected a worry free Premier Program\u00AE offer.'
    : isLoan
    ? 'Loan application approved. Your offer has been confirmed.'
    : 'Lease-to-Own approved. Your offer has been confirmed.'

  return (
    <div className="decision-screen offer-selected">
      <div className="decision-header decision-header--success">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="selected-offer-details">
        <div className="selected-offer-metrics">
          {isPremier && (
            <>
              <div className="offer-metric">
                <span className="offer-metric__label">Monthly Payment</span>
                <span className="offer-metric__value">${selectedOffer.monthlyPayment?.toFixed(2)}</span>
              </div>
              <div className="offer-metric">
                <span className="offer-metric__label">APR</span>
                <span className="offer-metric__value">{selectedOffer.apr}%</span>
              </div>
              <div className="offer-metric">
                <span className="offer-metric__label">Term</span>
                <span className="offer-metric__value">{selectedOffer.termMonths} Months</span>
              </div>
            </>
          )}
          {isLoan && (
            <>
              <div className="offer-metric">
                <span className="offer-metric__label">Approved</span>
                <span className="offer-metric__value">${selectedOffer.approvedAmount?.toLocaleString()}</span>
              </div>
              <div className="offer-metric">
                <span className="offer-metric__label">APR</span>
                <span className="offer-metric__value">{selectedOffer.apr}%</span>
              </div>
              <div className="offer-metric">
                <span className="offer-metric__label">Total Term</span>
                <span className="offer-metric__value">{selectedOffer.termMonths} Months</span>
              </div>
              <div className="offer-metric">
                <span className="offer-metric__label">Monthly Payment</span>
                <span className="offer-metric__value">${selectedOffer.monthlyPayment?.toFixed(2)}</span>
              </div>
            </>
          )}
          {isLeaseToOwn && (
            <>
              <div className="offer-metric">
                <span className="offer-metric__label">Approved</span>
                <span className="offer-metric__value">${(selectedOffer.leaseAmount || selectedOffer.approvedAmount)?.toLocaleString()}</span>
              </div>
              <div className="offer-metric">
                <span className="offer-metric__label">Total Term</span>
                <span className="offer-metric__value">{(selectedOffer.months || selectedOffer.term)} Months</span>
              </div>
              <div className="offer-metric">
                <span className="offer-metric__label">{getPaymentFrequencyLabel(selectedOffer.paymentFrequency)}</span>
                <span className="offer-metric__value">${(selectedOffer.monthlyPayment || selectedOffer.paymentAmount)?.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <p className="terminal-message">
        Your prequalification is complete. You will be redirected to finalize your financing process.
      </p>
    </div>
  )
}
