'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type CookieCategory = 'necessary' | 'functional' | 'analytics' | 'marketing'

export interface CookiePreferences {
  necessary: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
}

interface CookieContextType {
  preferences: CookiePreferences
  hasConsent: boolean
  showBanner: boolean
  updatePreferences: (prefs: Partial<CookiePreferences>) => void
  acceptAll: () => void
  rejectAll: () => void
  openSettings: () => void
  closeSettings: () => void
  showSettings: boolean
}

const CookieContext = createContext<CookieContextType | undefined>(undefined)

const COOKIE_CONSENT_KEY = 'cookie-consent'
const COOKIE_PREFERENCES_KEY = 'cookie-preferences'

const defaultPreferences: CookiePreferences = {
  necessary: true, // Always true
  functional: false,
  analytics: false,
  marketing: false,
}

export function CookieProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences)
  const [hasConsent, setHasConsent] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    const savedPrefs = localStorage.getItem(COOKIE_PREFERENCES_KEY)

    if (consent === 'true' && savedPrefs) {
      try {
        const prefs = JSON.parse(savedPrefs)
        setPreferences({ ...prefs, necessary: true })
        setHasConsent(true)
        setShowBanner(false)
      } catch (e) {
        setShowBanner(true)
      }
    } else {
      setShowBanner(true)
    }
  }, [])

  const savePreferences = (prefs: CookiePreferences) => {
    const finalPrefs = { ...prefs, necessary: true }
    setPreferences(finalPrefs)
    setHasConsent(true)
    setShowBanner(false)
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true')
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(finalPrefs))
    
    // Apply preferences
    applyPreferences(finalPrefs)
  }

  const applyPreferences = (prefs: CookiePreferences) => {
    // Clear cookies based on preferences
    if (!prefs.analytics) {
      // Clear analytics cookies (e.g., Google Analytics)
      document.cookie.split(';').forEach((c) => {
        const cookie = c.trim()
        if (cookie.startsWith('_ga') || cookie.startsWith('_gid')) {
          const eqPos = cookie.indexOf('=')
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
          document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'
        }
      })
    }

    if (!prefs.marketing) {
      // Clear marketing cookies
      document.cookie.split(';').forEach((c) => {
        const cookie = c.trim()
        if (cookie.startsWith('_fbp') || cookie.startsWith('_fbc')) {
          const eqPos = cookie.indexOf('=')
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
          document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'
        }
      })
    }
  }

  const updatePreferences = (prefs: Partial<CookiePreferences>) => {
    const newPrefs = { ...preferences, ...prefs, necessary: true }
    savePreferences(newPrefs)
  }

  const acceptAll = () => {
    savePreferences({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    })
    setShowSettings(false)
  }

  const rejectAll = () => {
    savePreferences({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    })
    setShowSettings(false)
  }

  const openSettings = () => {
    setShowSettings(true)
  }

  const closeSettings = () => {
    setShowSettings(false)
  }

  return (
    <CookieContext.Provider
      value={{
        preferences,
        hasConsent,
        showBanner,
        updatePreferences,
        acceptAll,
        rejectAll,
        openSettings,
        closeSettings,
        showSettings,
      }}
    >
      {children}
    </CookieContext.Provider>
  )
}

export function useCookies() {
  const context = useContext(CookieContext)
  if (context === undefined) {
    throw new Error('useCookies must be used within a CookieProvider')
  }
  return context
}
