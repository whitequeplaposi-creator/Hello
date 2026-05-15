'use client'

import { useEffect } from 'react'
import { analyticsPromise } from '@/lib/firebase'

export default function FirebaseAnalytics() {
  useEffect(() => {
    analyticsPromise.catch(console.error)
  }, [])

  return null
}
