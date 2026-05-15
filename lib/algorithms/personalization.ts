/**
 * personalization.ts
 * Personaliserade rekommendationsalgoritmer för inloggade användare.
 *
 * Kombinerar flera signaler:
 *  1. Användarens preferensprofil (kategori, pris, färg, storlek)
 *  2. Collaborative filtering (vad liknande användare gillar)
 *  3. Faktisk köpdata (frequently bought together)
 *  4. Realtidspopularitet (trendande produkter)
 *  5. Sessionsbeteende (vad användaren tittat på nu)
 */

import type { Product } from '../types'
import type { UserPreferenceProfile } from '../userBehaviorDb'
import { applyDiversityLayer } from '../productUtils'

// ─── Typer ────────────────────────────────────────────────────────────────────

export interface PersonalizationContext {
  /** Inloggad användares preferensprofil från databasen */
  profile: UserPreferenceProfile | null
  /** Produkt-ID:n som användaren redan köpt eller lagt i önskelistan */
  excludeProductIds?: Set<string>
  /** Produkt-ID:n som är trendande just nu */
  trendingProductIds?: string[]
  /** Produkt-ID:n som liknande användare gillar */
  collaborativeProductIds?: string[]
  /** Produkt-ID:n från sessionens localStorage-historik */
  sessionProductIds?: string[]
}

export interface ScoredProduct {
  product: Product
  score: number
  reasons: string[]
}

export type RecommendationSection =
  | 'for_you'
  | 'trending'
  | 'because_you_viewed'
  | 'similar_users'
  | 'new_arrivals'

export interface PersonalizedFeed {
  forYou: Product[]
  trending: Product[]
  becauseYouViewed: Product[]
  similarUsers: Product[]
  hasPersonalization: boolean
}

// ─── Huvud-algoritm ───────────────────────────────────────────────────────────

/**
 * Bygger ett komplett personaliserat produktflöde för en inloggad användare.
 * Returnerar separata sektioner som kan visas i UI:t.
 */
export function buildPersonalizedFeed(
  allProducts: Product[],
  context: PersonalizationContext,
  limits = { forYou: 12, trending: 8, becauseYouViewed: 8, similarUsers: 8 }
): PersonalizedFeed {
  const available = allProducts.filter(
    (p) => p.inStock && !context.excludeProductIds?.has(p.id)
  )

  const hasProfile =
    context.profile !== null &&
    Object.keys(context.profile?.categoryWeights ?? {}).length > 0

  // 1. "För dig" — personaliserat baserat på preferensprofil
  // Post-Ranking Diversity Layer: blanda kategorier efter poängsättning så att
  // liknande produkter inte visas direkt efter varandra i rekommendationsflödet.
  const forYouRanked = hasProfile
    ? scoreByPreferenceProfile(available, context.profile!, limits.forYou)
    : getFallbackProducts(available, limits.forYou)
  const forYou = applyDiversityLayer(forYouRanked)

  // 2. Trendande — baserat på faktisk aktivitet senaste 7 dagarna
  const trendingIds = new Set(context.trendingProductIds ?? [])
  const trendingRanked = available
    .filter((p) => trendingIds.has(p.id))
    .slice(0, limits.trending)
    .concat(
      // Fyll upp med populära om inte tillräckligt med trendande
      available
        .filter((p) => !trendingIds.has(p.id))
        .slice(0, Math.max(0, limits.trending - trendingIds.size))
    )
    .slice(0, limits.trending)
  const trending = applyDiversityLayer(trendingRanked)

  // 3. "Eftersom du tittade på" — baserat på sessionsbeteende
  const sessionIds = new Set(context.sessionProductIds ?? [])
  const becauseYouViewedRanked = sessionIds.size > 0
    ? scoreBySessionHistory(available, sessionIds, limits.becauseYouViewed)
    : []
  const becauseYouViewed = applyDiversityLayer(becauseYouViewedRanked)

  // 4. "Liknande användare gillar" — collaborative filtering
  const collabIds = new Set(context.collaborativeProductIds ?? [])
  const similarUsersRanked = available
    .filter((p) => collabIds.has(p.id))
    .slice(0, limits.similarUsers)
  const similarUsers = applyDiversityLayer(similarUsersRanked)

  return {
    forYou,
    trending,
    becauseYouViewed,
    similarUsers,
    hasPersonalization: hasProfile,
  }
}

// ─── Poängsättning baserat på preferensprofil ─────────────────────────────────

/**
 * Rankar produkter baserat på användarens inlärda preferensprofil.
 * Tar hänsyn till kategori, pris, färg och storlek.
 */
