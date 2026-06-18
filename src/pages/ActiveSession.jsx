import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppContext } from '../context/AppContext'
import { useLanguage } from '../hooks/useLanguage'
import PurchaseList from '../components/purchase/PurchaseList'
import PurchaseForm from '../components/purchase/PurchaseForm'
import FloatingActionButton from '../components/common/FloatingActionButton'
import AnimatedCounter from '../components/common/AnimatedCounter'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'
import { getSession } from '../db/sessions'
import { getPurchases, deletePurchase, getPurchasesByCategory, getPurchasesByShop } from '../db/purchases'
import { formatCurrency, formatDate } from '../utils/formatters'
import { calcSpentPercent, getBudgetAlertLevel, getCategoryColor, getCategoryIcon } from '../utils/calculations'

function ActiveSession() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { refreshSession, triggerBudgetAlert } = useAppContext()
  const { t } = useLanguage()

  const [session, setSession] = useState(null)
  const [purchases, setPurchases] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [showPurchaseForm, setShowPurchaseForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    if (!id) return
    try {
      const s = await getSession(id)
      if (!s) { navigate('/sessions'); return }
      setSession(s)

      const p = await getPurchases(id)
      setPurchases(p)

      const cats = await getPurchasesByCategory(id)
      setCategoryData(cats)

      // Trigger budget alerts
      const alertLevel = getBudgetAlertLevel(s.spent, s.budget)
      if (alertLevel) triggerBudgetAlert(s.id, alertLevel)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [id, navigate, triggerBudgetAlert])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleDeletePurchase = async (purchaseId) => {
    await deletePurchase(purchaseId)
    await refreshSession()
    loadData()
  }

  const handlePurchaseAdded = async () => {
    await refreshSession()
    loadData()
  }

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '60vh' }}>
        <div className="loading-spinner" />
      </div>
    )
  }

  if (!session) return null

  const spent = session.spent || 0
  const budget = session.budget || 0
  const remaining = Math.max(0, budget - spent)
  const percent = calcSpentPercent(spent, budget)
  const currency = session.currency || 'TZS'
  const isActive = session.status === 'active'

  let barColor = '#22c55e'
  if (percent >= 100) barColor = '#ef4444'
  else if (percent >= 90) barColor = '#ef4444'
  else if (percent >= 75) barColor = '#f97316'
  else if (percent >= 50) barColor = '#f59e0b'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Back Button */}
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

      {/* Hero Budget Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 'var(--radius)',
          padding: '20px',
          marginBottom: '16px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {t('liveBudget')}
            </div>
            <h2 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 800 }}>{session.name}</h2>
            <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.72rem', marginTop: '2px' }}>
              {formatDate(session.startDate || session.createdAt)}
            </div>
          </div>
          <Badge
            type={isActive ? 'active' : 'closed'}
            label={t(isActive ? 'active' : 'closed')}
          />
        </div>

        {/* Big Remaining Display */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', marginBottom: '4px' }}>
            {t('remaining')}
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: remaining === 0 ? '#FF6584' : '#fff', lineHeight: 1 }}>
            <AnimatedCounter
              value={remaining}
              formatFn={(v) => formatCurrency(Math.round(v), currency)}
            />
          </div>
        </div>

        {/* Budget Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.78rem' }}>
              {formatCurrency(spent, currency)} spent
            </span>
            <span style={{ color: '#fff', fontSize: '0.78rem', fontWeight: 700 }}>
              {Math.round(percent)}% of {formatCurrency(budget, currency)}
            </span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, percent)}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              style={{ height: '100%', background: barColor, borderRadius: 4 }}
            />
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '14px' }}>
          {[
            { label: t('totalBudget'), value: formatCurrency(budget, currency) },
            { label: t('amountSpent'), value: formatCurrency(spent, currency) },
            { label: t('purchasesCount'), value: purchases.length.toString() },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: 'rgba(255,255,255,0.12)',
                borderRadius: '10px',
                padding: '8px',
                textAlign: 'center',
              }}
            >
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.88rem' }}>{stat.value}</div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      {categoryData.length > 0 && (
        <Card style={{ marginBottom: '16px' }}>
          <div className="section-header">
            <span className="section-title">{t('categoryBreakdown')}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {categoryData.map((cat, i) => (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{getCategoryIcon(cat.category)}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>
                      {cat.category}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      ({cat.count})
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text)' }}>
                      {formatCurrency(cat.total, currency)}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: getCategoryColor(cat.category), fontWeight: 600, marginLeft: '6px' }}>
                      {spent > 0 ? `${((cat.total / spent) * 100).toFixed(1)}%` : '0%'}
                    </span>
                  </div>
                </div>
                <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${spent > 0 ? (cat.total / spent) * 100 : 0}%` }}
                    transition={{ delay: i * 0.05 + 0.2, duration: 0.5 }}
                    style={{ height: '100%', background: getCategoryColor(cat.category), borderRadius: 2 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Purchases */}
      <Card>
        <div className="section-header">
          <span className="section-title">Purchases ({purchases.length})</span>
          {isActive && (
            <button
              onClick={() => setShowPurchaseForm(true)}
              style={{
                background: 'var(--primary)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                padding: '5px 12px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'var(--font)',
              }}
            >
              + Add
            </button>
          )}
        </div>
        <PurchaseList
          purchases={purchases}
          onDelete={isActive ? handleDeletePurchase : undefined}
          currency={currency}
        />
      </Card>

      {/* FAB */}
      {isActive && (
        <FloatingActionButton
          onClick={() => setShowPurchaseForm(true)}
          label={t('addPurchase')}
        />
      )}

      {/* Purchase Form */}
      <PurchaseForm
        isOpen={showPurchaseForm}
        onClose={() => setShowPurchaseForm(false)}
        sessionId={session.id}
        currency={currency}
        onAdded={handlePurchaseAdded}
      />
    </motion.div>
  )
}

export default ActiveSession
