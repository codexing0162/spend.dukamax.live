import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { useLanguage } from '../hooks/useLanguage'
import BudgetRing from '../components/dashboard/BudgetRing'
import StatCard from '../components/dashboard/StatCard'
import SessionForm from '../components/session/SessionForm'
import PurchaseForm from '../components/purchase/PurchaseForm'
import PurchaseItem from '../components/purchase/PurchaseItem'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import { getPurchases, deletePurchase } from '../db/purchases'
import { getSessions } from '../db/sessions'
import { formatCurrency } from '../utils/formatters'
import { calcHealthScore, getHealthLabel, calcSmartAdvice, getBudgetAlertLevel } from '../utils/calculations'

function Dashboard() {
  const { currentSession, refreshSession, language, triggerBudgetAlert } = useAppContext()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const [showSessionForm, setShowSessionForm] = useState(false)
  const [showPurchaseForm, setShowPurchaseForm] = useState(false)
  const [recentPurchases, setRecentPurchases] = useState([])
  const [healthScore, setHealthScore] = useState(50)
  const [advice, setAdvice] = useState([])
  const [allSessions, setAllSessions] = useState([])

  useEffect(() => {
    loadData()
  }, [currentSession])

  async function loadData() {
    const sessions = await getSessions()
    setAllSessions(sessions)
    setHealthScore(calcHealthScore(sessions))

    if (currentSession) {
      const purchases = await getPurchases(currentSession.id)
      setRecentPurchases(purchases.slice(0, 5))

      // Smart advice
      const prev = sessions.find((s) => s.id !== currentSession.id && s.status === 'closed')
      const adv = calcSmartAdvice(currentSession, purchases, prev, language)
      setAdvice(adv)

      // Budget alerts
      const alertLevel = getBudgetAlertLevel(currentSession.spent, currentSession.budget)
      if (alertLevel) {
        triggerBudgetAlert(currentSession.id, alertLevel)
      }
    }
  }

  const handleDeletePurchase = async (id) => {
    await deletePurchase(id)
    await refreshSession()
    loadData()
  }

  const session = currentSession
  const spent = session?.spent || 0
  const budget = session?.budget || 0
  const remaining = Math.max(0, budget - spent)
  const currency = session?.currency || 'TZS'

  const { label: healthLabel, color: healthColor } = getHealthLabel(healthScore)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 'var(--radius)',
          padding: '24px',
          marginBottom: '16px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -20,
            left: -20,
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
          }}
        />

        {session ? (
          <div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {t('activeSession')}
            </div>
            <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>
              {session.name}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <BudgetRing spent={spent} budget={budget} currency={currency} size={130} />

              <div style={{ flex: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <StatCard
                    icon="💰"
                    label={t('budget')}
                    value={budget}
                    formatFn={(v) => formatCurrency(v, currency)}
                    color="#fff"
                    delay={0.1}
                  />
                  <StatCard
                    icon="📤"
                    label={t('spent')}
                    value={spent}
                    formatFn={(v) => formatCurrency(v, currency)}
                    color="#FF6584"
                    delay={0.15}
                  />
                  <StatCard
                    icon="💵"
                    label={t('remaining')}
                    value={remaining}
                    formatFn={(v) => formatCurrency(v, currency)}
                    color="#22c55e"
                    delay={0.2}
                  />
                  <StatCard
                    icon="🛒"
                    label={t('purchasesCount')}
                    value={recentPurchases.length}
                    formatFn={(v) => Math.round(v).toString()}
                    color="#f59e0b"
                    delay={0.25}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', paddingBottom: '8px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💰</div>
            <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>
              {t('noActiveSession')}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', marginBottom: '16px' }}>
              {t('startShopping')}
            </p>
            <Button
              variant="primary"
              onClick={() => setShowSessionForm(true)}
              icon="+"
              style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)' }}
            >
              {t('startSession')}
            </Button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {session && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          <Button
            variant="primary"
            size="md"
            icon="+"
            onClick={() => setShowPurchaseForm(true)}
            style={{ width: '100%' }}
          >
            {t('addPurchase')}
          </Button>
          <Button
            variant="secondary"
            size="md"
            icon="📊"
            onClick={() => navigate(`/session/${session.id}`)}
            style={{ width: '100%' }}
          >
            View Session
          </Button>
        </div>
      )}

      {!session && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          <Button
            variant="primary"
            size="md"
            icon="+"
            onClick={() => setShowSessionForm(true)}
            style={{ width: '100%' }}
          >
            {t('startSession')}
          </Button>
          <Button
            variant="secondary"
            size="md"
            icon="📋"
            onClick={() => navigate('/sessions')}
            style={{ width: '100%' }}
          >
            {t('sessions')}
          </Button>
        </div>
      )}

      {/* Health Score Mini Card */}
      <Card style={{ marginBottom: '16px', cursor: 'pointer' }} onClick={() => navigate('/reports')}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
              {t('healthScore')}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: healthColor }}>
              {healthScore}/100
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: healthColor }}>
              {healthLabel}
            </div>
          </div>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: `${healthColor}22`,
              border: `3px solid ${healthColor}44`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
            }}
          >
            {healthScore >= 85 ? '🏆' : healthScore >= 65 ? '✅' : healthScore >= 40 ? '⚠️' : '🔴'}
          </div>
        </div>

        {/* Mini bar */}
        <div style={{ marginTop: '12px', height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${healthScore}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ height: '100%', background: healthColor, borderRadius: 3 }}
          />
        </div>
      </Card>

      {/* Smart Advisor Preview */}
      {advice.length > 0 && (
        <Card style={{ marginBottom: '16px' }}>
          <div className="section-header">
            <span className="section-title">💡 {t('smartAdvice')}</span>
            <button
              onClick={() => navigate('/reports')}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)' }}
            >
              {t('viewAll')}
            </button>
          </div>
          <div
            style={{
              padding: '12px',
              background: 'rgba(108,99,255,0.08)',
              border: '1px solid rgba(108,99,255,0.2)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              color: 'var(--text)',
              lineHeight: 1.5,
            }}
          >
            💡 {advice[0]}
          </div>
        </Card>
      )}

      {/* Recent Purchases */}
      {session && (
        <Card>
          <div className="section-header">
            <span className="section-title">{t('recentPurchases')}</span>
            <button
              onClick={() => navigate(`/session/${session.id}`)}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)' }}
            >
              {t('viewAll')}
            </button>
          </div>

          {recentPurchases.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px 16px' }}>
              <div className="empty-icon">🛒</div>
              <h3>{t('noRecentPurchases')}</h3>
              <p>{t('startAddingPurchases')}</p>
            </div>
          ) : (
            <div>
              {recentPurchases.map((p) => (
                <PurchaseItem
                  key={p.id}
                  purchase={p}
                  onDelete={handleDeletePurchase}
                  currency={currency}
                />
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Forms */}
      <SessionForm
        isOpen={showSessionForm}
        onClose={() => setShowSessionForm(false)}
        onCreated={() => loadData()}
      />
      {session && (
        <PurchaseForm
          isOpen={showPurchaseForm}
          onClose={() => setShowPurchaseForm(false)}
          sessionId={session.id}
          currency={currency}
          onAdded={() => {
            refreshSession()
            loadData()
          }}
        />
      )}
    </motion.div>
  )
}

export default Dashboard
