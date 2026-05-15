import { Product } from '../types'

/**
 * Dynamic Pricing - Dynamisk prissättning baserat på olika faktorer
 */
export interface PricingFactors {
  demand: number // 0-1 (låg till hög efterfrågan)
  inventory: number // Antal i lager
  seasonality: number // 0-1 (lågsäsong till högsäsong)
  competition: number // 0-1 (hög konkurrens till låg konkurrens)
  timeOfDay?: number // 0-23 (timme på dygnet)
}

export function calculateDynamicPrice(
  basePrice: number,
  factors: PricingFactors
): number {
  let multiplier = 1.0

  // Efterfrågan (högre efterfrågan = högre pris)
  multiplier += (factors.demand - 0.5) * 0.3

  // Lager (lågt lager = högre pris)
  if (factors.inventory < 10) {
    multiplier += 0.15
  } else if (factors.inventory < 5) {
    multiplier += 0.25
  }

  // Säsong (högsäsong = högre pris)
  multiplier += (factors.seasonality - 0.5) * 0.2

  // Konkurrens (låg konkurrens = högre pris)
  multiplier += (factors.competition - 0.5) * 0.15

  // Tid på dygnet (peak hours = högre pris)
  if (factors.timeOfDay !== undefined) {
    if (factors.timeOfDay >= 18 && factors.timeOfDay <= 21) {
      multiplier += 0.05 // Peak shopping hours
    }
  }

  // Begränsa prisändringar till ±30%
  multiplier = Math.max(0.7, Math.min(1.3, multiplier))

  return Math.round(basePrice * multiplier)
}

/**
 * Bundle Pricing - Beräkna pris för produktpaket
 */
export function calculateBundlePrice(
  products: Product[],
  discountPercentage: number = 15
): number {
  const totalPrice = products.reduce((sum, p) => sum + p.price, 0)
  const discount = totalPrice * (discountPercentage / 100)
  return Math.round(totalPrice - discount)
}

/**
 * Volume Discount - Rabatt baserat på kvantitet
 */
export function calculateVolumeDiscount(
  unitPrice: number,
  quantity: number
): { totalPrice: number; discount: number; discountPercentage: number } {
  let discountPercentage = 0

  if (quantity >= 10) {
    discountPercentage = 20
  } else if (quantity >= 5) {
    discountPercentage = 10
  } else if (quantity >= 3) {
    discountPercentage = 5
  }

  const discount = (unitPrice * quantity * discountPercentage) / 100
  const totalPrice = unitPrice * quantity - discount

  return {
    totalPrice: Math.round(totalPrice),
    discount: Math.round(discount),
    discountPercentage
  }
}

/**
 * Psychological Pricing - Psykologisk prissättning
 */
export function applyPsychologicalPricing(price: number): number {
  // Charm pricing: Avsluta med 9 eller 99
  if (price >= 100) {
    return Math.floor(price / 10) * 10 - 1 // 299, 499, 999
  } else {
    return Math.ceil(price / 10) * 10 - 1 // 29, 49, 99
  }
}

/**
 * Competitor Price Analysis - Analysera konkurrentpriser
 */
export interface CompetitorPrice {
  competitor: string
  price: number
  url?: string
}

export function analyzeCompetitorPricing(
  ourPrice: number,
  competitorPrices: CompetitorPrice[]
): {
  position: 'lowest' | 'competitive' | 'premium'
  suggestedPrice: number
  savings: number
} {
  if (competitorPrices.length === 0) {
    return {
      position: 'competitive',
      suggestedPrice: ourPrice,
      savings: 0
    }
  }

  const prices = competitorPrices.map(c => c.price)
  const avgCompetitorPrice = prices.reduce((a, b) => a + b, 0) / prices.length
  const minCompetitorPrice = Math.min(...prices)
  const maxCompetitorPrice = Math.max(...prices)

  let position: 'lowest' | 'competitive' | 'premium'
  let suggestedPrice = ourPrice

  if (ourPrice <= minCompetitorPrice) {
    position = 'lowest'
  } else if (ourPrice <= avgCompetitorPrice) {
    position = 'competitive'
    // Föreslå att matcha lägsta priset minus 5%
    suggestedPrice = Math.round(minCompetitorPrice * 0.95)
  } else {
    position = 'premium'
    // Föreslå att sänka till genomsnittspriset
    suggestedPrice = Math.round(avgCompetitorPrice)
  }

  const savings = Math.max(0, minCompetitorPrice - ourPrice)

  return { position, suggestedPrice, savings }
}

