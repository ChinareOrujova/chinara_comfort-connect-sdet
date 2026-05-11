import React from 'react'

/**
 * Processing screen shown after form submission while underwriting runs.
 * Mirrors guestMFE's ModDecisionMaking component with the
 * "Processing Your Application" message.
 * Displays for at least 5 seconds before showing the decision.
 */
export default function ProcessingScreen({ message }) {
  return (
    <div className="processing-screen">
      <div className="processing-icon">
        <svg viewBox="0 0 100 100" width="80" height="80">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#002F6C" strokeWidth="6" strokeDasharray="200" strokeDashoffset="60">
            <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
      <h1 className="processing-title">{message || 'Processing Your Application'}</h1>
      <p className="processing-subtitle">This may take a moment. Please do not refresh the page.</p>
    </div>
  )
}
