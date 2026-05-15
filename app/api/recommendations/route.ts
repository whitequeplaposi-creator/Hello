/**
 * GET /api/recommendations?customerId=xxx&section=for_you&limit=12
 * Returnerar personaliserade produktrekommendationer för en inloggad användare.
 *
 * Query-parametrar:
 *  - customerId (required): Kundens ID
 *  - section: 'for_you' | 'trending' | 'similar_users' | 'all' (default: 'all')
 *  - limit: antal produkter per sektion (default: 12)
 *  - sessionProducts: kommaseparerade produkt-ID:n från sessionen
 */

import { NextResponse } from 'next/server'
import { getProducts } from '@/lib/db'
import {
  getUserPreferenceProfile,
  getUserInteractedProductIds,
  getTrendingProductIds,
  getCollaborativeProductIds,
} from '@/lib/userBehaviorDb'
import { buildPersonalizedFeed } from '@/lib/algorithms/personalization'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')
    const section = searchParams.get('section') ?? 'all'
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '12'), 50)
    const sessionProductsParam = searchParams.get('sessionProducts') ?? ''

    if (!customerId) {
      return NextResponse.json(
        { success: false, error: 'customerId krävs' },
        { status: 400 }
      )
    }

    // Hämta alla produkter och användardata parallellt
    const [allProducts, profile, excludeIds, trendingIds, collaborativeIds] =
      await Promise.all([
        getProducts(500),
        getUserPreferenceProfile(customerId),
        getUserInteractedProductIds(customerId, ['purchase']),
        getTrendingProductIds(30),
        getCollaborativeProductIds(customerId, 20),
      ])

    // Sessionsprodukter från klienten
    const sessionProductIds = sessionProductsParam
      ? sessionProductsParam.split(',').filter(Boolean)
      : []

    // Bygg personaliserat flöde
    const feed = buildPersonalizedFeed(
      allProducts,
      {
        profile,
        excludeProductIds: excludeIds,
        trendingProductIds: trendingIds,
        collaborativeProductIds: collaborativeIds,
        sessionProductIds,
      },
      {
        forYou: limit,
        trending: limit,
        becauseYouViewed: limit,
        similarUsers: limit,
      }
    )

    // Returnera rätt sektion
    if (section === 'for_you') {
      return NextResponse.json({
        success: true,
        products: feed.forYou,
        hasPersonalization: feed.hasPersonalization,
        section: 'for_you',
      })
    }

    if (section === 'trending') {
      return NextResponse.json({
        success: true,
        products: feed.trending,
        hasPersonalization: false,
        section: 'trending',
      })
    }

    if (section === 'similar_users') {
      return NextResponse.json({
        success: true,
        products: feed.similarUsers,
        hasPersonalization: feed.hasPersonalization,
        section: 'similar_users',
      })
    }

    // 'all' — returnera alla sektioner
    return NextResponse.json({
      success: true,
      feed: {
        forYou: feed.forYou,
        trending: feed.trending,
        becauseYouViewed: feed.becauseYouViewed,
        similarUsers: feed.similarUsers,
      },
      hasPersonalization: feed.hasPersonalization,
      profileSummary: profile
        ? {
            topCategories: Object.entries(profile.categoryWeights)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3)
              .map(([cat]) => cat),
            totalInteractions:
              profile.totalViews + profile.totalClicks + profile.totalPurchases,
            avgPriceInterest: Math.round(profile.avgPriceInterest),
          }
        : null,
    })
  } catch (error) {
    console.error('[/api/recommendations] GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Internt serverfel' },
      { status: 500 }
    )
  }
}
