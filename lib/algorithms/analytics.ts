import { Product, CartItem } from '../types'

/**
 * Customer Analytics - Kundanalys
 */

/**
 * Customer Lifetime Value (CLV) - Kundens livstidsvärde
 */
export function calculateCLV(
  avgOrderValue: number,
  purchaseFrequency: number,
  customerLifespan: number,
  profitMargin: number = 0.3
): number {
  return avgOrderValue * purchaseFrequency * customerLifespan * profitMargin
}

/**
 * Customer Segmentation - Kundsegmentering (RFM)
 */
export interface RFMScore {
  customerId: string
  recency: number // Dagar sedan senaste köp
  frequency: number // Antal köp
  monetary: number // Total spenderad summa
  rfmScore: string // T.ex. "555" (högst)
  segment: 'Champions' | 'Loyal' | 'Potential' | 'At Risk' | 'Lost'
}

export function calculateRFMScore(
  customers: Array<{
    customerId: string
    lastPurchaseDate: Date
    totalPurchases: number
    totalSpent: number
  }>
): RFMScore[] {
  const now = new Date()

  // Beräkna recency för alla kunder
  const withRecency = customers.map(c => ({
    ...c,
    recency: Math.floor((now.getTime() - c.lastPurchaseDate.getTime()) / (1000 * 60 * 60 * 24))
  }))

  // Skapa kvintiler för varje dimension
  const recencyQuintiles = createQuintiles(withRecency.map(c => c.recency), true) // Lägre är bättre
  const frequencyQuintiles = createQuintiles(withRecency.map(c => c.totalPurchases), false)
  const monetaryQuintiles = createQuintiles(withRecency.map(c => c.totalSpent), false)

  return withRecency.map((c, index) => {
    const r = recencyQuintiles[index]
    const f = frequencyQuintiles[index]
    const m = monetaryQuintiles[index]
    const rfmScore = `${r}${f}${m}`
    const segment = determineSegment(r, f, m)

    return {
      customerId: c.customerId,
      recency: c.recency,
      frequency: c.totalPurchases,
      monetary: c.totalSpent,
      rfmScore,
      segment
    }
  })
}

function createQuintiles(values: number[], reverse: boolean = false): number[] {
  const sorted = [...values].sort((a, b) => reverse ? b - a : a - b)
  const quintileSize = Math.ceil(sorted.length / 5)

  return values.map(value => {
    const index = sorted.indexOf(value)
    return Math.min(5, Math.floor(index / quintileSize) + 1)
  })
}

function determineSegment(r: number, f: number, m: number): RFMScore['segment'] {
  const score = r + f + m

  if (r >= 4 && f >= 4 && m >= 4) return 'Champions'
  if (f >= 3 && m >= 3) return 'Loyal'
  if (r >= 4 && f <= 2) return 'Potential'
  if (r <= 2 && f >= 3) return 'At Risk'
  return 'Lost'
}

/**
 * Churn Prediction - Förutsäga kundbortfall
 */
export interface ChurnPrediction {
  customerId: string
  churnProbability: number // 0-1
  riskLevel: 'low' | 'medium' | 'high'
  recommendedAction: string
}

export function predictChurn(
  customers: Array<{
    customerId: string
    daysSinceLastPurchase: number
    totalPurchases: number
    avgDaysBetweenPurchases: number
    totalSpent: number
  }>
): ChurnPrediction[] {
  return customers.map(c => {
    let churnScore = 0

    // Faktor 1: Tid sedan senaste köp
    const expectedNextPurchase = c.avgDaysBetweenPurchases * 1.5
    if (c.daysSinceLastPurchase > expectedNextPurchase) {
      churnScore += 0.4
    }

    // Faktor 2: Köpfrekvens
    if (c.totalPurchases < 3) {
      churnScore += 0.3
    }

    // Faktor 3: Spenderat belopp
    if (c.totalSpent < 1000) {
      churnScore += 0.2
    }

    // Faktor 4: Trend
    const daysSinceRatio = c.daysSinceLastPurchase / c.avgDaysBetweenPurchases
    if (daysSinceRatio > 2) {
      churnScore += 0.1
    }

    const churnProbability = Math.min(1, churnScore)
    let riskLevel: 'low' | 'medium' | 'high'
    let recommendedAction: string

    if (churnProbability >= 0.7) {
      riskLevel = 'high'
      recommendedAction = 'Skicka personlig rabattkod och win-back kampanj'
    } else if (churnProbability >= 0.4) {
      riskLevel = 'medium'
      recommendedAction = 'Skicka påminnelse med produktrekommendationer'
    } else {
      riskLevel = 'low'
      recommendedAction = 'Fortsätt med normal kommunikation'
    }

    return {
      customerId: c.customerId,
      churnProbability,
      riskLevel,
      recommendedAction
    }
  })
}

