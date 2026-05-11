import React, { useState, useEffect } from 'react'
import PremierApproved from './PremierApproved'
import PremierDeclineModal from './PremierDeclineModal'
import PartnerOffers from './PartnerOffers'
import LoanDeclinedScreen from './LoanDeclinedScreen'
import OfferSelected from './OfferSelected'
import ApplicationDeclined from './ApplicationDeclined'
import ProcessingScreen from './ProcessingScreen'
import { selectOffer, fetchLoanOffers, fetchLeaseToOwnOffers } from '../../services/api'

const MIN_PROCESSING_MS = 5000

/**
 * Exact production flow (mirrors guestMFE OffersScreen + pipelineAPI FSM):
 *
 * 1. If Premier approved → show Premier offer with "Decline Offer" button
 * 2. Click "Decline Offer" → modal: "Would you like to explore other financing offers?"
 *    - "Show me offers" → POST /offers/:id/loan (initiateLoanPartnerFlow)
 *    - "Return to Premier Program" → close modal, stay on Premier
 * 3. Loan offers shown with generic "Offer #1", "Offer #2" labels
 *    - "Select Offer" on each card
 *    - If Premier was available: "No thanks, I'll go Worry-Free for $X/month!" link
 * 4. If loan partners REJECT → "You may still qualify for Lease-to-Own"
 *    - "Apply for Lease-to-Own" → POST /offers/:id/leaseToOwn (initiateLeaseToOwnPartnerFlow)
 * 5. Lease-to-Own offers shown → select or dead end
 * 6. If Lease-to-Own partners also reject → "Your application couldn't be approved" dead end
 *
 * If Premier rejected/review at underwriting:
 *   → auto-trigger initiateLoanPartnerFlow on mount
 */
