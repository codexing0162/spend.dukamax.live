import React from 'react'
import { motion } from 'framer-motion'

function Card({
  children,
  style = {},
  className = '',
  onClick,
  animate = true,
  padding = '16px',
  glass = false,
}) {
  const cardStyle = {
    background: glass ? 'var(--glass-bg)' : 'var(--bg-card)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding,
    boxShadow: 'var(--shadow-sm)',
    cursor: onClick ? 'pointer' : 'default',
    ...style,
  }

  if (!animate) {
    return (
      <div style={cardStyle} className={className} onClick={onClick}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      style={cardStyle}
      className={className}
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      whileHover={onClick ? { scale: 1.01, boxShadow: 'var(--shadow)' } : {}}
      whileTap={onClick ? { scale: 0.99 } : {}}
    >
      {children}
    </motion.div>
  )
}

export default Card
