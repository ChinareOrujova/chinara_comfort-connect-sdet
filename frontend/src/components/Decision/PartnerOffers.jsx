import React from 'react'
import OfferCard from '../common/OfferCard'

/**
 * Displays partner offers (loan or LTO) with generic labeling.
 *
 * - Cards show "Offer #1", "Offer #2" — no partner names or product types
 * - Each card has "Select Offer" button
 * - If Premier was available and user came from Premier decline,
 *   show "No thanks, I'll go Worry-Free for $X/month!" rollback link
 * - No decline button on this screen
 */
export default function PartnerOffers({ offers, onSelectOffer, premierPayment, onRollbackToPremier }) {
  return (
    <div className="decision-screen partner-offers">
      <div className="decision-header">
        <h1>Financing Options Available</h1>
        <p>Review the following offers and select the one that works best for you.</p>
      </div>

      {offers.length > 0 ? (
        <div className="offers-grid">
          {offers.map((offer, index) => (
            <OfferCard
              key={offer.offerId}
              offer={offer}
              displayName={`Offer #${index + 1}`}
              onSelect={onSelectOffer}
            />
          ))}
        </div>
      ) : (
        <div className="no-offers">
          <p>No offers are available at this time.</p>
        </div>
      )}

      {onRollbackToPremier && premierPayment && (
        <div className="rollback-premier">
          <span className="rollback-premier-link" onClick={onRollbackToPremier}>
            No thanks, I'll go Worry-Free for ${premierPayment.toFixed(2)}/month!
          </span>
        </div>
      )}
    </div>
  )
}
