import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { formatCurrency, formatPercent } from '../../utils/formatters'
import { calcSpentPercent } from '../../utils/calculations'

function BudgetRing({ spent = 0, budget = 0, currency = 'TZS', size = 160 }) {
  const [animatedPercent, setAnimatedPercent] = useState(0)
  const percent = calcSpentPercent(spent, budget)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedPercent(percent), 100)
    return () => clearTimeout(timer)
  }, [percent])

  const strokeWidth = 12
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2

  // Color based on percent
  let ringColor = '#22c55e'
  if (percent >= 100) ringColor = '#ef4444'
  else if (percent >= 90) ringColor = '#ef4444'
  else if (percent >= 75) ringColor = '#f97316'
  else if (percent >= 50) ringColor = '#f59e0b'

  const remaining = Math.max(0, budget - spent)

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* SVG Ring */}
      <svg
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)', position: 'absolute' }}
        aria-hidden="true"
      >
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={strokeWidth}
        />

        {/* Progress arc */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: circumference - (animatedPercent / 100) * circumference,
          }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
          style={{
            filter: `drop-shadow(0 0 6px ${ringColor}88)`,
          }}
        />
      </svg>

      {/* Center Text */}
      <div
        style={{
          textAlign: 'center',
          zIndex: 1,
        }}
      >
        <motion.div
          style={{
            fontSize: size > 140 ? '1.6rem' : '1.2rem',
            fontWeight: 800,
            color: '#fff',
            lineHeight: 1,
          }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        >
          {Math.round(animatedPercent)}%
        </motion.div>
        <div
          style={{
            fontSize: '0.65rem',
            color: 'rgba(255,255,255,0.75)',
            fontWeight: 500,
            marginTop: '4px',
          }}
        >
          used
        </div>
        {size > 120 && (
          <div
            style={{
              fontSize: '0.6rem',
              color: 'rgba(255,255,255,0.6)',
              marginTop: '2px',
              fontWeight: 500,
            }}
          >
            {formatCurrency(remaining, currency)} left
          </div>
        )}
      </div>
    </div>
  )
}

export default BudgetRing
