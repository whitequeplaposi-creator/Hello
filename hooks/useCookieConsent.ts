'use client'

import { useEffect, useState } from 'react'
import { useCookies, CookieCategory } from '@/lib/CookieContext'

/**
 * Hook to check if a specific cookie category is allowed
 * and re-render when preferences change
 */
export function useCookieConsent(category: CookieCategory) {
  const { preferences, hasConsent } = useCookies()
  const [isAllowed, setIsAllowed] = useState(false)

  useEffect(() => {
    setIsAllowed(hasConsent && preferences[category])
  }, [preferences, hasConsent, category])

  return isAllowed
}

/**
 * Hook to execute code only when specific cookie consent is given
 */
export function useConditionalEffect(
  effect: () => void | (() => void),
  category: CookieCategory,
  deps: React.DependencyList = []
) {
  const isAllowed = useCookieConsent(category)

  useEffect(() => {
    if (isAllowed) {
      return effect()
    }
  }, [isAllowed, ...deps])
}
