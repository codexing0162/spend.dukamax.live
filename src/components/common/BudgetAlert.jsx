import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppContext } from '../../context/AppContext'
import { useLanguage } from '../../hooks/useLanguage'

const alertConfig = {
  '50': { emoji: '⚠️', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)', key: 'budgetAlert50' },
  '75': { emoji: '🟠', color: '#f97316', bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.4)', key: 'budgetAlert75' },
  '90': { emoji: '🔴', color: '#ef4444', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.4)', key: 'budgetAlert90' },
  'exceeded': { emoji: '🚨', color: '#dc2626', bg: 'rgba(220,38,38,0.2)', border: 'rgba(220,38,38,0.5)', key: 'budgetAlertExceeded' },
}

function BudgetAlert() {
  const { budgetAlerts, dismissAlert } = useAppContext()
  const { t } = useLanguage()

  const alerts = Object.entries(budgetAlerts)

  return (
    <div
      style={{
        position: 'fixed',
        top: 'calc(var(--header-height) + 8px)',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 500,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: 'calc(100% - 32px)',
        maxWidth: '440px',
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence>
        {alerts.map(([key, alert]) => {
          const config = alertConfig[alert.level] || alertConfig['50']
          const isExceeded = alert.level === 'exceeded'

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              style={{
                background: config.bg,
                border: `1px solid ${config.border}`,
                borderRadius: '14px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: `0 4px 20px ${config.border}`,
                pointerEvents: 'all',
                animation: isExceeded ? 'alertFlash 1s ease-in-out infinite' : 'none',
              }}
            >
              <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{config.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: config.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t('budgetAlertTitle')}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text)', fontWeight: 500, marginTop: '2px' }}>
                  {t(config.key)}
                </div>
              </div>
              <button
                onClick={() => dismissAlert(key)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: config.color,
                  cursor: 'pointer',
                  fontSize: '1rem',
                  padding: '4px',
                  flexShrink: 0,
                }}
              >
                ✕
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export default BudgetAlert
