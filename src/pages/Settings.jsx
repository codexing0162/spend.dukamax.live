import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { useLanguage } from '../hooks/useLanguage'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { exportToJSON, importFromJSON, clearAllData } from '../utils/export'

const CURRENCIES = ['TZS', 'KES', 'UGX', 'USD', 'EUR', 'GBP']

function SettingRow({ icon, title, subtitle, children }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 0',
        borderBottom: '1px solid var(--border)',
        gap: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: '10px',
            background: 'var(--glass-bg)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>{title}</div>
          {subtitle && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1px' }}>
              {subtitle}
            </div>
          )}
        </div>
      </div>
      <div>{children}</div>
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <div
      style={{
        fontSize: '0.72rem',
        fontWeight: 700,
        color: 'var(--primary)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        padding: '16px 0 8px',
      }}
    >
      {children}
    </div>
  )
}

function Settings() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { theme, setTheme, language, setLanguage, currency, setCurrency, refreshSession } = useAppContext()
  const [toast, setToast] = useState(null)
  const importRef = useRef(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleExport = async () => {
    try {
      await exportToJSON()
      showToast(t('dataExported'))
    } catch (err) {
      showToast('Export failed', 'error')
    }
  }

  const handleImport = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const result = await importFromJSON(file)
      await refreshSession()
      showToast(t('dataImported'))
    } catch (err) {
      showToast(t('importError'), 'error')
    }
    e.target.value = ''
  }

  const handleClearAll = async () => {
    if (!window.confirm(t('confirmClearAll'))) return
    await clearAllData()
    await refreshSession()
    showToast(t('dataCleared'))
  }

  const ToggleButton = ({ options, value, onChange }) => (
    <div
      style={{
        display: 'flex',
        background: 'var(--glass-bg)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        padding: '3px',
        gap: '2px',
      }}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            padding: '5px 10px',
            borderRadius: '8px',
            border: 'none',
            background: value === opt.value ? 'var(--primary)' : 'transparent',
            color: value === opt.value ? '#fff' : 'var(--text-muted)',
            fontSize: '0.78rem',
            fontWeight: value === opt.value ? 700 : 500,
            cursor: 'pointer',
            fontFamily: 'var(--font)',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 'calc(var(--header-height) + 10px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: toast.type === 'error' ? '#ef4444' : '#22c55e',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '20px',
            fontSize: '0.875rem',
            fontWeight: 600,
            zIndex: 500,
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            whiteSpace: 'nowrap',
          }}
        >
          {toast.msg}
        </motion.div>
      )}

      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
          borderRadius: 'var(--radius)',
          padding: '20px',
          marginBottom: '16px',
        }}
      >
        <h1 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 800 }}>
          ⚙️ {t('appSettings')}
        </h1>
      </div>

      <Card>
        {/* Appearance */}
        <SectionTitle>{t('appearance')}</SectionTitle>

        <SettingRow icon="🎨" title={t('theme')}>
          <ToggleButton
            value={theme}
            onChange={setTheme}
            options={[
              { value: 'light', label: t('themeLight') },
              { value: 'dark', label: t('themeDark') },
              { value: 'auto', label: t('themeAuto') },
            ]}
          />
        </SettingRow>

        <SettingRow icon="🌍" title={t('language')}>
          <ToggleButton
            value={language}
            onChange={setLanguage}
            options={[
              { value: 'en', label: 'EN' },
              { value: 'sw', label: 'SW' },
            ]}
          />
        </SettingRow>

        <SettingRow icon="💱" title={t('defaultCurrency')}>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            style={{
              padding: '6px 10px',
              background: 'var(--glass-bg)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--text)',
              fontSize: '0.85rem',
              fontWeight: 600,
              fontFamily: 'var(--font)',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </SettingRow>

        {/* Data Management */}
        <SectionTitle>{t('dataManagement')}</SectionTitle>

        <SettingRow icon="📤" title={t('exportData')} subtitle={t('exportDesc')}>
          <button
            onClick={handleExport}
            style={{
              padding: '7px 14px',
              background: 'rgba(108,99,255,0.1)',
              border: '1px solid rgba(108,99,255,0.3)',
              borderRadius: '10px',
              color: 'var(--primary)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'var(--font)',
            }}
          >
            Export
          </button>
        </SettingRow>

        <SettingRow icon="📥" title={t('importData')} subtitle={t('importDesc')}>
          <button
            onClick={() => importRef.current?.click()}
            style={{
              padding: '7px 14px',
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: '10px',
              color: '#22c55e',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'var(--font)',
            }}
          >
            Import
          </button>
          <input
            ref={importRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
        </SettingRow>

        <SettingRow icon="🗑" title={t('clearAllData')} subtitle={t('clearDesc')}>
          <button
            onClick={handleClearAll}
            style={{
              padding: '7px 14px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '10px',
              color: '#ef4444',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'var(--font)',
            }}
          >
            Clear
          </button>
        </SettingRow>

        {/* About */}
        <SectionTitle>{t('about')}</SectionTitle>

        <SettingRow icon="ℹ️" title={t('about')} subtitle={`${t('version')} 1.0.0`}>
          <button
            onClick={() => navigate('/about')}
            style={{
              padding: '7px 14px',
              background: 'var(--glass-bg)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              color: 'var(--text-muted)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font)',
            }}
          >
            View
          </button>
        </SettingRow>
      </Card>
    </motion.div>
  )
}

export default Settings
