import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../hooks/useLanguage'

const ADVICE_ICONS = ['💡', '📊', '🛒', '⚠️', '✅', '📉', '📈', '🎯']
const ADVICE_COLORS = [
  { bg: 'rgba(108,99,255,0.1)', border: 'rgba(108,99,255,0.3)', color: '#6C63FF' },
  { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)', color: '#22c55e' },
  { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', color: '#f59e0b' },
  { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', color: '#ef4444' },
]

function SmartAdvisor({ advice = [], compact = false }) {
  const { t } = useLanguage()

  if (!advice || advice.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: compact ? '16px' : '24px',
          background: 'rgba(34,197,94,0.08)',
          border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: 'var(--radius-sm)',
        }}
      >
        <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>✨</div>
        <div style={{ fontWeight: 700, color: '#22c55e', marginBottom: '4px' }}>{t('noAdvice')}</div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{t('noAdviceDesc')}</div>
      </div>
    )
  }

  const displayAdvice = compact ? advice.slice(0, 2) : advice

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {displayAdvice.map((tip, index) => {
        const colorScheme = ADVICE_COLORS[index % ADVICE_COLORS.length]
        const icon = ADVICE_ICONS[index % ADVICE_ICONS.length]

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.3 }}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '12px',
              background: colorScheme.bg,
              border: `1px solid ${colorScheme.border}`,
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <span
              style={{
                fontSize: '1.1rem',
                flexShrink: 0,
                marginTop: '1px',
              }}
            >
              {icon}
            </span>
            <p
              style={{
                fontSize: '0.85rem',
                color: 'var(--text)',
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {tip}
            </p>
          </motion.div>
        )
      })}
    </div>
  )
}

export default SmartAdvisor
