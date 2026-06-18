import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Badge from '../common/Badge'
import { formatCurrency, formatDate, formatPercent } from '../../utils/formatters'
import { calcSpentPercent } from '../../utils/calculations'
import { useLanguage } from '../../hooks/useLanguage'

function SessionCard({ session, onDelete, onClose, index = 0 }) {
  const { t } = useLanguage()
  const navigate = useNavigate()

  const spent = session.spent || 0
  const budget = session.budget || 0
  const remaining = Math.max(0, budget - spent)
  const percent = calcSpentPercent(spent, budget)
  const isActive = session.status === 'active'

  let barColor = '#22c55e'
  if (percent >= 100) barColor = '#ef4444'
  else if (percent >= 90) barColor = '#ef4444'
  else if (percent >= 75) barColor = '#f97316'
  else if (percent >= 50) barColor = '#f59e0b'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      onClick={() => navigate(`/session/${session.id}`)}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '16px',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.2s ease',
      }}
      whileHover={{ scale: 1.01, boxShadow: 'var(--shadow)' }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Header Row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ flex: 1, minWidth: 0, marginRight: '8px' }}>
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--text)',
              marginBottom: '2px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {session.name}
          </h3>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {formatDate(session.startDate || session.createdAt)}
          </div>
        </div>
        <Badge
          type={isActive ? 'active' : 'closed'}
          label={t(isActive ? 'active' : 'closed')}
          size="sm"
        />
      </div>

      {/* Budget Bar */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            {formatCurrency(spent, session.currency)} / {formatCurrency(budget, session.currency)}
          </span>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: barColor }}>
            {formatPercent(spent, budget)}
          </span>
        </div>
        <div
          style={{
            height: 6,
            background: 'var(--border)',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, percent)}%` }}
            transition={{ duration: 0.8, delay: index * 0.06 + 0.2, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: barColor,
              borderRadius: 3,
            }}
          />
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <div style={{ flex: 1, textAlign: 'center', padding: '8px', background: 'var(--glass-bg)', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>
            {formatCurrency(budget, session.currency)}
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {t('budget')}
          </div>
        </div>
        <div style={{ flex: 1, textAlign: 'center', padding: '8px', background: 'var(--glass-bg)', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: percent > 90 ? '#ef4444' : 'var(--text)' }}>
            {formatCurrency(spent, session.currency)}
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {t('spent')}
          </div>
        </div>
        <div style={{ flex: 1, textAlign: 'center', padding: '8px', background: 'var(--glass-bg)', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: remaining === 0 ? '#ef4444' : '#22c55e' }}>
            {formatCurrency(remaining, session.currency)}
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {t('remaining')}
          </div>
        </div>
      </div>

      {/* Action Row */}
      {(onDelete || onClose) && (
        <div
          style={{ display: 'flex', gap: '8px', marginTop: '12px' }}
          onClick={(e) => e.stopPropagation()}
        >
          {isActive && onClose && (
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '7px',
                background: 'rgba(245,158,11,0.1)',
                border: '1px solid rgba(245,158,11,0.3)',
                borderRadius: '8px',
                color: '#f59e0b',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font)',
              }}
            >
              {t('close')}
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              style={{
                flex: 1,
                padding: '7px',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '8px',
                color: '#ef4444',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font)',
              }}
            >
              {t('delete')}
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default SessionCard