export function scoreByPreferenceProfile(
  products: Product[],
  profile: UserPreferenceProfile,
  limit: number
): Product[] {
  const totalCategoryWeight = Object.values(profile.categoryWeights).reduce(
    (s, v) => s + v,
    0
  )
  const totalColorWeight = Object.values(profile.colorWeights).reduce(
    (s, v) => s + v,
    0
  )

  const scored: ScoredProduct[] = products.map((product) => {
    let score = 0
    const reasons: string[] = []

    // ── Kategoripoäng (max 50) ──────────────────────────────────────────────
    const catWeight = profile.categoryWeights[product.category] ?? 0
    if (catWeight > 0 && totalCategoryWeight > 0) {
      const catScore = (catWeight / totalCategoryWeight) * 50
      score += catScore
      reasons.push(`kategori:${product.category}`)
    }

    // ── Prispoäng (max 30) ──────────────────────────────────────────────────
    if (profile.avgPriceInterest > 0) {
      const priceDiff = Math.abs(product.price - profile.avgPriceInterest)
      const priceRange = Math.max(
        profile.maxPriceInterest - profile.minPriceInterest,
        100
      )
      const priceScore = Math.max(0, 30 * (1 - priceDiff / priceRange))
      score += priceScore
      if (priceScore > 15) reasons.push('pris:match')
    }

    // ── Färgpoäng (max 15) ──────────────────────────────────────────────────
    if (product.colors && totalColorWeight > 0) {
      for (const color of product.colors) {
        const colorWeight = profile.colorWeights[color] ?? 0
        if (colorWeight > 0) {
          score += (colorWeight / totalColorWeight) * 15
          reasons.push(`färg:${color}`)
          break // En färgmatch räcker
        }
      }
    }

    // ── Storlekspoäng (max 10) ──────────────────────────────────────────────
    if (product.sizes) {
      const totalSizeWeight = Object.values(profile.sizeWeights).reduce(
        (s, v) => s + v,
        0
      )
      if (totalSizeWeight > 0) {
        for (const size of product.sizes) {
          const sizeWeight = profile.sizeWeights[size] ?? 0
          if (sizeWeight > 0) {
            score += (sizeWeight / totalSizeWeight) * 10
            reasons.push(`storlek:${size}`)
            break
          }
        }
      }
    }

    // ── Aktivitetsbonus ─────────────────────────────────────────────────────
    // Användare med fler köp får mer precisa rekommendationer
    const activityMultiplier = Math.min(
      1.5,
      1 + profile.totalPurchases * 0.05 + profile.totalClicks * 0.01
    )
    score *= activityMultiplier

    return { product, score, reasons }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.product)
}

// ─── Sessionsbeteende ─────────────────────────────────────────────────────────

/**
 * Hittar produkter liknande de användaren tittat på i denna session.
 */
function scoreBySessionHistory(
  products: Product[],
  sessionProductIds: Set<string>,
  limit: number
): Product[] {
  // Hämta kategorierna för sessionsprodukterna
  const sessionProducts = products.filter((p) => sessionProductIds.has(p.id))
  if (sessionProducts.length === 0) return []

  const sessionCategories = new Map<string, number>()
  for (const p of sessionProducts) {
    sessionCategories.set(p.category, (sessionCategories.get(p.category) ?? 0) + 1)
  }

  const avgSessionPrice =
    sessionProducts.reduce((s, p) => s + p.price, 0) / sessionProducts.length

  return products
    .filter((p) => !sessionProductIds.has(p.id))
    .map((p) => {
      let score = 0
      const catCount = sessionCategories.get(p.category) ?? 0
      score += catCount * 20
      const priceDiff = Math.abs(p.price - avgSessionPrice)
      score += Math.max(0, 15 - priceDiff / 100)
      return { product: p, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.product)
}

// ─── Fallback för nya användare ───────────────────────────────────────────────

/**
 * Returnerar ett diversifierat urval för användare utan historik.
 * Väljer produkter från olika kategorier för att täcka bred smak.
 */
function getFallbackProducts(products: Product[], limit: number): Product[] {
  const byCategory = new Map<string, Product[]>()
  for (const p of products) {
    if (!byCategory.has(p.category)) byCategory.set(p.category, [])
    byCategory.get(p.category)!.push(p)
  }

  const result: Product[] = []
  const categories = Array.from(byCategory.keys())
  let i = 0

  while (result.length < limit && i < limit * 3) {
    const cat = categories[i % categories.length]
    const bucket = byCategory.get(cat)!
    const idx = Math.floor(i / categories.length)
    if (bucket[idx]) result.push(bucket[idx])
    i++
  }

  return result.slice(0, limit)
}

// ─── Liknande produkter (för produktsidan) ────────────────────────────────────

/**
 * Hittar produkter liknande en given produkt, med hänsyn till användarens profil.
 * Används på produktdetaljsidan.
 */
export function getSimilarProductsPersonalized(
  product: Product,
  allProducts: Product[],
  profile: UserPreferenceProfile | null,
  limit = 8
): Product[] {
  const candidates = allProducts.filter((p) => p.id !== product.id && p.inStock)

  return candidates
    .map((p) => {
      let score = 0

      // Samma kategori
      if (p.category === product.category) score += 40

      // Liknande pris (±50%)
      const priceDiff = Math.abs(p.price - product.price)
      score += Math.max(0, 25 - priceDiff / 50)

      // Gemensamma färger
      if (product.colors && p.colors) {
        const common = product.colors.filter((c) => p.colors!.includes(c))
        score += common.length * 5
      }

      // Gemensamma storlekar
      if (product.sizes && p.sizes) {
        const common = product.sizes.filter((s) => p.sizes!.includes(s))
        score += common.length * 3
      }

      // Boost om produkten matchar användarens preferenser
      if (profile) {
        const catWeight = profile.categoryWeights[p.category] ?? 0
        score += Math.min(20, catWeight * 2)
      }

      return { product: p, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.product)
}

// ─── Rekommendationsförklaring ────────────────────────────────────────────────

/**
 * Genererar en mänsklig förklaring till varför en produkt rekommenderas.
 */
export function getRecommendationReason(
  product: Product,
  profile: UserPreferenceProfile | null,
  section: RecommendationSection
): string {
  const reasons: Record<RecommendationSection, string> = {
    for_you: profile
      ? `Baserat på ditt intresse för ${getTopCategory(profile)}`
      : 'Populärt just nu',
    trending: 'Trendande just nu',
    because_you_viewed: `Liknande det du tittade på`,
    similar_users: 'Populärt bland liknande kunder',
    new_arrivals: 'Nytt i sortimentet',
  }

  return reasons[section] ?? 'Rekommenderat för dig'
}

function getTopCategory(profile: UserPreferenceProfile): string {
  const entries = Object.entries(profile.categoryWeights)
  if (entries.length === 0) return 'mode'
  return entries.sort((a, b) => b[1] - a[1])[0][0]
}
