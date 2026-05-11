import React from 'react'

/**
 * Shown when loan partner offers are rejected.
 * Informs user they may still qualify for Lease-to-Own
 * and provides "Apply for Lease-to-Own" button.
 */
export default function LoanDeclinedScreen({ onApplyForLeaseToOwn }) {
  return (
    <div className="decision-screen loan-declined">
      <div className="decision-header">
        <div className="decline-icon">&#9888;</div>
        <h1>Loan Application Declined</h1>
        <p className="leaseToOwn-eligible-message">
          You may still qualify for our Lease-to-Own plan.
        </p>
      </div>

      <div className="decision-actions">
        <button className="btn btn-leaseToOwn" onClick={onApplyForLeaseToOwn}>
          Apply for Lease-to-Own
        </button>
      </div>
    </div>
  )
}
