'use client'

/**
 * PersonalizedRecommendations.tsx
 * Visar personaliserade produktrekommendationer för inloggade användare.
 * Innehåller flera sektioner: "För dig", "Trendande", "Liknande användare".
 */

import { useState, useMemo } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { usePersonalizedFeed } from '@/hooks/usePersonalization'
import ProductCard from './ProductCard'
import { useTrackProductEvent } from '@/hooks/usePersonalization'
import type { Product } from '@/lib/types'

/** Fisher-Yates shuffle — returnerar en ny slumpad kopia */
function shuffleOnce<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

// ─── Sektion-komponent ────────────────────────────────────────────────────────

interface SectionProps {
  title: string
  subtitle?: string
  products: Product[]
  isLoading: boolean
  emptyMessage?: string
  badge?: string
}

function RecommendationSection({
  title,
  subtitle,
  products,
  isLoading,
  emptyMessage,
  badge,
}: SectionProps) {
  const { trackEvent } = useTrackProductEvent()

  if (isLoading) {
    return (
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
          {badge && <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    if (!emptyMessage) return null
    return null
  }

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {badge && (
          <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onInteraction={() => trackEvent(product, 'click')}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Huvud-komponent ──────────────────────────────────────────────────────────

interface PersonalizedRecommendationsProps {
  /** Visa bara om användaren är inloggad */
  requireAuth?: boolean
  /** Vilka sektioner som ska visas */
  sections?: ('for_you' | 'trending' | 'because_you_viewed' | 'similar_users')[]
  className?: string
}

export default function PersonalizedRecommendations({
  requireAuth = true,
  sections = ['for_you', 'trending', 'because_you_viewed', 'similar_users'],
  className = '',
}: PersonalizedRecommendationsProps) {
  const { isAuthenticated, user } = useAuth()
  const feed = usePersonalizedFeed({ enabled: isAuthenticated })

  // Slumpa sektionsordningen en gång per sidladdning
  const shuffledSections = useMemo(() => shuffleOnce(sections), []) // eslint-disable-line react-hooks/exhaustive-deps

  // Slumpa produktordningen i "För dig"-sektionen en gång per sidladdning
  // Körs bara om när feed.forYou faktiskt fylls på (tom → data)
  const shuffledForYou = useMemo(
    () => (feed.forYou.length > 0 ? shuffleOnce(feed.forYou) : feed.forYou),
    [feed.forYou.length] // eslint-disable-line react-hooks/exhaustive-deps
  )

  // Visa ingenting om autentisering krävs men användaren inte är inloggad
  if (requireAuth && !isAuthenticated) return null

  // Visa ingenting om allt är tomt och inte laddar
  const hasContent =
    feed.isLoading ||
    feed.forYou.length > 0 ||
    feed.trending.length > 0 ||
    feed.becauseYouViewed.length > 0 ||
    feed.similarUsers.length > 0

  if (!hasContent) return null

  return (
    <div className={className}>
      {/* Personaliserad hälsning */}
      {isAuthenticated && user?.name && feed.hasPersonalization && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <p className="text-sm text-blue-700 font-medium">
            ✨ Anpassat för dig, {user.name.split(' ')[0]}
          </p>
          <p className="text-xs text-blue-500 mt-0.5">
            Baserat på ditt beteende och intressen
          </p>
        </div>
      )}

      {/* Sektioner i slumpad ordning */}
      {shuffledSections.map(section => {
        if (section === 'for_you') {
          return (
            <RecommendationSection
              key="for_you"
              title={feed.hasPersonalization ? 'För dig' : 'Utvalda produkter'}
              subtitle={
                feed.hasPersonalization
                  ? 'Baserat på dina intressen'
                  : 'Populärt just nu'
              }
              products={shuffledForYou}
              isLoading={feed.isLoading}
              badge={feed.hasPersonalization ? 'Personaliserat' : undefined}
            />
          )
        }

        if (section === 'because_you_viewed' && feed.becauseYouViewed.length > 0) {
          return (
            <RecommendationSection
              key="because_you_viewed"
              title="Eftersom du tittade på..."
              subtitle="Liknande produkter du nyligen besökt"
              products={feed.becauseYouViewed}
              isLoading={false}
            />
          )
        }

        if (section === 'trending') {
          return (
            <RecommendationSection
              key="trending"
              title="Trendande just nu"
              subtitle="Populärt bland våra kunder"
              products={feed.trending}
              isLoading={feed.isLoading}
              badge="🔥 Trend"
            />
          )
        }

        if (section === 'similar_users' && feed.similarUsers.length > 0) {
          return (
            <RecommendationSection
              key="similar_users"
              title="Liknande kunder gillar"
              subtitle="Baserat på kunder med liknande smak"
              products={feed.similarUsers}
              isLoading={false}
            />
          )
        }

        return null
      })}
    </div>
  )
}
