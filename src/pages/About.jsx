import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import Card from '../components/common/Card'

const FEATURES = [
  { icon: '📡', key: 'featureOffline' },
  { icon: '📋', key: 'featureMultiSession' },
  { icon: '📈', key: 'featurePriceHistory' },
  { icon: '💡', key: 'featureSmartAdvice' },
  { icon: '📊', key: 'featureReports' },
  { icon: '📱', key: 'featurePWA' },
]

function About() {
  const { t } = useLanguage()
  const navigate = useNavigate()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--primary)',
          fontSize: '0.9rem',
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'var(--font)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          marginBottom: '12px',
          padding: 0,
        }}
      >
        ← {t('back')}
      </button>

      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg, #6C63FF 0%, #4A42CC 50%, #764ba2 100%)',
          borderRadius: 'var(--radius)',
          padding: '32px 24px',
          textAlign: 'center',
          marginBottom: '16px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorations */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', bottom: -30, left: -30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          style={{
            width: 80,
            height: 80,
            borderRadius: '24px',
            background: 'rgba(255,255,255,0.2)',
            border: '2px solid rgba(255,255,255,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            margin: '0 auto 16px',
          }}
        >
          💰
        </motion.div>

        <h1 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 900, marginBottom: '4px' }}>
          DukaMax
        </h1>
        <h2 style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>
          PesaSafari
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem' }}>
          {t('appTagline')}
        </p>

        <div
          style={{
            display: 'inline-block',
            marginTop: '12px',
            padding: '4px 14px',
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '20px',
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          {t('version')} 1.0.0
        </div>
      </div>

      {/* App Info */}
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { label: t('developer'), value: 'Mujeeb (script kiddie)' },
            { label: t('brand'), value: 'DukaMax' },
            { label: t('version'), value: '1.0.0' },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {item.label}
              </span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Description */}
      <Card style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text)' }}>
          About
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          {t('appDescription')}
        </p>
      </Card>

      {/* Features */}
      <Card style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text)' }}>
          ✨ {t('features')}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <span style={{ fontSize: '1.1rem' }}>{f.icon}</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--text)', fontWeight: 500 }}>
                {t(f.key)}
              </span>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Footer */}
      <div
        style={{
          textAlign: 'center',
          padding: '20px',
          color: 'var(--text-muted)',
          fontSize: '0.8rem',
        }}
      >
        <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>
          {t('poweredBy')}
        </div>
        <div>© 2024 DukaMax. {t('allRightsReserved')}</div>
      </div>
    </motion.div>
  )
}

export default About
