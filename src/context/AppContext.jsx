import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getActiveSession } from '../db/sessions'
import { db } from '../db/database'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [currentSession, setCurrentSession] = useState(null)
  const [theme, setThemeState] = useState('auto')
  const [language, setLanguageState] = useState('en')
  const [currency, setCurrencyState] = useState('TZS')
  const [loading, setLoading] = useState(true)
  const [budgetAlerts, setBudgetAlerts] = useState({})
  const [shownAlerts, setShownAlerts] = useState({})
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  // Load persisted settings from IndexedDB
  useEffect(() => {
    async function loadSettings() {
      try {
        const themeSetting = await db.settings.get('theme')
        const langSetting = await db.settings.get('language')
        const currencySetting = await db.settings.get('currency')

        if (themeSetting) setThemeState(themeSetting.value)
        if (langSetting) setLanguageState(langSetting.value)
        if (currencySetting) setCurrencyState(currencySetting.value)
      } catch (err) {
        console.warn('Failed to load settings:', err)
      }
    }
    loadSettings()
  }, [])

  // Load active session
  const refreshSession = useCallback(async () => {
    try {
      const session = await getActiveSession()
      setCurrentSession(session)
    } catch (err) {
      console.warn('Failed to load active session:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshSession()
  }, [refreshSession])

  // Apply theme to document
  useEffect(() => {
    const applyTheme = (t) => {
      let effective = t
      if (t === 'auto') {
        effective = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      }
      document.documentElement.setAttribute('data-theme', effective)
    }

    applyTheme(theme)

    if (theme === 'auto') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = () => applyTheme('auto')
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
  }, [theme])

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const setTheme = useCallback(async (t) => {
    setThemeState(t)
    try {
      await db.settings.put({ key: 'theme', value: t })
    } catch (err) {
      console.warn('Failed to save theme:', err)
    }
  }, [])

  const setLanguage = useCallback(async (lang) => {
    setLanguageState(lang)
    try {
      await db.settings.put({ key: 'language', value: lang })
    } catch (err) {
      console.warn('Failed to save language:', err)
    }
  }, [])

  const setCurrency = useCallback(async (c) => {
    setCurrencyState(c)
    try {
      await db.settings.put({ key: 'currency', value: c })
    } catch (err) {
      console.warn('Failed to save currency:', err)
    }
  }, [])

  const triggerBudgetAlert = useCallback((sessionId, level) => {
    const key = `${sessionId}-${level}`
    if (shownAlerts[key]) return

    setShownAlerts((prev) => ({ ...prev, [key]: true }))
    setBudgetAlerts((prev) => ({ ...prev, [key]: { level, sessionId, timestamp: Date.now() } }))

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setBudgetAlerts((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }, 5000)
  }, [shownAlerts])

  const dismissAlert = useCallback((key) => {
    setBudgetAlerts((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  const value = {
    currentSession,
    setCurrentSession,
    theme,
    setTheme,
    language,
    setLanguage,
    currency,
    setCurrency,
    loading,
    isOnline,
    refreshSession,
    budgetAlerts,
    triggerBudgetAlert,
    dismissAlert,
    shownAlerts,
    setShownAlerts,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}

export default AppContext