/**
 * Conversion Rate Optimization - Konverteringsoptimering
 */
export interface ConversionFunnel {
  stage: string
  visitors: number
  conversionRate: number
  dropoffRate: number
}

export function analyzeConversionFunnel(
  visitors: number,
  productViews: number,
  addToCarts: number,
  checkouts: number,
  purchases: number
): ConversionFunnel[] {
  return [
    {
      stage: 'Besökare',
      visitors: visitors,
      conversionRate: 100,
      dropoffRate: 0
    },
    {
      stage: 'Produktvisning',
      visitors: productViews,
      conversionRate: (productViews / visitors) * 100,
      dropoffRate: ((visitors - productViews) / visitors) * 100
    },
    {
      stage: 'Lägg i varukorg',
      visitors: addToCarts,
      conversionRate: (addToCarts / productViews) * 100,
      dropoffRate: ((productViews - addToCarts) / productViews) * 100
    },
    {
      stage: 'Kassa',
      visitors: checkouts,
      conversionRate: (checkouts / addToCarts) * 100,
      dropoffRate: ((addToCarts - checkouts) / addToCarts) * 100
    },
    {
      stage: 'Köp',
      visitors: purchases,
      conversionRate: (purchases / checkouts) * 100,
      dropoffRate: ((checkouts - purchases) / checkouts) * 100
    }
  ]
}

/**
 * Cart Abandonment Analysis - Övergivna varukorgar
 */
export interface AbandonmentInsight {
  totalAbandoned: number
  abandonmentRate: number
  potentialRevenue: number
  topReasons: Array<{ reason: string; percentage: number }>
  recoveryOpportunity: number
}

