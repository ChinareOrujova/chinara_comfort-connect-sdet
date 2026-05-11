import React, { useState, useEffect, useCallback } from 'react'
import ApplicantInfo from './components/PrequalForm/ApplicantInfo'
import IncomeInfo from './components/PrequalForm/IncomeInfo'
import ReviewSubmit from './components/PrequalForm/ReviewSubmit'
import SystemSelection from './components/PrequalForm/SystemSelection'
import CompanyBanner from './components/CompanyBanner/CompanyBanner'
import CompanySwitchModal from './components/CompanyBanner/CompanySwitchModal'
import DecisionScreen from './components/Decision/DecisionScreen'
import ProcessingScreen from './components/Decision/ProcessingScreen'
import { submitApplication, fetchCompanies, fetchCompanyConfig } from './services/api'
import { validateApplicantInfo, validateIncomeInfo, hasErrors } from './utils/validation'
import './styles/App.css'

const INITIAL_APPLICANT = {
  firstName: '', lastName: '', email: '', phone: '',
  dateOfBirth: '', ssn: '', street: '', city: '', state: '', zipCode: '',
}

const INITIAL_INCOME = {
  incomeSource: '', preTaxAnnualIncome: '', additionalAnnualIncome: '',
  monthlyHousingExpense: '',
}

