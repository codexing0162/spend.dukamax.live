import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Modal from '../common/Modal'
import Button from '../common/Button'
import { createSession } from '../../db/sessions'
import { useLanguage } from '../../hooks/useLanguage'
import { useAppContext } from '../../context/AppContext'

const CURRENCIES = ['TZS', 'KES', 'UGX', 'USD', 'EUR', 'GBP']

function SessionForm({ isOpen, onClose, onCreated }) {
  const { t } = useLanguage()
  const { currency: defaultCurrency, refreshSession } = useAppContext()

  const [form, setForm] = useState({
    name: '',
    budget: '',
    currency: defaultCurrency || 'TZS',
    startDate: new Date().toISOString().split('T')[0],
    notes: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Session name is required'
    if (!form.budget || isNaN(Number(form.budget)) || Number(form.budget) <= 0)
      e.budget = 'Valid budget amount is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)
    try {
      const session = await createSession(form)
      await refreshSession()
      onCreated && onCreated(session)
      setForm({
        name: '',
        budget: '',
        currency: defaultCurrency || 'TZS',
        startDate: new Date().toISOString().split('T')[0],
        notes: '',
      })
      setErrors({})
      onClose()
    } catch (err) {
      console.error('Failed to create session:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('newSession')}>
      <form onSubmit={handleSubmit}>
        {/* Session Name */}
        <div className="form-group">
          <label className="input-label">{t('sessionName')} *</label>
          <input
            className="input-base"
            type="text"
            placeholder={t('sessionNamePlaceholder')}
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            autoFocus
          />
          {errors.name && (
            <span style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>{errors.name}</span>
          )}
        </div>

        {/* Budget + Currency Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', marginBottom: '16px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="input-label">{t('budget')} *</label>
            <input
              className="input-base"
              type="number"
              inputMode="numeric"
              placeholder={t('budgetPlaceholder')}
              value={form.budget}
              onChange={(e) => handleChange('budget', e.target.value)}
              min="1"
            />
            {errors.budget && (
              <span style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>{errors.budget}</span>
            )}
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="input-label">{t('currency')}</label>
            <select
              className="input-base"
              value={form.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              style={{ paddingRight: '8px' }}
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Start Date */}
        <div className="form-group">
          <label className="input-label">{t('startDate')}</label>
          <input
            className="input-base"
            type="date"
            value={form.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
          />
        </div>

        {/* Notes */}
        <div className="form-group">
          <label className="input-label">{t('notes')}</label>
          <textarea
            className="input-base"
            placeholder={t('notesPlaceholder')}
            value={form.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows={2}
            style={{ resize: 'vertical', minHeight: '60px' }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
          <Button variant="ghost" size="md" onClick={onClose} style={{ flex: 1 }}>
            {t('cancel')}
          </Button>
          <Button type="submit" variant="primary" size="md" loading={loading} style={{ flex: 2 }}>
            {t('createSession')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default SessionForm
