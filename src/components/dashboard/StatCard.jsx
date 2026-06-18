import React from 'react'
import { motion } from 'framer-motion'
import AnimatedCounter from '../common/AnimatedCounter'

function StatCard({ icon, label, value, formatFn, color = 'var(--primary)', delay = 0, sub }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      style={{
        background: 'rgba(255,255,255,0.12)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '16px',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        flex: 1,
        minWidth: 0,
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '10px',
          background: `${color}22`,
          border: `1px solid ${color}44`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
        }}
      >
        {icon}
      </div>

      {/* Value */}
      <div
        style={{
          fontSize: '1.1rem',
          fontWeight: 800,
          color: '#fff',
          lineHeight: 1.1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {formatFn ? (
          <AnimatedCounter value={Number(value) || 0} formatFn={formatFn} />
        ) : (
          value
        )}
      </div>

      {/* Label */}
      <div
        style={{
          fontSize: '0.7rem',
          color: 'rgba(255,255,255,0.7)',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {label}
      </div>

      {/* Sub-label */}
      {sub && (
        <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
          {sub}
        </div>
      )}
    </motion.div>
  )
}

export default StatCard
