import React from 'react'

/**
 * Modal shown when user clicks "Decline Offer" on the Premier card.
 *
 * Production behavior:
 * - Cannot close by clicking outside or clicking X
 * - Two options: "Show me offers" (primary) and "Return to Premier Program" (text link)
 */
export default function PremierDeclineModal({ onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-icon">&#9888;</div>
        <h2>Would you like to explore other financing offers?</h2>
        <div className="modal-actions">
          <button className="btn btn-confirm" onClick={onConfirm}>
            Show me offers
          </button>
          <span className="modal-cancel-link" onClick={onCancel}>
            Return to Premier Program
          </span>
        </div>
      </div>
    </div>
  )
}
