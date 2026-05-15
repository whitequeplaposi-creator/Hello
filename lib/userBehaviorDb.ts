/**
 * userBehaviorDb.ts
 * Databasoperationer för användarbeteende och personalisering.
 * Hanterar spårning av interaktioner, preferensprofiler och produktpopularitet.
 */

import client from './db'

// ─── Typer ────────────────────────────────────────────────────────────────────

export type EventType =
  | 'view'
  | 'click'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'purchase'
  | 'wishlist'
  | 'share'

export interface UserProductEvent {
  id: string
  customerId: string
  productId: string
  eventType: EventType
  productCategory?: string
  productPrice?: number
  sessionId?: string
  durationSeconds?: number
  createdAt: string
}

export interface UserPreferenceProfile {
  customerId: string
  categoryWeights: Record<string, number>
  avgPriceInterest: number
  minPriceInterest: number
  maxPriceInterest: number
  colorWeights: Record<string, number>
  sizeWeights: Record<string, number>
  totalViews: number
  totalClicks: number
  totalPurchases: number
  totalWishlist: number
  lastActiveAt: string
  updatedAt: string
}

export interface ProductPopularity {
  productId: string
  totalViews: number
  totalClicks: number
  totalAddToCart: number
  totalPurchases: number
  totalWishlist: number
  popularityScore: number
  trendScore: number
  lastPurchasedAt?: string
  updatedAt: string
}

// Vikter för olika händelsetyper vid poängberäkning
const EVENT_WEIGHTS: Record<EventType, number> = {
  view: 1,
  click: 3,
  add_to_cart: 8,
  remove_from_cart: -2,
  purchase: 20,
  wishlist: 10,
  share: 5,
}

// ─── Initialisering ───────────────────────────────────────────────────────────

let behaviorTablesInitialized = false

export async function initBehaviorTables(): Promise<void> {
  if (behaviorTablesInitialized) return

  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS user_product_events (
        id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        event_type TEXT NOT NULL,
        product_category TEXT,
        product_price REAL,
        session_id TEXT,
        duration_seconds INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    await client.execute(`
      CREATE TABLE IF NOT EXISTS user_preference_profiles (
        customer_id TEXT PRIMARY KEY,
        category_weights TEXT DEFAULT '{}',
        avg_price_interest REAL DEFAULT 0,
        min_price_interest REAL DEFAULT 0,
        max_price_interest REAL DEFAULT 0,
        color_weights TEXT DEFAULT '{}',
        size_weights TEXT DEFAULT '{}',
        total_views INTEGER DEFAULT 0,
        total_clicks INTEGER DEFAULT 0,
        total_purchases INTEGER DEFAULT 0,
        total_wishlist INTEGER DEFAULT 0,
        last_active_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    await client.execute(`
      CREATE TABLE IF NOT EXISTS product_popularity (
        product_id TEXT PRIMARY KEY,
        total_views INTEGER DEFAULT 0,
        total_clicks INTEGER DEFAULT 0,
        total_add_to_cart INTEGER DEFAULT 0,
        total_purchases INTEGER DEFAULT 0,
        total_wishlist INTEGER DEFAULT 0,
        popularity_score REAL DEFAULT 0,
        trend_score REAL DEFAULT 0,
        last_purchased_at DATETIME,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    await client.execute(`
      CREATE TABLE IF NOT EXISTS recommendation_feedback (
        id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        recommendation_type TEXT NOT NULL,
        was_clicked INTEGER DEFAULT 0,
        was_purchased INTEGER DEFAULT 0,
        shown_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        clicked_at DATETIME,
        purchased_at DATETIME
      )
    `)
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_user_events_customer ON user_product_events(customer_id)`)
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_user_events_product ON user_product_events(product_id)`)
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_user_events_customer_type ON user_product_events(customer_id, event_type)`)
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_product_popularity_score ON product_popularity(popularity_score DESC)`)
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_product_popularity_trend ON product_popularity(trend_score DESC)`)

    behaviorTablesInitialized = true
  } catch (error) {
    console.warn('[userBehaviorDb] initBehaviorTables warning:', error)
    // Mark as initialized anyway to avoid repeated failures on every request
    behaviorTablesInitialized = true
  }
}

// ─── Händelsespårning ─────────────────────────────────────────────────────────

/**
 * Registrerar en produktinteraktion för en inloggad användare.
 * Uppdaterar även preferensprofilen och produktpopulariteten.
 */
export async function trackUserEvent(params: {
  customerId: string
  productId: string
  eventType: EventType
  productCategory?: string
  productPrice?: number
  productColors?: string[]
  productSizes?: string[]
  sessionId?: string
  durationSeconds?: number
}): Promise<void> {
  await initBehaviorTables()

  const id = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

  try {
    // 1. Spara händelsen
    await client.execute({
      sql: `INSERT INTO user_product_events
              (id, customer_id, product_id, event_type, product_category, product_price, session_id, duration_seconds)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        params.customerId,
        params.productId,
        params.eventType,
        params.productCategory ?? null,
        params.productPrice ?? null,
        params.sessionId ?? null,
        params.durationSeconds ?? 0,
      ],
    })

    // 2. Uppdatera preferensprofilen asynkront
    await updatePreferenceProfile(params)

    // 3. Uppdatera produktpopularitet
    await updateProductPopularity(params.productId, params.eventType)
  } catch (error) {
    console.error('[userBehaviorDb] trackUserEvent error:', error)
  }
}

