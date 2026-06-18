import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Badge from '../common/Badge'
import { formatCurrency, getTimeSince } from '../../utils/formatters'
import { useLanguage } from '../../hooks/useLanguage'

function PurchaseItem({ purchase, onDelete, currency = 'TZS' }) {
  const { t } = useLanguage()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = () => {
    if (showConfirm) {
      onDelete && onDelete(purchase.id)
    } else {
      setShowConfirm(true)
      setTimeout(() => setShowConfirm(false), 3000)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 14px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        marginBottom: '8px',
      }}
    >
      {/* Category Icon Circle */}
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: '12px',
          background: 'var(--glass-bg)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
          flexShrink: 0,
        }}
      >
        {purchase.category === 'Food' ? '🥦' :
         purchase.category === 'Transport' ? '🚗' :
         purchase.category === 'Drinks' ? '🥤' :
         purchase.category === 'Supplies' ? '📦' :
         purchase.category === 'Wholesale' ? '🏪' :
         purchase.category === 'Retail' ? '🛍️' :
         purchase.category === 'Electronics' ? '📱' :
         purchase.category === 'Clothing' ? '👕' : '📌'}
      </div>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '0.9rem',
            fontWeight: 600,
            color: 'var(--text)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {purchase.productName}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px', flexWrap: 'wrap' }}>
          {purchase.shopName && (
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              🏬 {purchase.shopName}
            </span>
          )}
          <Badge category={purchase.category} size="sm" />
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            {getTimeSince(purchase.createdAt)}
          </span>
        </div>
      </div>

      {/* Amount */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)' }}>
          {formatCurrency(purchase.amount, currency)}
        </div>

        {/* Delete Button */}
        <AnimatePresence mode="wait">
          {showConfirm ? (
            <motion.button
              key="confirm"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={handleDelete}
              style={{
                marginTop: '4px',
                padding: '2px 8px',
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '6px',
                color: '#ef4444',
                fontSize: '0.68rem',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'var(--font)',
              }}
            >
              Confirm
            </motion.button>
          ) : (
            <motion.button
              key="delete"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleDelete}
              style={{
                marginTop: '4px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                padding: '2px 4px',
              }}
            >
              🗑
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default PurchaseItem