export function analyzeCartAbandonment(
  cartsCreated: number,
  cartsCompleted: number,
  avgCartValue: number,
  reasons?: Array<{ reason: string; count: number }>
): AbandonmentInsight {
  const abandoned = cartsCreated - cartsCompleted
  const abandonmentRate = (abandoned / cartsCreated) * 100
  const potentialRevenue = abandoned * avgCartValue

  let topReasons: Array<{ reason: string; percentage: number }> = []
  if (reasons) {
    const totalReasons = reasons.reduce((sum, r) => sum + r.count, 0)
    topReasons = reasons
      .map(r => ({
        reason: r.reason,
        percentage: (r.count / totalReasons) * 100
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5)
  }

  // Uppskatta återhämtningsmöjlighet (typiskt 10-15% av övergivna)
  const recoveryOpportunity = potentialRevenue * 0.12

  return {
    totalAbandoned: abandoned,
    abandonmentRate,
    potentialRevenue,
    topReasons,
    recoveryOpportunity
  }
}

/**
 * Product Performance Analytics - Produktprestandaanalys
 */
export interface ProductPerformance {
  productId: string
  views: number
  addToCarts: number
  purchases: number
  revenue: number
  conversionRate: number
  cartConversionRate: number
  avgTimeOnPage: number
  bounceRate: number
  rating: 'excellent' | 'good' | 'average' | 'poor'
}

export function analyzeProductPerformance(
  products: Array<{
    productId: string
    views: number
    addToCarts: number
    purchases: number
    revenue: number
    avgTimeOnPage: number
    bounceRate: number
  }>
): ProductPerformance[] {
  return products.map(p => {
    const conversionRate = p.views > 0 ? (p.purchases / p.views) * 100 : 0
    const cartConversionRate = p.addToCarts > 0 ? (p.purchases / p.addToCarts) * 100 : 0

    let rating: ProductPerformance['rating']
    if (conversionRate >= 5 && cartConversionRate >= 30) {
      rating = 'excellent'
    } else if (conversionRate >= 2 && cartConversionRate >= 20) {
      rating = 'good'
    } else if (conversionRate >= 1 && cartConversionRate >= 10) {
      rating = 'average'
    } else {
      rating = 'poor'
    }

    return {
      productId: p.productId,
      views: p.views,
      addToCarts: p.addToCarts,
      purchases: p.purchases,
      revenue: p.revenue,
      conversionRate,
      cartConversionRate,
      avgTimeOnPage: p.avgTimeOnPage,
      bounceRate: p.bounceRate,
      rating
    }
  })
}

/**
 * Cohort Analysis - Kohortanalys
 */
export interface CohortData {
  cohort: string // T.ex. "2024-01"
  customersCount: number
  retention: number[] // Retention per månad
  revenue: number[]
}

export function analyzeCohorts(
  cohorts: Array<{
    cohort: string
    month0: number // Antal kunder första månaden
    retentionData: number[] // Antal aktiva kunder per månad
    revenueData: number[]
  }>
): CohortData[] {
  return cohorts.map(c => ({
    cohort: c.cohort,
    customersCount: c.month0,
    retention: c.retentionData.map(count => (count / c.month0) * 100),
    revenue: c.revenueData
  }))
}

/**
 * A/B Test Analysis - A/B-testanalys
 */
export interface ABTestResult {
  variant: string
  visitors: number
  conversions: number
  conversionRate: number
  revenue: number
  avgOrderValue: number
  isWinner: boolean
  confidenceLevel: number
}

export function analyzeABTest(
  variantA: { visitors: number; conversions: number; revenue: number },
  variantB: { visitors: number; conversions: number; revenue: number }
): { variantA: ABTestResult; variantB: ABTestResult; recommendation: string } {
  const crA = (variantA.conversions / variantA.visitors) * 100
  const crB = (variantB.conversions / variantB.visitors) * 100
  const aovA = variantA.revenue / variantA.conversions
  const aovB = variantB.revenue / variantB.conversions

  // Förenklad statistisk signifikans (Z-test)
  const pooledCR = (variantA.conversions + variantB.conversions) / 
                   (variantA.visitors + variantB.visitors)
  const se = Math.sqrt(pooledCR * (1 - pooledCR) * 
                      (1 / variantA.visitors + 1 / variantB.visitors))
  const zScore = Math.abs((crA - crB) / 100) / se
  const confidenceLevel = zScore >= 1.96 ? 95 : zScore >= 1.65 ? 90 : 0

  const isAWinner = crA > crB && confidenceLevel >= 90
  const isBWinner = crB > crA && confidenceLevel >= 90

  let recommendation: string
  if (confidenceLevel < 90) {
    recommendation = 'Fortsätt testa - ingen statistiskt signifikant skillnad än'
  } else if (isAWinner) {
    recommendation = `Variant A är vinnare med ${confidenceLevel}% konfidens`
  } else {
    recommendation = `Variant B är vinnare med ${confidenceLevel}% konfidens`
  }

  return {
    variantA: {
      variant: 'A',
      visitors: variantA.visitors,
      conversions: variantA.conversions,
      conversionRate: crA,
      revenue: variantA.revenue,
      avgOrderValue: aovA,
      isWinner: isAWinner,
      confidenceLevel
    },
    variantB: {
      variant: 'B',
      visitors: variantB.visitors,
      conversions: variantB.conversions,
      conversionRate: crB,
      revenue: variantB.revenue,
      avgOrderValue: aovB,
      isWinner: isBWinner,
      confidenceLevel
    },
    recommendation
  }
}

/**
 * Revenue Attribution - Intäktsattribuering
 */
export type AttributionModel = 'first-touch' | 'last-touch' | 'linear' | 'time-decay'

export function calculateAttribution(
  touchpoints: Array<{ channel: string; timestamp: Date; value: number }>,
  model: AttributionModel
): Map<string, number> {
  const attribution = new Map<string, number>()

  if (touchpoints.length === 0) return attribution

  switch (model) {
    case 'first-touch':
      attribution.set(touchpoints[0].channel, touchpoints[0].value)
      break

    case 'last-touch':
      const last = touchpoints[touchpoints.length - 1]
      attribution.set(last.channel, last.value)
      break

    case 'linear':
      const linearValue = touchpoints[0].value / touchpoints.length
      touchpoints.forEach(tp => {
        attribution.set(tp.channel, (attribution.get(tp.channel) || 0) + linearValue)
      })
      break

    case 'time-decay':
      const halfLife = 7 * 24 * 60 * 60 * 1000 // 7 dagar i millisekunder
      const lastTimestamp = touchpoints[touchpoints.length - 1].timestamp.getTime()
      let totalWeight = 0

      const weights = touchpoints.map(tp => {
        const timeDiff = lastTimestamp - tp.timestamp.getTime()
        const weight = Math.exp(-timeDiff / halfLife)
        totalWeight += weight
        return weight
      })

      touchpoints.forEach((tp, index) => {
        const value = (weights[index] / totalWeight) * tp.value
        attribution.set(tp.channel, (attribution.get(tp.channel) || 0) + value)
      })
      break
  }

  return attribution
}
