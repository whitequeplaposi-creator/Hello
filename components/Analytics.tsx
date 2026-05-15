'use client'

import { useEffect } from 'react'
import { useConditionalEffect } from '@/hooks/useCookieConsent'
import { loadGoogleAnalytics } from '@/lib/cookieUtils'

export default function Analytics() {
  // Replace with your actual Google Analytics Measurement ID
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX'

  // Only load Google Analytics if analytics cookies are allowed
  useConditionalEffect(() => {
    loadGoogleAnalytics(GA_MEASUREMENT_ID)
  }, 'analytics')

  return null
}
