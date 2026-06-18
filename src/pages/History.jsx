import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../hooks/useLanguage'
import { useAppContext } from '../context/AppContext'
import SessionCard from '../components/session/SessionCard'
import { getSessions, deleteSession, closeSession } from '../db/sessions'

const FILTERS = ['allTime', 'thisWeek', 'thisMonth', 'lastMonth']

function History() {
  const { t } = useLanguage()
  const { refreshSession } = useAppContext()
  const [sessions, setSessions] = useState([])
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('allTime')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSessions()
  }, [])

  async function loadSessions() {
    setLoading(true)
    const data = await getSessions()
    setSessions(data)
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm(t('confirmDelete'))) return
    await deleteSession(id)
    await refreshSession()
    loadSessions()
  }

  const handleClose = async (id) => {
    if (!window.confirm(t('confirmClose'))) return
    await closeSession(id)
    await refreshSession()
    loadSessions()
  }

  const applyDateFilter = (session) => {
    if (dateFilter === 'allTime') return true
    const d = new Date(session.createdAt)
    const now = new Date()

    if (dateFilter === 'thisWeek') {
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - now.getDay())
      weekStart.setHours(0, 0, 0, 0)
      return d >= weekStart
    }

    if (dateFilter === 'thisMonth') {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }

    if (dateFilter === 'lastMonth') {
      const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1
      const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear
    }

    return true
  }

  const filtered = sessions
    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    .filter(applyDateFilter)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
          borderRadius: 'var(--radius)',
          padding: '20px',
          marginBottom: '16px',
        }}
      >
        <h1 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 800, marginBottom: '4px' }}>
          {t('sessionHistory')}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.82rem' }}>
          {sessions.length} total sessions
        </p>
      </div>

      {/* Search */}
      <input
        className="input-base"
        type="text"
        placeholder={`🔍 ${t('searchHistory')}`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '12px' }}
      />

      {/* Date Filter */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '16px',
          scrollbarWidth: 'none',
        }}
      >
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setDateFilter(f)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: `1.5px solid ${dateFilter === f ? 'var(--primary)' : 'var(--border)'}`,
              background: dateFilter === f ? 'rgba(108,99,255,0.15)' : 'transparent',
              color: dateFilter === f ? 'var(--primary)' : 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: dateFilter === f ? 700 : 500,
              cursor: 'pointer',
              fontFamily: 'var(--font)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'all 0.15s ease',
            }}
          >
            {t(f)}
          </button>
        ))}
      </div>

      {/* Summary Stats */}
      {sessions.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            marginBottom: '16px',
          }}
        >
          {[
            { label: 'Sessions', value: sessions.length },
            { label: 'Active', value: sessions.filter((s) => s.status === 'active').length },
            { label: 'Closed', value: sessions.filter((s) => s.status === 'closed').length },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Session List */}
      {loading ? (
        <div className="flex-center" style={{ padding: '48px' }}>
          <div className="loading-spinner" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🕒</div>
          <h3>{search || dateFilter !== 'allTime' ? 'No results' : t('noHistory')}</h3>
          <p>{search || dateFilter !== 'allTime' ? 'Try different filters' : t('noHistoryDesc')}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((session, i) => (
            <SessionCard
              key={session.id}
              session={session}
              index={i}
              onDelete={() => handleDelete(session.id)}
              onClose={session.status === 'active' ? () => handleClose(session.id) : undefined}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default History