// ─── Preferensprofil ──────────────────────────────────────────────────────────

async function updatePreferenceProfile(params: {
  customerId: string
  eventType: EventType
  productCategory?: string
  productPrice?: number
  productColors?: string[]
  productSizes?: string[]
}): Promise<void> {
  const weight = EVENT_WEIGHTS[params.eventType] ?? 1
  if (weight <= 0) return // Ignorera negativa händelser för profilen

  try {
    // Hämta befintlig profil
    const result = await client.execute({
      sql: 'SELECT * FROM user_preference_profiles WHERE customer_id = ?',
      args: [params.customerId],
    })

    let profile: UserPreferenceProfile

    if (result.rows.length === 0) {
      // Skapa ny profil
      profile = {
        customerId: params.customerId,
        categoryWeights: {},
        avgPriceInterest: 0,
        minPriceInterest: 0,
        maxPriceInterest: 0,
        colorWeights: {},
        sizeWeights: {},
        totalViews: 0,
        totalClicks: 0,
        totalPurchases: 0,
        totalWishlist: 0,
        lastActiveAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    } else {
      const row = result.rows[0]
      profile = {
        customerId: row.customer_id as string,
        categoryWeights: safeParseJson(row.category_weights as string, {}),
        avgPriceInterest: (row.avg_price_interest as number) ?? 0,
        minPriceInterest: (row.min_price_interest as number) ?? 0,
        maxPriceInterest: (row.max_price_interest as number) ?? 0,
        colorWeights: safeParseJson(row.color_weights as string, {}),
        sizeWeights: safeParseJson(row.size_weights as string, {}),
        totalViews: (row.total_views as number) ?? 0,
        totalClicks: (row.total_clicks as number) ?? 0,
        totalPurchases: (row.total_purchases as number) ?? 0,
        totalWishlist: (row.total_wishlist as number) ?? 0,
        lastActiveAt: (row.last_active_at as string) ?? new Date().toISOString(),
        updatedAt: (row.updated_at as string) ?? new Date().toISOString(),
      }
    }

    // Uppdatera kategori-vikter
    if (params.productCategory) {
      profile.categoryWeights[params.productCategory] =
        (profile.categoryWeights[params.productCategory] ?? 0) + weight
    }

    // Uppdatera prispreferens (exponentiellt glidande medelvärde)
    if (params.productPrice && params.productPrice > 0) {
      if (profile.avgPriceInterest === 0) {
        profile.avgPriceInterest = params.productPrice
        profile.minPriceInterest = params.productPrice
        profile.maxPriceInterest = params.productPrice
      } else {
        // EMA med alpha = 0.2 (20% ny data, 80% historik)
        profile.avgPriceInterest = 0.8 * profile.avgPriceInterest + 0.2 * params.productPrice
        profile.minPriceInterest = Math.min(profile.minPriceInterest, params.productPrice)
        profile.maxPriceInterest = Math.max(profile.maxPriceInterest, params.productPrice)
      }
    }

    // Uppdatera färgvikter
    if (params.productColors) {
      for (const color of params.productColors) {
        profile.colorWeights[color] = (profile.colorWeights[color] ?? 0) + weight
      }
    }

    // Uppdatera storleksvikter
    if (params.productSizes) {
      for (const size of params.productSizes) {
        profile.sizeWeights[size] = (profile.sizeWeights[size] ?? 0) + weight
      }
    }

    // Uppdatera räknare
    if (params.eventType === 'view') profile.totalViews++
    if (params.eventType === 'click') profile.totalClicks++
    if (params.eventType === 'purchase') profile.totalPurchases++
    if (params.eventType === 'wishlist') profile.totalWishlist++

    profile.lastActiveAt = new Date().toISOString()
    profile.updatedAt = new Date().toISOString()

    // Spara tillbaka
    await client.execute({
      sql: `INSERT INTO user_preference_profiles
              (customer_id, category_weights, avg_price_interest, min_price_interest, max_price_interest,
               color_weights, size_weights, total_views, total_clicks, total_purchases, total_wishlist,
               last_active_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(customer_id) DO UPDATE SET
              category_weights = excluded.category_weights,
              avg_price_interest = excluded.avg_price_interest,
              min_price_interest = excluded.min_price_interest,
              max_price_interest = excluded.max_price_interest,
              color_weights = excluded.color_weights,
              size_weights = excluded.size_weights,
              total_views = excluded.total_views,
              total_clicks = excluded.total_clicks,
              total_purchases = excluded.total_purchases,
              total_wishlist = excluded.total_wishlist,
              last_active_at = excluded.last_active_at,
              updated_at = excluded.updated_at`,
      args: [
        profile.customerId,
        JSON.stringify(profile.categoryWeights),
        profile.avgPriceInterest,
        profile.minPriceInterest,
        profile.maxPriceInterest,
        JSON.stringify(profile.colorWeights),
        JSON.stringify(profile.sizeWeights),
        profile.totalViews,
        profile.totalClicks,
        profile.totalPurchases,
        profile.totalWishlist,
        profile.lastActiveAt,
        profile.updatedAt,
      ],
    })
  } catch (error) {
    console.error('[userBehaviorDb] updatePreferenceProfile error:', error)
  }
}

// ─── Produktpopularitet ───────────────────────────────────────────────────────

async function updateProductPopularity(
  productId: string,
  eventType: EventType
): Promise<void> {
  try {
    const colMap: Partial<Record<EventType, string>> = {
      view: 'total_views',
      click: 'total_clicks',
      add_to_cart: 'total_add_to_cart',
      purchase: 'total_purchases',
      wishlist: 'total_wishlist',
    }

    const col = colMap[eventType]
    if (!col) return

    // Hämta nuvarande data
    const result = await client.execute({
      sql: 'SELECT * FROM product_popularity WHERE product_id = ?',
      args: [productId],
    })

    let views = 0, clicks = 0, addToCart = 0, purchases = 0, wishlist = 0

    if (result.rows.length > 0) {
      const row = result.rows[0]
      views = (row.total_views as number) ?? 0
      clicks = (row.total_clicks as number) ?? 0
      addToCart = (row.total_add_to_cart as number) ?? 0
      purchases = (row.total_purchases as number) ?? 0
      wishlist = (row.total_wishlist as number) ?? 0
    }

    // Öka rätt räknare
    if (eventType === 'view') views++
    if (eventType === 'click') clicks++
    if (eventType === 'add_to_cart') addToCart++
    if (eventType === 'purchase') purchases++
    if (eventType === 'wishlist') wishlist++

    // Beräkna popularitetspoäng (viktad summa)
    const popularityScore =
      views * 1 + clicks * 3 + addToCart * 8 + purchases * 20 + wishlist * 10

    // Hämta trendpoäng (senaste 7 dagarna)
    const trendResult = await client.execute({
      sql: `SELECT COUNT(*) as cnt FROM user_product_events
            WHERE product_id = ? AND created_at >= datetime('now', '-7 days')`,
      args: [productId],
    })
    const trendScore = (trendResult.rows[0]?.cnt as number) ?? 0

    const lastPurchasedAt = eventType === 'purchase' ? new Date().toISOString() : null

    await client.execute({
      sql: `INSERT INTO product_popularity
              (product_id, total_views, total_clicks, total_add_to_cart, total_purchases,
               total_wishlist, popularity_score, trend_score, last_purchased_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(product_id) DO UPDATE SET
              total_views = excluded.total_views,
              total_clicks = excluded.total_clicks,
              total_add_to_cart = excluded.total_add_to_cart,
              total_purchases = excluded.total_purchases,
              total_wishlist = excluded.total_wishlist,
              popularity_score = excluded.popularity_score,
              trend_score = excluded.trend_score,
              last_purchased_at = COALESCE(excluded.last_purchased_at, product_popularity.last_purchased_at),
              updated_at = CURRENT_TIMESTAMP`,
      args: [
        productId,
        views,
        clicks,
        addToCart,
        purchases,
        wishlist,
        popularityScore,
        trendScore,
        lastPurchasedAt,
      ],
    })
  } catch (error) {
    console.error('[userBehaviorDb] updateProductPopularity error:', error)
  }
}

// ─── Läsoperationer ───────────────────────────────────────────────────────────

/**
 * Hämtar preferensprofilen för en användare.
 */
export async function getUserPreferenceProfile(
  customerId: string
): Promise<UserPreferenceProfile | null> {
  await initBehaviorTables()

  try {
    const result = await client.execute({
      sql: 'SELECT * FROM user_preference_profiles WHERE customer_id = ?',
      args: [customerId],
    })

    if (result.rows.length === 0) return null

    const row = result.rows[0]
    return {
      customerId: row.customer_id as string,
      categoryWeights: safeParseJson(row.category_weights as string, {}),
      avgPriceInterest: (row.avg_price_interest as number) ?? 0,
      minPriceInterest: (row.min_price_interest as number) ?? 0,
      maxPriceInterest: (row.max_price_interest as number) ?? 0,
      colorWeights: safeParseJson(row.color_weights as string, {}),
      sizeWeights: safeParseJson(row.size_weights as string, {}),
      totalViews: (row.total_views as number) ?? 0,
      totalClicks: (row.total_clicks as number) ?? 0,
      totalPurchases: (row.total_purchases as number) ?? 0,
      totalWishlist: (row.total_wishlist as number) ?? 0,
      lastActiveAt: (row.last_active_at as string) ?? '',
      updatedAt: (row.updated_at as string) ?? '',
    }
  } catch (error) {
    console.error('[userBehaviorDb] getUserPreferenceProfile error:', error)
    return null
  }
}

/**
 * Hämtar de produkter en användare interagerat med (för att undvika att visa dem igen).
 */
export async function getUserInteractedProductIds(
  customerId: string,
  eventTypes: EventType[] = ['purchase', 'wishlist']
): Promise<Set<string>> {
  await initBehaviorTables()

  try {
    const placeholders = eventTypes.map(() => '?').join(', ')
    const result = await client.execute({
      sql: `SELECT DISTINCT product_id FROM user_product_events
            WHERE customer_id = ? AND event_type IN (${placeholders})`,
      args: [customerId, ...eventTypes],
    })

    return new Set(result.rows.map((r) => r.product_id as string))
  } catch (error) {
    console.error('[userBehaviorDb] getUserInteractedProductIds error:', error)
    return new Set()
  }
}

/**
 * Hämtar de mest populära produkterna baserat på aggregerade interaktioner.
 */
export async function getPopularProductIds(limit = 20): Promise<string[]> {
  await initBehaviorTables()

  try {
    const result = await client.execute({
      sql: `SELECT product_id FROM product_popularity
            ORDER BY popularity_score DESC LIMIT ?`,
      args: [limit],
    })

    return result.rows.map((r) => r.product_id as string)
  } catch (error) {
    console.error('[userBehaviorDb] getPopularProductIds error:', error)
    return []
  }
}

/**
 * Hämtar trendande produkter (hög aktivitet senaste 7 dagarna).
 */
export async function getTrendingProductIds(limit = 20): Promise<string[]> {
  await initBehaviorTables()

  try {
    const result = await client.execute({
      sql: `SELECT product_id, COUNT(*) as recent_events
            FROM user_product_events
            WHERE created_at >= datetime('now', '-7 days')
            GROUP BY product_id
            ORDER BY recent_events DESC
            LIMIT ?`,
      args: [limit],
    })

    return result.rows.map((r) => r.product_id as string)
  } catch (error) {
    console.error('[userBehaviorDb] getTrendingProductIds error:', error)
    return []
  }
}

/**
 * Hämtar produkter som ofta köps tillsammans med en given produkt
 * (baserat på faktisk köpdata från order_items).
 */
export async function getFrequentlyBoughtTogetherIds(
  productId: string,
  limit = 6
): Promise<string[]> {
  await initBehaviorTables()

  try {
    // Hitta ordrar som innehåller denna produkt, sedan hitta andra produkter i samma ordrar
    const result = await client.execute({
      sql: `SELECT oi2.product_id, COUNT(*) as co_purchases
            FROM order_items oi1
            JOIN order_items oi2 ON oi1.order_id = oi2.order_id AND oi2.product_id != oi1.product_id
            WHERE oi1.product_id = ?
            GROUP BY oi2.product_id
            ORDER BY co_purchases DESC
            LIMIT ?`,
      args: [productId, limit],
    })

    return result.rows.map((r) => r.product_id as string)
  } catch (error) {
    console.error('[userBehaviorDb] getFrequentlyBoughtTogetherIds error:', error)
    return []
  }
}

/**
 * Hämtar produkter som användare med liknande smak har köpt (collaborative filtering).
 * Hittar användare med liknande kategoripreferenser och returnerar deras köp.
 */
export async function getCollaborativeProductIds(
  customerId: string,
  limit = 12
): Promise<string[]> {
  await initBehaviorTables()

  try {
    // Hämta denna användares profil
    const profile = await getUserPreferenceProfile(customerId)
    if (!profile) return []

    // Hitta top-3 kategorier för denna användare
    const topCategories = Object.entries(profile.categoryWeights)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat]) => cat)

    if (topCategories.length === 0) return []

    // Hitta andra användare som också gillar dessa kategorier
    const placeholders = topCategories.map(() => '?').join(', ')
    const result = await client.execute({
      sql: `SELECT DISTINCT upe.product_id, COUNT(*) as relevance
            FROM user_product_events upe
            JOIN user_preference_profiles upp ON upe.customer_id = upp.customer_id
            WHERE upe.customer_id != ?
              AND upe.product_category IN (${placeholders})
              AND upe.event_type IN ('purchase', 'wishlist', 'add_to_cart')
            GROUP BY upe.product_id
            ORDER BY relevance DESC
            LIMIT ?`,
      args: [customerId, ...topCategories, limit],
    })

    return result.rows.map((r) => r.product_id as string)
  } catch (error) {
    console.error('[userBehaviorDb] getCollaborativeProductIds error:', error)
    return []
  }
}