export default function App() {
  // Company state
  const [companies, setCompanies] = useState([])
  const [selectedCompanyId, setSelectedCompanyId] = useState('')
  const [companyConfig, setCompanyConfig] = useState(null)
  const [applicationStarted, setApplicationStarted] = useState(false)
  const [showSwitchModal, setShowSwitchModal] = useState(false)
  const [pendingCompanyId, setPendingCompanyId] = useState(null)

  // Form flow: 1=Systems, 2=Applicant, 3=Income, 4=Review, 5=Processing, 6=Decision
  const [step, setStep] = useState(1)
  const [projects, setProjects] = useState([])
  const [applicantData, setApplicantData] = useState(INITIAL_APPLICANT)
  const [incomeData, setIncomeData] = useState(INITIAL_INCOME)
  const [applicantErrors, setApplicantErrors] = useState({})
  const [incomeErrors, setIncomeErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [result, setResult] = useState(null)

  // Load companies on mount
  useEffect(() => {
    fetchCompanies().then((list) => {
      setCompanies(list)
      if (list.length > 0) {
        setSelectedCompanyId(list[0].id)
        fetchCompanyConfig(list[0].id).then(setCompanyConfig)
      }
    })
  }, [])

  const resetApplication = useCallback(() => {
    setStep(1)
    setProjects([])
    setApplicantData(INITIAL_APPLICANT)
    setIncomeData(INITIAL_INCOME)
    setApplicantErrors({})
    setIncomeErrors({})
    setIsSubmitting(false)
    setSubmitError(null)
    setResult(null)
    setApplicationStarted(false)
  }, [])

  const handleCompanyChange = (newCompanyId) => {
    if (newCompanyId === selectedCompanyId) return
    if (applicationStarted) {
      setPendingCompanyId(newCompanyId)
      setShowSwitchModal(true)
    } else {
      setSelectedCompanyId(newCompanyId)
      fetchCompanyConfig(newCompanyId).then(setCompanyConfig)
    }
  }

  const handleSwitchConfirm = () => {
    setShowSwitchModal(false)
    resetApplication()
    setSelectedCompanyId(pendingCompanyId)
    fetchCompanyConfig(pendingCompanyId).then(setCompanyConfig)
    setPendingCompanyId(null)
  }

  const handleSwitchCancel = () => {
    setShowSwitchModal(false)
    setPendingCompanyId(null)
  }

  // Track when application has started (projects added or form fields changed)
  const handleProjectsChange = (newProjects) => {
    setProjects(newProjects)
    if (newProjects.length > 0) setApplicationStarted(true)
  }

  const handleApplicantChange = (e) => {
    const { name, value } = e.target
    setApplicantData((prev) => ({ ...prev, [name]: value }))
    if (value) setApplicationStarted(true)
    if (applicantErrors[name]) {
      setApplicantErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const handleIncomeChange = (e) => {
    const { name, value } = e.target
    setIncomeData((prev) => ({ ...prev, [name]: value }))
    if (value) setApplicationStarted(true)
    if (incomeErrors[name]) {
      setIncomeErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const handleNextFromSystems = () => {
    setStep(2)
  }

  const handleNextFromApplicant = () => {
    const errors = validateApplicantInfo(applicantData)
    setApplicantErrors(errors)
    if (!hasErrors(errors)) setStep(3)
  }

  const handleNextFromIncome = () => {
    const errors = validateIncomeInfo(incomeData)
    setIncomeErrors(errors)
    if (!hasErrors(errors)) setStep(4)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError(null)
    setStep(5) // Show processing screen immediately

    try {
      const payload = {
        applicant: {
          firstName: applicantData.firstName,
          lastName: applicantData.lastName,
          email: applicantData.email,
          phone: applicantData.phone,
          dateOfBirth: applicantData.dateOfBirth,
          ssn: applicantData.ssn.replace(/\D/g, ''),
        },
        income: {
          incomeSource: incomeData.incomeSource,
          preTaxAnnualIncome: Number(incomeData.preTaxAnnualIncome),
          additionalAnnualIncome: Number(incomeData.additionalAnnualIncome) || 0,
          monthlyHousingExpense: Number(incomeData.monthlyHousingExpense),
        },
        address: {
          street: applicantData.street,
          city: applicantData.city,
          state: applicantData.state,
          zipCode: applicantData.zipCode,
        },
        projects: projects,
        companyId: selectedCompanyId,
      }

      // Run API call and 5-second minimum delay in parallel
      const [response] = await Promise.all([
        submitApplication(payload),
        new Promise((resolve) => setTimeout(resolve, 5000)),
      ])

      setResult(response)
      setStep(6) // Move to decision screen
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Failed to submit application. Please try again.')
      setStep(4) // Go back to review on error
    } finally {
      setIsSubmitting(false)
    }
  }

  const progressPercent = step <= 4 ? (step / 4) * 100 : 100
  const showForm = step <= 4

  return (
    <div className="app">
      {companies.length > 0 && (
        <CompanyBanner
          companies={companies}
          selectedCompanyId={selectedCompanyId}
          onCompanyChange={handleCompanyChange}
        />
      )}

      {showSwitchModal && (
        <CompanySwitchModal
          onConfirm={handleSwitchConfirm}
          onCancel={handleSwitchCancel}
        />
      )}

      <header className="app-header">
        <h1>Comfort Connect</h1>
        <p>The All-in-One Financing Solution</p>
      </header>

      <main className="app-main">
        {showForm && (
          <div className="progress-bar">
            <div className="progress-bar__fill" style={{ width: `${progressPercent}%` }} />
            <div className="progress-bar__steps">
              <span className={step >= 1 ? 'active' : ''}>1. Systems</span>
              <span className={step >= 2 ? 'active' : ''}>2. Applicant</span>
              <span className={step >= 3 ? 'active' : ''}>3. Income</span>
              <span className={step >= 4 ? 'active' : ''}>4. Review</span>
            </div>
          </div>
        )}

        {submitError && <div className="error-banner">{submitError}</div>}

        {step === 1 && companyConfig && (
          <SystemSelection
            projects={projects}
            setProjects={handleProjectsChange}
            companyConfig={companyConfig}
            onNext={handleNextFromSystems}
          />
        )}

        {step === 2 && (
          <ApplicantInfo
            data={applicantData}
            errors={applicantErrors}
            onChange={handleApplicantChange}
            onNext={handleNextFromApplicant}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <IncomeInfo
            data={incomeData}
            errors={incomeErrors}
            onChange={handleIncomeChange}
            onNext={handleNextFromIncome}
            onBack={() => setStep(2)}
          />
        )}

        {step === 4 && (
          <ReviewSubmit
            applicantData={applicantData}
            incomeData={incomeData}
            projects={projects}
            onSubmit={handleSubmit}
            onBack={() => setStep(3)}
            isSubmitting={isSubmitting}
          />
        )}

        {step === 5 && <ProcessingScreen />}

        {step === 6 && result && (
          <DecisionScreen
            applicationId={result.applicationId}
            decision={result.decision}
            offers={result.offers}
            loanPartnerApplyEligible={result.loanPartnerApplyEligible}
            leaseToOwnPartnerApplyEligible={result.leaseToOwnPartnerApplyEligible}
          />
        )}
      </main>
    </div>
  )
}
