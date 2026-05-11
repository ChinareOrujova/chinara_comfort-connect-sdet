import React from 'react'

export default function ApplicationDeclined() {
  return (
    <div className="decision-screen application-declined">
      <div className="decision-header decision-header--error">
        <h1>Application Could Not Be Approved</h1>
        <p>
          Unfortunately, we are unable to offer financing options at this time.
          Please contact the contractor for alternative arrangements.
        </p>
      </div>
    </div>
  )
}