export default function DecisionScreen({ applicationId, decision, offers: initialOffers, loanPartnerApplyEligible, leaseToOwnPartnerApplyEligible }) {
  const [screen, setScreen] = useState(() => {
    if (decision.result === 'approved') return 'premier'
    // Premier rejected/review — will show processing then auto-fetch loans
    return 'processingLoans'
  })
  const [offers, setOffers] = useState(initialOffers)
  const [selectedOffer, setSelectedOffer] = useState(null)
  const [showDeclineModal, setShowDeclineModal] = useState(false)
  const [error, setError] = useState(null)
  const [leaseToOwnEligible, setLeaseToOwnEligible] = useState(leaseToOwnPartnerApplyEligible)

  // If Premier rejected/review, auto-fetch loan offers on mount
  const shouldFetchLoans = decision.result !== 'approved'
  useEffect(() => {
    if (shouldFetchLoans) {
      handleFetchLoanOffers()
    }
  }, [shouldFetchLoans]) // eslint-disable-line

  const handleFetchLoanOffers = async () => {
    try {
      setError(null)
      setScreen('processingLoans')
      const startTime = Date.now()
      const result = await fetchLoanOffers(applicationId)

      // Enforce minimum 5-second processing display
      const elapsed = Date.now() - startTime
      if (elapsed < MIN_PROCESSING_MS) {
        await new Promise(resolve => setTimeout(resolve, MIN_PROCESSING_MS - elapsed))
      }

      setOffers(result.offers)
      setLeaseToOwnEligible(result.leaseToOwnPartnerApplyEligible)

      if (result.loanDecision === 'approved' && result.offers.loan?.length > 0) {
        setScreen('loans')
      } else {
        // Loans rejected — show LTO eligibility screen if applicable
        if (result.leaseToOwnPartnerApplyEligible) {
          setScreen('loanDeclined')
        } else {
          setScreen('declined')
        }
      }
    } catch (err) {
      setError('Failed to load offers. Please try again.')
      setScreen('declined')
    }
  }

  // Premier: user clicks "Accept Offer"
  const handleAcceptPremier = async () => {
    try {
      setError(null)
      const result = await selectOffer(applicationId, 'premier', 'premier-offer')
      setSelectedOffer(result.selectedOffer)
      setScreen('selected')
    } catch (err) {
      setError('Failed to accept offer. Please try again.')
    }
  }

  // Premier: user clicks "Decline Offer" → show modal
  const handleDeclineClick = () => {
    setShowDeclineModal(true)
  }

  // Modal: "Return to Premier Program"
  const handleReturnToPremier = () => {
    setShowDeclineModal(false)
  }

  // Modal: "Show me offers" → call initiateLoanPartnerFlow
  const handleShowLoanOffers = async () => {
    setShowDeclineModal(false)
    await handleFetchLoanOffers()
  }

  // Loan/LTO offers: user selects an offer
  const handleSelectOffer = async (offer) => {
    try {
      setError(null)
      const result = await selectOffer(applicationId, offer.partner, offer.offerId)
      setSelectedOffer(result.selectedOffer)
      setScreen('selected')
    } catch (err) {
      setError('Failed to select offer. Please try again.')
    }
  }

  // Loan offers: "No thanks, I'll go Worry-Free for $X/month!" → back to Premier
  const handleRollbackToPremier = () => {
    setScreen('premier')
  }

  // Loan declined: "Apply for Lease-to-Own" → call initiateLeaseToOwnPartnerFlow
  const handleApplyForLeaseToOwn = async () => {
    try {
      setError(null)
      setScreen('processingLeaseToOwn')
      const startTime = Date.now()
      const result = await fetchLeaseToOwnOffers(applicationId)

      // Enforce minimum 5-second processing display
      const elapsed = Date.now() - startTime
      if (elapsed < MIN_PROCESSING_MS) {
        await new Promise(resolve => setTimeout(resolve, MIN_PROCESSING_MS - elapsed))
      }

      setOffers(result.offers)

      if (result.leaseToOwnDecision === 'approved' && result.offers.leaseToOwn?.length > 0) {
        setScreen('leaseToOwn')
      } else {
        setScreen('declined')
      }
    } catch (err) {
      setError('Failed to load lease-to-own offers. Please try again.')
      setScreen('declined')
    }
  }

  const premierPayment = offers.premier?.monthlyPayment

  return (
    <div className="decision-container">
      {error && <div className="error-banner">{error}</div>}

      {/* Processing Screen for Loan Offers */}
      {screen === 'processingLoans' && (
        <ProcessingScreen message="Checking Loan Partner Offers" />
      )}

      {/* Processing Screen for Lease-to-Own Offers */}
      {screen === 'processingLeaseToOwn' && (
        <ProcessingScreen message="Checking Lease-to-Own Offers" />
      )}

      {/* Premier Offer Screen */}
      {screen === 'premier' && offers.premier && (
        <>
          <PremierApproved
            offer={offers.premier}
            onAccept={handleAcceptPremier}
            onDecline={handleDeclineClick}
          />
          {showDeclineModal && (
            <PremierDeclineModal
              onConfirm={handleShowLoanOffers}
              onCancel={handleReturnToPremier}
            />
          )}
        </>
      )}

      {/* Loan Offers Screen */}
      {screen === 'loans' && (
        <PartnerOffers
          offers={offers.loan || []}
          onSelectOffer={handleSelectOffer}
          premierPayment={premierPayment}
          onRollbackToPremier={decision.result === 'approved' ? handleRollbackToPremier : null}
        />
      )}

      {/* Loan Declined → LTO Eligible */}
      {screen === 'loanDeclined' && (
        <LoanDeclinedScreen onApplyForLeaseToOwn={handleApplyForLeaseToOwn} />
      )}

      {/* Lease-to-Own Offers Screen */}
      {screen === 'leaseToOwn' && (
        <PartnerOffers
          offers={offers.leaseToOwn || []}
          onSelectOffer={handleSelectOffer}
        />
      )}

      {/* Offer Selected (terminal) */}
      {screen === 'selected' && selectedOffer && (
        <OfferSelected selectedOffer={selectedOffer} />
      )}

      {/* No offers / all rejected (terminal) */}
      {screen === 'declined' && <ApplicationDeclined />}
    </div>
  )
}
