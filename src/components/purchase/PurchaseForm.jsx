import React, { useState, useEffect, useRef } from 'react'
import Modal from '../common/Modal'
import Button from '../common/Button'
import { addPurchase } from '../../db/purchases'
import { getAllProducts, getProductStats } from '../../db/priceHistory'
import { useLanguage } from '../../hooks/useLanguage'
import { CATEGORIES, getCategoryColor, getCategoryIcon } from '../../utils/calculations'
import { formatCurrency } from '../../utils/formatters'

function PurchaseForm({ isOpen, onClose, sessionId, currency = 'TZS', onAdded }) {
  const { t } = useLanguage()
  const [form, setForm] = useState({
    productName: '',
    amount: '',
    shopName: '',
    category: 'Other',
    notes: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [priceStats, setPriceStats] = useState(null)
  const productInputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      getAllProducts().then(setAllProducts)
    }
  }, [isOpen])

  useEffect(() => {
    if (form.productName.trim().length >= 2) {
      const query = form.productName.toLowerCase()
      const matches = allProducts.filter((p) => p.toLowerCase().includes(query)).slice(0, 5)
      setSuggestions(matches)
      setShowSuggestions(matches.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
      setPriceStats(null)
    }
  }, [form.productName, allProducts])

  const handleProductSelect = async (product) => {
    setForm((prev) => ({ ...prev, productName: product }))
    setShowSuggestions(false)
    const stats = await getProductStats(product)
    setPriceStats(stats)
  }

  const validate = () => {
    const e = {}
    if (!form.productName.trim()) e.productName = 'Product name is required'
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      e.amount = 'Valid amount is required'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)
    try {
      const purchase = await addPurchase({ ...form, sessionId })
      onAdded && onAdded(purchase)
      setForm({ productName: '', amount: '', shopName: '', category: 'Other', notes: '' })
      setErrors({})
      setPriceStats(null)
      onClose()
    } catch (err) {
      console.error('Failed to add purchase:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  // Price comparison hint
  const getPriceHint = () => {
    if (!priceStats || !form.amount) return null
    const current = Number(form.amount)
    if (isNaN(current) || current <= 0) return null

    const diff = current - priceStats.lastPrice
    const pct = Math.abs(Math.round((diff / priceStats.lastPrice) * 100))

    if (Math.abs(diff) < priceStats.lastPrice * 0.01) {
      return { text: t('samePriceAs'), color: '#6C63FF', icon: '↔' }
    }
    if (diff < 0) {
      return { text: `${pct}% ${t('cheaper')}`, color: '#22c55e', icon: '↓' }
    }
    return { text: `${pct}% ${t('expensive')}`, color: '#ef4444', icon: '↑' }
  }

  const priceHint = getPriceHint()

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('addNewPurchase')}>
      <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
        {/* Product Name with Autocomplete */}
        <div className="form-group" style={{ position: 'relative' }}>
          <label className="input-label">{t('productName')} *</label>
          <input
            ref={productInputRef}
            className="input-base"
            type="text"
            placeholder={t('productNamePlaceholder')}
            value={form.productName}
            onChange={(e) => handleChange('productName', e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            autoComplete="off"
            autoFocus
          />
          {errors.productName && (
            <span style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>{errors.productName}</span>
          )}

          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                boxShadow: 'var(--shadow)',
                zIndex: 10,
                overflow: 'hidden',
              }}
            >
              {suggestions.map((s) => (
                <div
                  key={s}
                  onMouseDown={() => handleProductSelect(s)}
                  style={{
                    padding: '10px 14px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    color: 'var(--text)',
                    borderBottom: '1px solid var(--border)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--glass-bg)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '')}
                >
                  🔍 {s}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price History Hint */}
        {priceStats && (
          <div
            style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              marginBottom: '16px',
              fontSize: '0.82rem',
            }}
          >
            <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
              📊 {t('priceHistory')}
            </div>
            <div style={{ color: 'var(--text-muted)' }}>
              {t('lastBought')}: <strong style={{ color: 'var(--primary)' }}>{formatCurrency(priceStats.lastPrice, currency)}</strong>
            </div>
            <div style={{ color: 'var(--text-muted)' }}>
              {t('avgPrice')}: <strong>{formatCurrency(priceStats.avgPrice, currency)}</strong>
            </div>
            {priceHint && (
              <div style={{ marginTop: '4px', color: priceHint.color, fontWeight: 600 }}>
                {priceHint.icon} {priceHint.text}
              </div>
            )}
          </div>
        )}

        {/* Amount */}
        <div className="form-group">
          <label className="input-label">{t('amount')} *</label>
          <div style={{ position: 'relative' }}>
            <input
              className="input-base"
              type="number"
              inputMode="numeric"
              placeholder={t('amountPlaceholder')}
              value={form.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              min="1"
              style={{ paddingRight: '60px' }}
            />
            <span
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                fontSize: '0.82rem',
                fontWeight: 600,
                pointerEvents: 'none',
              }}
            >
              {currency}
            </span>
          </div>
          {errors.amount && (
            <span style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>{errors.amount}</span>
          )}
        </div>

        {/* Category */}
        <div className="form-group">
          <label className="input-label">{t('category')}</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {CATEGORIES.map((cat) => {
              const isSelected = form.category === cat
              const color = getCategoryColor(cat)
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleChange('category', cat)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '20px',
                    border: `1.5px solid ${isSelected ? color : 'var(--border)'}`,
                    background: isSelected ? `${color}22` : 'transparent',
                    color: isSelected ? color : 'var(--text-muted)',
                    fontSize: '0.78rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    fontFamily: 'var(--font)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {getCategoryIcon(cat)} {cat}
                </button>
              )
            })}
          </div>
        </div>

        {/* Shop Name */}
        <div className="form-group">
          <label className="input-label">{t('shopName')}</label>
          <input
            className="input-base"
            type="text"
            placeholder={t('shopNamePlaceholder')}
            value={form.shopName}
            onChange={(e) => handleChange('shopName', e.target.value)}
          />
        </div>

        {/* Notes */}
        <div className="form-group">
          <label className="input-label">{t('notes')}</label>
          <input
            className="input-base"
            type="text"
            placeholder={t('notesPlaceholder')}
            value={form.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
          <Button variant="ghost" size="md" onClick={onClose} style={{ flex: 1 }}>
            {t('cancel')}
          </Button>
          <Button type="submit" variant="primary" size="md" loading={loading} style={{ flex: 2 }}>
            {t('save')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default PurchaseForm
