import React, { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AppProvider, useAppContext } from './context/AppContext'
import Header from './components/layout/Header'
import BottomNav from './components/layout/BottomNav'
import BudgetAlert from './components/common/BudgetAlert'
import Dashboard from './pages/Dashboard'
import Sessions from './pages/Sessions'
import ActiveSession from './pages/ActiveSession'
import Reports from './pages/Reports'
import History from './pages/History'
import Settings from './pages/Settings'
import About from './pages/About'

function OfflineBanner() {
  const { isOnline } = useAppContext()
  const [wasOffline, setWasOffline] = useState(false)
  const [showOnline, setShowOnline] = useState(false)

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true)
    } else if (wasOffline) {
      setShowOnline(true)
      const t = setTimeout(() => setShowOnline(false), 3000)
      return () => clearTimeout(t)
    }
  }, [isOnline])

  if (showOnline) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: '#22c55e',
          color: 'white',
          textAlign: 'center',
          padding: '6px',
          fontSize: '0.8rem',
          fontWeight: 600,
          zIndex: 9999,
        }}
      >
        ✓ Back online!
      </div>
    )
  }

  if (!isOnline) {
    return (
      <div className="offline-banner">
        📡 Offline — data saved locally
      </div>
    )
  }

  return null
}

function AppInner() {
  const location = useLocation()

  return (
    <div className="app-layout">
      <OfflineBanner />
      <Header />
      <BudgetAlert />

      <main className="page-content">
        <div className="container">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/sessions" element={<Sessions />} />
              <Route path="/session/:id" element={<ActiveSession />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/history" element={<History />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </AnimatePresence>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}

export default App
