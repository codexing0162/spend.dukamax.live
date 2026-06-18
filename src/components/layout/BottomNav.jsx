import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLanguage } from '../../hooks/useLanguage'

const NAV_ITEMS = [
  { to: '/', label: 'dashboard', icon: '🏠', activeIcon: '🏠' },
  { to: '/sessions', label: 'sessions', icon: '📋', activeIcon: '📋' },
  { to: '/reports', label: 'reports', icon: '📊', activeIcon: '📊' },
  { to: '/history', label: 'history', icon: '🕒', activeIcon: '🕒' },
  { to: '/settings', label: 'settings', icon: '⚙️', activeIcon: '⚙️' },
]

function BottomNav() {
  const { t } = useLanguage()
  const location = useLocation()

  return (
    <nav
      className="bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'var(--nav-height)',
        background: 'var(--bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 8px',
        zIndex: 200,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.to === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.to)

        return (
          <NavLink
            key={item.to}
            to={item.to}
            style={{ textDecoration: 'none', flex: 1 }}
          >
            <motion.div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                padding: '6px 4px',
                borderRadius: '12px',
                position: 'relative',
              }}
              whileTap={{ scale: 0.88 }}
              animate={{ scale: isActive ? 1.02 : 1 }}
            >
              {/* Active indicator dot */}
              {isActive && (
                <motion.div
                  layoutId="nav-active"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 20,
                    height: 3,
                    background: 'linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 100%)',
                    borderRadius: '0 0 4px 4px',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              {/* Icon */}
              <motion.div
                style={{
                  fontSize: '1.3rem',
                  lineHeight: 1,
                  filter: isActive ? 'none' : 'grayscale(0.5)',
                  opacity: isActive ? 1 : 0.6,
                }}
                animate={{
                  y: isActive ? -1 : 0,
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {item.icon}
              </motion.div>

              {/* Label */}
              <span
                style={{
                  fontSize: '0.62rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  letterSpacing: '0.02em',
                  textTransform: 'capitalize',
                }}
              >
                {t(item.label)}
              </span>
            </motion.div>
          </NavLink>
        )
      })}
    </nav>
  )
}

export default BottomNav
