import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../context/AppContext'
import { useLanguage } from '../hooks/useLanguage'
import SessionCard from '../components/session/SessionCard'
import SessionForm from '../components/session/SessionForm'
import Button from '../components/common/Button'
import { getSessions, deleteSession, closeSession } from '../db/sessions'

function Sessions() {
  const { refreshSession } = useAppContext()
  const { t } = useLanguage()
  const [sessions, setSessions] = useState([])
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
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

  const filtered = sessions.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          borderRadius: 'var(--radius)',
          padding: '20px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 800, marginBottom: '2px' }}>
              {t('mySessions')}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem' }}>
              {sessions.length} session{sessions.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button
            variant="primary"
            icon="+"
            onClick={() => setShowForm(true)}
            style={{
              background: 'rgba(255,255,255,0.25)',
              border: '1px solid rgba(255,255,255,0.4)',
              color: '#fff',
            }}
          >
            {t('newSession')}
          </Button>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '16px' }}>
        <input
          className="input-base"
          type="text"
          placeholder={`🔍 ${t('searchSessions')}`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Sessions List */}
      {loading ? (
        <div className="flex-center" style={{ padding: '48px' }}>
          <div className="loading-spinner" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>{search ? 'No results' : t('noSessions')}</h3>
          <p>{search ? 'Try a different search' : t('createFirstSession')}</p>
          {!search && (
            <Button variant="primary" icon="+" onClick={() => setShowForm(true)} style={{ marginTop: '8px' }}>
              {t('newSession')}
            </Button>
          )}
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

      <SessionForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onCreated={loadSessions}
      />
    </motion.div>
  )
}

export default Sessions
