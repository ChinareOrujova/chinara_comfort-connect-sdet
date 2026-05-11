import React from 'react'

export default function CompanySwitchModal({ onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-icon">&#9888;</div>
        <h2>Switching companies will reset your application. All progress will be lost.</h2>
        <div className="modal-actions">
          <button className="btn btn-primary" onClick={onConfirm}>Continue</button>
          <span className="modal-cancel-link" onClick={onCancel}>Cancel</span>
        </div>
      </div>
    </div>
  )
}