/**
 * Loggar att en rekommendation visades för en användare.
 */
export async function logRecommendationShown(params: {
  customerId: string
  productIds: string[]
  recommendationType: string
}): Promise<void> {
  await initBehaviorTables()

  try {
    for (const productId of params.productIds) {
      const id = `rec_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      await client.execute({
        sql: `INSERT INTO recommendation_feedback (id, customer_id, product_id, recommendation_type)
              VALUES (?, ?, ?, ?)`,
        args: [id, params.customerId, productId, params.recommendationType],
      })
    }
  } catch (error) {
    console.error('[userBehaviorDb] logRecommendationShown error:', error)
  }
}

/**
 * Markerar att en rekommendation klickades.
 */
export async function markRecommendationClicked(
  customerId: string,
  productId: string
): Promise<void> {
  await initBehaviorTables()

  try {
    await client.execute({
      sql: `UPDATE recommendation_feedback
            SET was_clicked = 1, clicked_at = CURRENT_TIMESTAMP
            WHERE customer_id = ? AND product_id = ? AND was_clicked = 0
            ORDER BY shown_at DESC LIMIT 1`,
      args: [customerId, productId],
    })
  } catch {
    // Ignorera — icke-kritisk operation
  }
}

// ─── Hjälpfunktioner ──────────────────────────────────────────────────────────

function safeParseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}
