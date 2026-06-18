import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getHealthLabel, getHealthLabelKey } from '../../utils/calculations'
import { useLanguage } from '../../hooks/useLanguage'

function HealthScore({ score = 50, sessions = [] }) {
  const { t } = useLanguage()
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 200)
    return () => clearTimeout(timer)
  }, [score])

  const { label, color } = getHealthLabel(score)
  const labelKey = getHealthLabelKey(score)

  const size = 120
  const strokeWidth = 10
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2

  // Breakdown factors (simplified)
  const factors = [
    {
      label: t('budgetControl'),
      score: score >= 50 ? Math.min(100, score + 10) : score,
      color: '#6C63FF',
    },
    {
      label: t('consistency'),
      score: Math.min(100, sessions.length * 20),
      color: '#22c55e',
    },
    {
      label: t('efficiency'),
      score: score >= 70 ? 85 : score >= 40 ? 60 : 35,
      color: '#f59e0b',
    },
  ]

  return (
    <div>
      {/* Score Circle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
        <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
          <svg
            width={size}
            height={size}
            style={{ transform: 'rotate(-90deg)' }}
          >
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="var(--border)"
              strokeWidth={strokeWidth}
            />
            <motion.circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{
                strokeDashoffset: circumference - (animatedScore / 100) * circumference,
              }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
              style={{ filter: `drop-shadow(0 0 4px ${color}88)` }}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.span
              style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            >
              {Math.round(animatedScore)}
            </motion.span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              /100
            </span>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color, marginBottom: '4px' }}>
            {t(labelKey)}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            {t('healthScoreExplanation')}
          </div>
        </div>
      </div>

      {/* Factor Breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {factors.map((factor, i) => (
          <div key={factor.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text)', fontWeight: 500 }}>
                {factor.label}
              </span>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: factor.color }}>
                {factor.score}%
              </span>
            </div>
            <div style={{ height: 5, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${factor.score}%` }}
                transition={{ delay: i * 0.1 + 0.4, duration: 0.6, ease: 'easeOut' }}
                style={{ height: '100%', background: factor.color, borderRadius: 3 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HealthScore
