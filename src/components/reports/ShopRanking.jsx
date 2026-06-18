import React from 'react'
import { motion } from 'framer-motion'
import { formatCurrency } from '../../utils/formatters'
import { useLanguage } from '../../hooks/useLanguage'

const SHOP_COLORS = ['#6C63FF', '#FF6584', '#22c55e', '#f59e0b', '#3b82f6', '#ec4899']

function ShopRanking({ shops, totalSpent, currency = 'TZS' }) {
  const { t } = useLanguage()

  if (!shops || shops.length === 0) {
    return (
      <div className="empty-state" style={{ padding: '24px' }}>
        <div className="empty-icon">🏪</div>
        <p>{t('noPurchasesYet')}</p>
      </div>
    )
  }

  const max = shops[0]?.total || 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {shops.map((shop, index) => {
        const color = SHOP_COLORS[index % SHOP_COLORS.length]
        const pct = totalSpent > 0 ? (shop.total / totalSpent) * 100 : 0
        const barWidth = (shop.total / max) * 100

        return (
          <motion.div
            key={shop.shopName}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.06, duration: 0.3 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '6px',
                    background: `${color}22`,
                    border: `1px solid ${color}44`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color,
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </span>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>
                    {shop.shopName || 'Unknown Shop'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {shop.count} {t('visits')}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>
                  {formatCurrency(shop.total, currency)}
                </div>
                <div style={{ fontSize: '0.72rem', color, fontWeight: 600 }}>
                  {pct.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${barWidth}%` }}
                transition={{ delay: index * 0.06 + 0.2, duration: 0.6, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  background: color,
                  borderRadius: 3,
                }}
              />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default ShopRanking
