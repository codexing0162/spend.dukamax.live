import React from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../../context/AppContext'
import { useTheme } from '../../hooks/useTheme'
import { useLanguage } from '../../hooks/useLanguage'

function Header() {
  const { currentSession, language, setLanguage } = useAppContext()
  const { theme, toggleTheme, isDark } = useTheme()
  const { t } = useLanguage()

  const themeIcon = theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '🌓'

  return (
    <motion.header
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--header-height)',
        background: isDark
          ? 'rgba(15,15,26,0.9)'
          : 'rgba(248,249,254,0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: '12px',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
        <motion.div
          style={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            boxShadow: '0 4px 12px rgba(108,99,255,0.35)',
          }}
          whileTap={{ scale: 0.9 }}
        >
          💰
        </motion.div>

        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1.1 }}>
            PesaSafari
          </div>
          {currentSession ? (
            <div
              style={{
                fontSize: '0.7rem',
                color: 'var(--primary)',
                fontWeight: 600,
                lineHeight: 1,
                maxWidth: '140px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {currentSession.name}
            </div>
          ) : (
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: 1 }}>
              {t('appTagline')}
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Language Toggle */}
        <motion.button
          onClick={() => setLanguage(language === 'en' ? 'sw' : 'en')}
          style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '5px 10px',
            cursor: 'pointer',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: 'var(--primary)',
            fontFamily: 'var(--font)',
            letterSpacing: '0.03em',
          }}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
          title="Toggle Language"
        >
          {language === 'en' ? 'SW' : 'EN'}
        </motion.button>

        {/* Theme Toggle */}
        <motion.button
          onClick={toggleTheme}
          style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            width: 34,
            height: 34,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
          }}
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.05 }}
          title={`Theme: ${theme}`}
        >
          {themeIcon}
        </motion.button>
      </div>
    </motion.header>
  )
}

export default Header
