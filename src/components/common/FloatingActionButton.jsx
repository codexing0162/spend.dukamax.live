import React, { useRef } from 'react'
import { motion } from 'framer-motion'

function FloatingActionButton({ onClick, icon = '+', label, color = 'var(--primary)' }) {
  const btnRef = useRef(null)

  const handleClick = (e) => {
    // Ripple effect
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      const ripple = document.createElement('span')
      const size = Math.max(rect.width, rect.height)
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255,255,255,0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        left: ${e.clientX - rect.left - size / 2}px;
        top: ${e.clientY - rect.top - size / 2}px;
        pointer-events: none;
      `
      btnRef.current.appendChild(ripple)
      setTimeout(() => ripple.remove(), 600)
    }
    onClick && onClick()
  }

  return (
    <motion.button
      ref={btnRef}
      onClick={handleClick}
      style={{
        position: 'fixed',
        bottom: 'calc(var(--nav-height) + 20px)',
        right: '20px',
        width: 60,
        height: 60,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${color} 0%, var(--primary-dark) 100%)`,
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.6rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(108,99,255,0.4)',
        zIndex: 100,
        overflow: 'hidden',
        fontFamily: 'var(--font)',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.1, boxShadow: '0 8px 30px rgba(108,99,255,0.5)' }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      aria-label={label || 'Add'}
    >
      {/* Pulse ring */}
      <motion.div
        style={{
          position: 'absolute',
          inset: -4,
          borderRadius: '50%',
          border: '2px solid rgba(108,99,255,0.4)',
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span style={{ position: 'relative', zIndex: 1, lineHeight: 1 }}>{icon}</span>
    </motion.button>
  )
}

export default FloatingActionButton
