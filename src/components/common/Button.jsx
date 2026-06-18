import React, { useRef } from 'react'
import { motion } from 'framer-motion'

const variantStyles = {
  primary: {
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
    color: '#fff',
    border: 'none',
  },
  secondary: {
    background: 'var(--glass-bg)',
    color: 'var(--primary)',
    border: '1.5px solid var(--primary)',
  },
  danger: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: '#fff',
    border: 'none',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-muted)',
    border: '1.5px solid var(--border)',
  },
  success: {
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    color: '#fff',
    border: 'none',
  },
}

const sizeStyles = {
  sm: { padding: '6px 14px', fontSize: '0.8rem', borderRadius: '10px' },
  md: { padding: '10px 20px', fontSize: '0.9rem', borderRadius: '12px' },
  lg: { padding: '14px 28px', fontSize: '1rem', borderRadius: '14px' },
  full: { padding: '14px 28px', fontSize: '1rem', borderRadius: '14px', width: '100%' },
}

function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  type = 'button',
  style: extraStyle = {},
  className = '',
  icon,
  loading = false,
}) {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'var(--font)',
    fontWeight: 600,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s ease',
    outline: 'none',
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...extraStyle,
  }

  return (
    <motion.button
      type={type}
      style={baseStyle}
      className={className}
      onClick={disabled || loading ? undefined : onClick}
      whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      whileHover={{ scale: disabled || loading ? 1 : 1.02, boxShadow: disabled ? 'none' : '0 4px 16px rgba(108,99,255,0.3)' }}
      disabled={disabled || loading}
    >
      {loading ? (
        <span
          style={{
            width: 16,
            height: 16,
            border: '2px solid rgba(255,255,255,0.3)',
            borderTopColor: '#fff',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite',
          }}
        />
      ) : icon ? (
        <span style={{ fontSize: '1.1em' }}>{icon}</span>
      ) : null}
      {children}
    </motion.button>
  )
}

export default Button
