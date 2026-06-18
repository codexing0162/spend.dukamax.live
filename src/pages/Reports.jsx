import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../hooks/useLanguage'
import { useAppContext } from '../context/AppContext'
import CategoryChart from '../components/reports/CategoryChart'
import ShopRanking from '../components/reports/ShopRanking'
import HealthScore from '../components/advisor/HealthScore'
import SmartAdvisor from '../components/advisor/SmartAdvisor'
import Card from '../components/common/Card'
import { getSessions } from '../db/sessions'
import { getPurchases, getPurchasesByCategory, getPurchasesByShop } from '../db/purchases'
import { formatCurrency } from '../utils/formatters'
import { calcHealthScore, calcSmartAdvice, calcCategoryBreakdown } from '../utils/calculations'

const TABS = ['overview', 'byCategory', 'byShop']

function Reports() {
  const { t } = useLanguage()
  const { language, currentSession } = useAppContext()

  const [sessions, setSessions] = useState([])
  const [selectedSessionId, setSelectedSessionId] = useState(null)
  const [session, setSession] = useState(null)
  const [purchases, setPurchases] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [shopData, setShopData] = useState([])
  const [advice, setAdvice] = useState([])
  const [healthScore, setHealthScore] = useState(50)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const all = await getSessions()
      setSessions(all)
      setHealthScore(calcHealthScore(all))

      // Default to current active session or most recent
      const defaultId = currentSession?.id || (all.length > 0 ? all[0].id : null)
      if (defaultId) {
        setSelectedSessionId(defaultId)
      }
      setLoading(false)
    }
    init()
  }, [currentSession])

  useEffect(() => {
    if (!selectedSessionId) return
    loadSessionData(selectedSessionId)
  }, [selectedSessionId, language])

  async function loadSessionData(sid) {
    const s = sessions.find((x) => x.id === sid)
    if (!s) return
    setSession(s)

    const p = await getPurchases(sid)
    setPurchases(p)

    const cats = await getPurchasesByCategory(sid)
    const catBreakdown = calcCategoryBreakdown(p, s.spent || 0)
    setCategoryData(catBreakdown)

    const shops = await getPurchasesByShop(sid)
    setShopData(shops)

    const prev = sessions.find((x) => x.id !== sid && x.status === 'closed')
    const adv = calcSmartAdvice(s, p, prev, language)
    setAdvice(adv)
  }

  const currency = session?.currency || 'TZS'
  const spent = session?.spent || 0
  const avgPurchase = purchases.length > 0 ? spent / purchases.length : 0
  const biggestPurchase = purchases.reduce((max, p) => Math.max(max, p.amount), 0)
  const topShop = shopData.length > 0 ? shopData[0].shopName : '-'

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '60vh' }}>
        <div className="loading-spinner" />
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          borderRadius: 'var(--radius)',
          padding: '20px',
          marginBottom: '16px',
        }}
      >
        <h1 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 800, marginBottom: '12px' }}>
          {t('spendingReports')}
        </h1>

        {/* Session Selector */}
        {sessions.length > 0 ? (
          <select
            value={selectedSessionId || ''}
            onChange={(e) => setSelectedSessionId(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '10px 14px',
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '0.9rem',
              fontWeight: 600,
              fontFamily: 'var(--font)',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {sessions.map((s) => (
              <option key={s.id} value={s.id} style={{ color: '#000' }}>
                {s.name} ({s.status})
              </option>
            ))}
          </select>
        ) : (
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
            {t('selectSession')}
          </p>
        )}
      </div>

      {!session || purchases.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>{t('noPurchasesYet')}</h3>
          <p>{t('addPurchasesToSeeReports')}</p>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              marginBottom: '16px',
              background: 'var(--glass-bg)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              padding: '4px',
            }}
          >
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '10px',
                  border: 'none',
                  background: activeTab === tab ? 'var(--primary)' : 'transparent',
                  color: activeTab === tab ? '#fff' : 'var(--text-muted)',
                  fontSize: '0.78rem',
                  fontWeight: activeTab === tab ? 700 : 500,
                  cursor: 'pointer',
                  fontFamily: 'var(--font)',
                  transition: 'all 0.2s ease',
                }}
              >
                {t(tab)}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Key Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                {[
                  { icon: '🛒', label: t('totalPurchases'), value: purchases.length, fmt: (v) => Math.round(v).toString() },
                  { icon: '📊', label: t('avgPurchase'), value: avgPurchase, fmt: (v) => formatCurrency(v, currency) },
                  { icon: '💸', label: t('biggestPurchase'), value: biggestPurchase, fmt: (v) => formatCurrency(v, currency) },
                  { icon: '🏬', label: t('topShop'), value: topShop, fmt: null },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '14px',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div style={{ fontSize: '1.2rem', marginBottom: '6px' }}>{stat.icon}</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {stat.fmt ? stat.fmt(stat.value) : stat.value}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Health Score */}
              <Card style={{ marginBottom: '16px' }}>
                <div className="section-header">
                  <span className="section-title">{t('businessHealthScore')}</span>
                </div>
                <HealthScore score={healthScore} sessions={sessions} />
              </Card>

              {/* Smart Advisor */}
              <Card>
                <div className="section-header">
                  <span className="section-title">💡 {t('smartAdvisor')}</span>
                </div>
                <SmartAdvisor advice={advice} />
              </Card>
            </motion.div>
          )}

          {/* Category Tab */}
          {activeTab === 'byCategory' && (
            <motion.div
              key="category"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <div className="section-header">
                  <span className="section-title">{t('spendingByCategory')}</span>
                </div>
                <CategoryChart data={categoryData} currency={currency} />
              </Card>
            </motion.div>
          )}

          {/* Shop Tab */}
          {activeTab === 'byShop' && (
            <motion.div
              key="shop"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <div className="section-header">
                  <span className="section-title">{t('shopRankings')}</span>
                </div>
                <ShopRanking shops={shopData} totalSpent={spent} currency={currency} />
              </Card>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  )
}

export default Reports
