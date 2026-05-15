'use client'

/**
 * usePersonalization.ts
 * React-hook som hanterar all personalisering på klientsidan:
 *  - Spårar produktinteraktioner och skickar dem till servern
 *  - Hämtar personaliserade rekommendationer
 *  - Synkroniserar localStorage-historik med servern
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import type { Product } from '@/lib/types'
import type { EventType } from '@/lib/userBehaviorDb'

// ─── Typer ────────────────────────────────────────────────────────────────────

export interface PersonalizedFeed {
  forYou: Product[]
  trending: Product[]
  becauseYouViewed: Product[]
  similarUsers: Product[]
  hasPersonalization: boolean
  isLoading: boolean
  error: string | null
}

interface QueuedEvent {
  customerId: string
  productId: string
  eventType: EventType
  productCategory?: string
  productPrice?: number
  productColors?: string[]
  productSizes?: string[]
  sessionId: string
  durationSeconds?: number
}

// ─── Session-ID ───────────────────────────────────────────────────────────────

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'ssr'
  let sid = sessionStorage.getItem('session_id')
  if (!sid) {
    sid = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    sessionStorage.setItem('session_id', sid)
  }
  return sid
}

// ─── Händelsekö (batchar anrop för att minska nätverkstrafik) ─────────────────

const eventQueue: QueuedEvent[] = []
let flushTimer: ReturnType<typeof setTimeout> | null = null

function enqueueEvent(event: QueuedEvent) {
  eventQueue.push(event)

  // Skicka efter 2 sekunder av inaktivitet, eller direkt vid köp
  if (event.eventType === 'purchase' || event.eventType === 'add_to_cart') {
    flushEvents()
  } else {
    if (flushTimer) clearTimeout(flushTimer)
    flushTimer = setTimeout(flushEvents, 2000)
  }
}

async function flushEvents() {
  if (eventQueue.length === 0) return
  const batch = eventQueue.splice(0, eventQueue.length)

  for (const event of batch) {
    try {
      await fetch('/api/user-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
        // Använd keepalive så att händelser skickas även om sidan stängs
        keepalive: true,
      })
    } catch {
      // Tyst fel — spårning är icke-kritisk
    }
  }
}

// Skicka kvarvarande händelser när sidan stängs
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', flushEvents)
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushEvents()
  })
}

// ─── Huvud-hook ───────────────────────────────────────────────────────────────

/**
 * Spårar en produktinteraktion för den inloggade användaren.
 * Säker att anropa även om användaren inte är inloggad — händelsen ignoreras då.
 */
export function useTrackProductEvent() {
  const { user } = useAuth()
  const sessionId = useRef<string>('')

  useEffect(() => {
    sessionId.current = getOrCreateSessionId()
  }, [])

  const trackEvent = useCallback(
    (
      product: Product,
      eventType: EventType,
      extra?: { durationSeconds?: number }
    ) => {
      if (!user?.id) return // Bara för inloggade användare

      // Spara i sessionStorage för "because you viewed"
      if (eventType === 'view' || eventType === 'click') {
        try {
          const viewed = JSON.parse(
            sessionStorage.getItem('session_viewed_products') ?? '[]'
          ) as string[]
          if (!viewed.includes(product.id)) {
            viewed.unshift(product.id)
            sessionStorage.setItem(
              'session_viewed_products',
              JSON.stringify(viewed.slice(0, 20))
            )
          }
        } catch {
          // Ignorera
        }
      }

      enqueueEvent({
        customerId: user.id,
        productId: product.id,
        eventType,
        productCategory: product.category,
        productPrice: product.price,
        productColors: product.colors,
        productSizes: product.sizes,
        sessionId: sessionId.current,
        durationSeconds: extra?.durationSeconds,
      })
    },
    [user]
  )

  return { trackEvent, isAuthenticated: !!user }
}

// ─── Rekommendationshook ──────────────────────────────────────────────────────

/**
 * Hämtar personaliserade produktrekommendationer för den inloggade användaren.
 * Returnerar ett flöde med flera sektioner.
 */
export function usePersonalizedFeed(options?: {
  enabled?: boolean
  refetchOnMount?: boolean
}): PersonalizedFeed & { refetch: () => void } {
  const { user, isAuthenticated } = useAuth()
  const [feed, setFeed] = useState<PersonalizedFeed>({
    forYou: [],
    trending: [],
    becauseYouViewed: [],
    similarUsers: [],
    hasPersonalization: false,
    isLoading: false,
    error: null,
  })

  const fetchFeed = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return

    setFeed((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      // Hämta sessionsprodukter
      const sessionProducts = JSON.parse(
        sessionStorage.getItem('session_viewed_products') ?? '[]'
      ) as string[]

      const params = new URLSearchParams({
        customerId: user.id,
        section: 'all',
        limit: '12',
      })

      if (sessionProducts.length > 0) {
        params.set('sessionProducts', sessionProducts.slice(0, 10).join(','))
      }

      const response = await fetch(`/api/recommendations?${params}`, {
        cache: 'no-store',
      })

      if (!response.ok) throw new Error('Kunde inte hämta rekommendationer')

      const data = await response.json()

      if (data.success) {
        setFeed({
          forYou: data.feed?.forYou ?? [],
          trending: data.feed?.trending ?? [],
          becauseYouViewed: data.feed?.becauseYouViewed ?? [],
          similarUsers: data.feed?.similarUsers ?? [],
          hasPersonalization: data.hasPersonalization ?? false,
          isLoading: false,
          error: null,
        })
      }
    } catch (error) {
      setFeed((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Kunde inte ladda rekommendationer',
      }))
    }
  }, [user, isAuthenticated])

  useEffect(() => {
    if (options?.enabled === false) return
    if (!isAuthenticated) return
    fetchFeed()
  }, [isAuthenticated, user?.id, fetchFeed, options?.enabled])

  return { ...feed, refetch: fetchFeed }
}

/**
 * Hämtar rekommendationer för en specifik sektion.
 * Lättare variant för när man bara behöver en sektion.
 */
export function useRecommendationSection(
  section: 'for_you' | 'trending' | 'similar_users',
  limit = 12
): { products: Product[]; isLoading: boolean; hasPersonalization: boolean } {
  const { user, isAuthenticated } = useAuth()
  const [state, setState] = useState<{
    products: Product[]
    isLoading: boolean
    hasPersonalization: boolean
  }>({ products: [], isLoading: false, hasPersonalization: false })

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return

    setState((prev) => ({ ...prev, isLoading: true }))

    const params = new URLSearchParams({
      customerId: user.id,
      section,
      limit: String(limit),
    })

    fetch(`/api/recommendations?${params}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setState({
            products: data.products ?? [],
            isLoading: false,
            hasPersonalization: data.hasPersonalization ?? false,
          })
        }
      })
      .catch(() => setState((prev) => ({ ...prev, isLoading: false })))
  }, [isAuthenticated, user?.id, section, limit])

  return state
}