/**
 * Time-Based Pricing - Tidsberoende prissättning
 */
export function getTimeBasedPrice(
  basePrice: number,
  date: Date = new Date()
): number {
  const hour = date.getHours()
  const dayOfWeek = date.getDay()
  let multiplier = 1.0

  // Helgpriser (lördag-söndag)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    multiplier += 0.05
  }

  // Peak hours (18-21)
  if (hour >= 18 && hour <= 21) {
    multiplier += 0.08
  }

  // Late night discount (00-06)
  if (hour >= 0 && hour <= 6) {
    multiplier -= 0.1
  }

  return Math.round(basePrice * multiplier)
}

/**
 * Clearance Pricing - Utförsäljningspriser
 */
export function calculateClearancePrice(
  originalPrice: number,
  daysInStock: number,
  inventory: number
): { price: number; discountPercentage: number } {
  let discountPercentage = 0

  // Basrabatt baserat på tid i lager
  if (daysInStock > 180) {
    discountPercentage = 50
  } else if (daysInStock > 120) {
    discountPercentage = 40
  } else if (daysInStock > 90) {
    discountPercentage = 30
  } else if (daysInStock > 60) {
    discountPercentage = 20
  }

  // Extra rabatt för högt lager
  if (inventory > 50) {
    discountPercentage += 10
  } else if (inventory > 100) {
    discountPercentage += 15
  }

  // Max 70% rabatt
  discountPercentage = Math.min(70, discountPercentage)

  const price = Math.round(originalPrice * (1 - discountPercentage / 100))

  return { price, discountPercentage }
}

/**
 * Personalized Pricing - Personaliserad prissättning
 */
export interface CustomerProfile {
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum'
  totalPurchases: number
  averageOrderValue: number
  lastPurchaseDays: number
}

export function calculatePersonalizedPrice(
  basePrice: number,
  profile: CustomerProfile
): { price: number; discount: number } {
  let discountPercentage = 0

  // Lojalitetsrabatt
  switch (profile.loyaltyTier) {
    case 'platinum':
      discountPercentage += 15
      break
    case 'gold':
      discountPercentage += 10
      break
    case 'silver':
      discountPercentage += 5
      break
    case 'bronze':
      discountPercentage += 2
      break
  }

  // Win-back rabatt för inaktiva kunder
  if (profile.lastPurchaseDays > 90) {
    discountPercentage += 10
  } else if (profile.lastPurchaseDays > 60) {
    discountPercentage += 5
  }

  // VIP-rabatt för högvärdes kunder
  if (profile.totalPurchases > 50000) {
    discountPercentage += 5
  }

  const discount = Math.round((basePrice * discountPercentage) / 100)
  const price = basePrice - discount

  return { price, discount }
}

/**
 * A/B Testing Price - Pris för A/B-testning
 */
export function getABTestPrice(
  basePrice: number,
  variant: 'A' | 'B' | 'C'
): number {
  switch (variant) {
    case 'A':
      return basePrice // Kontrollpris
    case 'B':
      return Math.round(basePrice * 0.95) // 5% rabatt
    case 'C':
      return Math.round(basePrice * 1.05) // 5% ökning
    default:
      return basePrice
  }
}

/**
 * Price Elasticity - Beräkna priselasticitet
 */
export function calculatePriceElasticity(
  oldPrice: number,
  newPrice: number,
  oldQuantity: number,
  newQuantity: number
): number {
  const priceChange = ((newPrice - oldPrice) / oldPrice) * 100
  const quantityChange = ((newQuantity - oldQuantity) / oldQuantity) * 100

  if (priceChange === 0) return 0

  return quantityChange / priceChange
}

/**
 * Optimal Price Point - Hitta optimalt prispunkt
 */
export function findOptimalPrice(
  basePrice: number,
  elasticity: number,
  targetMargin: number = 0.3
): number {
  // Förenklad optimering baserat på elasticitet
  // Elasticitet < -1: Elastisk efterfrågan (sänk priset)
  // Elasticitet > -1: Oelastisk efterfrågan (höj priset)

  let optimalPrice = basePrice

  if (elasticity < -1) {
    // Elastisk: Sänk priset för att öka volym
    optimalPrice = basePrice * 0.9
  } else if (elasticity > -0.5) {
    // Oelastisk: Höj priset för att öka marginal
    optimalPrice = basePrice * 1.1
  }

  // Se till att marginalen uppfylls
  const minPrice = basePrice * (1 - targetMargin)
  optimalPrice = Math.max(optimalPrice, minPrice)

  return Math.round(optimalPrice)
}
