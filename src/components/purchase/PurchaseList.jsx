import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PurchaseItem from './PurchaseItem'
import { useLanguage } from '../../hooks/useLanguage'
import { CATEGORIES } from '../../utils/calculations'

function PurchaseList({ purchases, onDelete, currency = 'TZS' }) {
  const { t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', ...CATEGORIES.filter((c) => purchases.some((p) => p.category === c))]

  const filtered =
    activeCategory === 'All'
      ? purchases
      : purchases.filter((p) => p.category === activeCategory)

  if (purchases.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🛒</div>
        <h3>{t('noPurchases')}</h3>
        <p>{t('addFirstPurchase')}</p>
      </div>
    )
  }

  return (
    <div>
      {/* Category Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '10px',
          marginBottom: '12px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '5px 14px',
                borderRadius: '20px',
                border: `1.5px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`,
                background: isActive ? 'rgba(108,99,255,0.15)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                fontSize: '0.78rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                fontFamily: 'var(--font)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.15s ease',
              }}
            >
              {cat === 'All' ? t('allCategories') : cat}
              <span style={{ marginLeft: '4px', opacity: 0.7, fontSize: '0.7rem' }}>
                ({cat === 'All' ? purchases.length : purchases.filter((p) => p.category === cat).length})
              </span>
            </button>
          )
        })}
      </div>

      {/* Purchase Items */}
      <AnimatePresence>
        {filtered.map((purchase) => (
          <PurchaseItem
            key={purchase.id}
            purchase={purchase}
            onDelete={onDelete}
            currency={currency}
          />
        ))}
      </AnimatePresence>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          No purchases in this category
        </div>
      )}
    </div>
  )
}

export default PurchaseList
