import React, { useState } from 'react'
import EquipmentHvac from '../icons/EquipmentHvac'
import EquipmentWaterheater from '../icons/EquipmentWaterheater'
import EquipmentGenerator from '../icons/EquipmentGenerator'
import EquipmentHalo from '../icons/EquipmentHalo'

const MAX_SYSTEMS = 3

const SYSTEM_ICON_MAP = {
  'HVAC': EquipmentHvac,
  'Water Heater': EquipmentWaterheater,
  'Water Heater Tankless': EquipmentWaterheater,
  'Water Filter/Softener': EquipmentHalo,
  'Generator': EquipmentGenerator,
}

export default function SystemSelection({ projects, setProjects, companyConfig, onNext }) {
  const [selectedSystem, setSelectedSystem] = useState('')
  const [retailPrice, setRetailPrice] = useState('')
  const [error, setError] = useState('')

  const systemTypes = companyConfig?.systemTypes || []
  const maxApproval = companyConfig?.maxApprovalAmount || Infinity
  const currentTotal = projects.reduce((sum, p) => sum + p.retailPrice, 0)
  const atMaxSystems = projects.length >= MAX_SYSTEMS

  const handleAddToCart = () => {
    if (atMaxSystems) {
      setError(`Maximum of ${MAX_SYSTEMS} systems allowed`)
      return
    }
    if (!selectedSystem) {
      setError('Please select a system type')
      return
    }
    const price = Number(retailPrice)
    if (!price || price <= 0) {
      setError('Please enter a valid price')
      return
    }

    setProjects([...projects, { projectType: selectedSystem, retailPrice: price }])
    setSelectedSystem('')
    setRetailPrice('')
    setError('')
  }

  const handleRemove = (index) => {
    setProjects(projects.filter((_, i) => i !== index))
  }

  const handleNext = () => {
    if (projects.length === 0) {
      setError('Please add at least one system to continue')
      return
    }
    onNext()
  }

  return (
    <div className="form-step">
      <h2>Add Quote</h2>
      <h3>Step 1: Select Your System</h3>

      <div className="system-cards">
        {systemTypes.map((type) => {
          const IconComponent = SYSTEM_ICON_MAP[type]
          return (
            <div
              key={type}
              className={`system-card${selectedSystem === type ? ' system-card--selected' : ''}${atMaxSystems ? ' system-card--disabled' : ''}`}
              onClick={() => { if (!atMaxSystems) { setSelectedSystem(type); setError('') } }}
            >
              <div className="system-card__icon">
                {IconComponent ? <IconComponent width={60} height={45} /> : null}
              </div>
              <div className="system-card__name">{type}</div>
            </div>
          )
        })}
      </div>

      <h3>Step 2: Enter System Details</h3>

      <div className="system-details">
        <div className="form-field">
          <label>Total Retail Price <span className="required">*</span></label>
          <div className="price-input-wrapper">
            <span className="price-prefix">$</span>
            <input
              type="number"
              value={retailPrice}
              onChange={(e) => { setRetailPrice(e.target.value); setError('') }}
              placeholder="0.00"
              min="0"
              disabled={atMaxSystems}
            />
          </div>
        </div>
        <button
          className="btn btn-add-cart"
          onClick={handleAddToCart}
          disabled={atMaxSystems}
        >
          + Add to Cart
        </button>
      </div>

      {error && <div className="field-error" style={{ marginTop: 8 }}>{error}</div>}

      {projects.length > 0 && (
        <div className="projects-list">
          <h3>Added Systems ({projects.length}/{MAX_SYSTEMS})</h3>
          {projects.map((p, i) => (
            <div key={i} className="project-item">
              <span>{p.projectType}</span>
              <span>${p.retailPrice.toLocaleString()}</span>
              <button className="btn-remove" onClick={() => handleRemove(i)}>Remove</button>
            </div>
          ))}
          <div className="projects-total">
            <span>Total:</span>
            <span>${currentTotal.toLocaleString()}</span>
          </div>
          <div className="projects-max">
            Max approval: ${maxApproval.toLocaleString()}
          </div>
        </div>
      )}

      <div className="form-actions">
        <div />
        <button className="btn btn-primary" onClick={handleNext}>Next</button>
      </div>
    </div>
  )
}
