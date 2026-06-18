import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function Modal({ isOpen, onClose, title, children, maxWidth = '480px' }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              zIndex: 1000,
            }}
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1001,
              maxWidth,
              margin: '0 auto',
            }}
          >
            <div
              style={{
                background: 'var(--bg)',
                borderRadius: '24px 24px 0 0',
                padding: '0',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 -8px 40px rgba(0,0,0,0.3)',
              }}
            >
              {/* Handle bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '12px',
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 4,
                    background: 'var(--border)',
                    borderRadius: 2,
                  }}
                />
              </div>

              {/* Header */}
              {title && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 20px 16px',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>
                    {title}
                  </h3>
                  <button
                    onClick={onClose}
                    style={{
                      background: 'var(--glass-bg)',
                      border: '1px solid var(--border)',
                      borderRadius: '50%',
                      width: 32,
                      height: 32,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-muted)',
                      fontSize: '1.1rem',
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Content */}
              <div style={{ padding: '20px' }}>{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Modal
