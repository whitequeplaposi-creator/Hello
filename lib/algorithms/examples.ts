/**
 * Exempel på hur man använder algoritmerna i praktiken
 */

import { Product, CartItem } from '../types'
import {
  getCollaborativeRecommendations,
  getContentBasedRecommendations,
  getCartBasedRecommendations,
  getTrendingProducts,
  calculateDynamicPrice,
  calculateBundlePrice,
  calculateVolumeDiscount,
  calculatePersonalizedPrice,
  advancedSearch,
  fuzzySearch,
  getAutoCompleteSuggestions,
  calculateRFMScore,
  predictChurn,
  analyzeConversionFunnel,
  calculateReorderPoint,
  generateStockAlerts,
  identifyDeadStock
} from './index'

/**
 * Exempel 1: Produktsida med smarta rekommendationer
 */
export function getProductPageRecommendations(
  currentProduct: Product,
  allProducts: Product[],
  userHistory: Product[]
) {
  // Liknande produkter (collaborative filtering)
  const similarProducts = getCollaborativeRecommendations(
    currentProduct,
    allProducts,
    6
  )

  // Personaliserade rekommendationer baserat på historik
  const personalizedProducts = userHistory.length > 0
    ? getContentBasedRecommendations(userHistory, allProducts, 6)
    : getTrendingProducts(allProducts, 6)

  return {
    similar: similarProducts,
    personalized: personalizedProducts
  }
}

/**
 * Exempel 2: Dynamisk prissättning för produkter
 */
export function getDynamicProductPrice(
  product: Product,
  context: {
    currentInventory: number
    recentViews: number
    recentPurchases: number
    isHighSeason: boolean
  }
) {
  const basePrice = product.price

  // Beräkna efterfrågan baserat på visningar och köp
  const demand = Math.min(1, (context.recentPurchases / context.recentViews) * 2)

  // Säsongsfaktor
  const seasonality = context.isHighSeason ? 0.9 : 0.5

  // Beräkna dynamiskt pris
  const dynamicPrice = calculateDynamicPrice(basePrice, {
    demand,
    inventory: context.currentInventory,
    seasonality,
    competition: 0.7,
    timeOfDay: new Date().getHours()
  })

  return {
    originalPrice: basePrice,
    currentPrice: dynamicPrice,
    discount: basePrice - dynamicPrice,
    discountPercentage: Math.round(((basePrice - dynamicPrice) / basePrice) * 100)
  }
}

/**
 * Exempel 3: Smart varukorg med rekommendationer och rabatter
 */
export function getSmartCartData(
  cartItems: CartItem[],
  allProducts: Product[],
  customerProfile?: {
    loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum'
    totalPurchases: number
    averageOrderValue: number
    lastPurchaseDays: number
  }
) {
  // Rekommendationer baserat på varukorg
  const recommendations = getCartBasedRecommendations(
    cartItems,
    allProducts,
    6
  )

  // Beräkna totalt pris
  let subtotal = 0
  const itemsWithDiscounts = cartItems.map(item => {
    const { totalPrice, discount, discountPercentage } = calculateVolumeDiscount(
      item.product.price,
      item.quantity
    )
    subtotal += totalPrice
    return {
      ...item,
      totalPrice,
      discount,
      discountPercentage
    }
  })

  // Personaliserad rabatt för lojala kunder
  let loyaltyDiscount = 0
  if (customerProfile) {
    const { discount } = calculatePersonalizedPrice(subtotal, customerProfile)
    loyaltyDiscount = discount
  }

  const total = subtotal - loyaltyDiscount

  return {
    items: itemsWithDiscounts,
    subtotal,
    loyaltyDiscount,
    total,
    recommendations
  }
}

/**
 * Exempel 4: Intelligent sökning med auto-complete och korrigering
 */
export function performIntelligentSearch(
  query: string,
  products: Product[],
  filters?: {
    category?: string
    minPrice?: number
    maxPrice?: number
    inStock?: boolean
  }
) {
  // Auto-complete förslag
  const suggestions = getAutoCompleteSuggestions(query, products, 5)

  // Utför sökning
  const results = advancedSearch(products, {
    query,
    ...filters,
    sortBy: 'relevance'
  })

  // Beräkna relevans-score för varje resultat
  const resultsWithScores = results.map(product => ({
    product,
    relevanceScore: fuzzySearch(query, product.name)
  }))

  return {
    query,
    suggestions,
    results: resultsWithScores,
    totalResults: results.length
  }
}

/**
 * Exempel 5: Kundanalys och segmentering
 */
export function analyzeCustomerBase(
  customers: Array<{
    customerId: string
    lastPurchaseDate: Date
    totalPurchases: number
    totalSpent: number
    daysSinceLastPurchase: number
    avgDaysBetweenPurchases: number
  }>
) {
  // RFM-segmentering
  const rfmSegments = calculateRFMScore(customers)

  // Churn-förutsägelse
  const churnPredictions = predictChurn(customers)

  // Identifiera högrisk-kunder
  const highRiskCustomers = churnPredictions.filter(
    p => p.riskLevel === 'high'
  )

  // Identifiera champions
  const champions = rfmSegments.filter(
    s => s.segment === 'Champions'
  )

  return {
    segments: rfmSegments,
    churnPredictions,
    highRiskCustomers,
    champions,
    insights: {
      totalCustomers: customers.length,
      championsCount: champions.length,
      highRiskCount: highRiskCustomers.length,
      avgChurnProbability: churnPredictions.reduce((sum, p) => sum + p.churnProbability, 0) / churnPredictions.length
    }
  }
}

/**
 * Exempel 6: Konverteringsanalys
 */
export function analyzeConversionPerformance(
  metrics: {
    visitors: number
    productViews: number
    addToCarts: number
    checkouts: number
    purchases: number
    cartsCreated: number
    avgCartValue: number
  }
) {
  // Konverteringstratt
  const funnel = analyzeConversionFunnel(
    metrics.visitors,
    metrics.productViews,
    metrics.addToCarts,
    metrics.checkouts,
    metrics.purchases
  )

  // Identifiera största dropoff
  const maxDropoff = funnel.reduce((max, stage) => 
    stage.dropoffRate > max.dropoffRate ? stage : max
  )

  // Beräkna övergripande konvertering
  const overallConversion = (metrics.purchases / metrics.visitors) * 100

  return {
    funnel,
    overallConversion,
    criticalStage: maxDropoff.stage,
    maxDropoffRate: maxDropoff.dropoffRate,
    recommendations: generateConversionRecommendations(maxDropoff)
  }
}

function generateConversionRecommendations(stage: { stage: string; dropoffRate: number }) {
  const recommendations: string[] = []

  if (stage.stage === 'Produktvisning' && stage.dropoffRate > 50) {
    recommendations.push('Förbättra produktbilder och beskrivningar')
    recommendations.push('Lägg till kundrecensioner')
  } else if (stage.stage === 'Lägg i varukorg' && stage.dropoffRate > 40) {
    recommendations.push('Tydligare call-to-action knappar')
    recommendations.push('Visa fraktinformation tidigare')
  } else if (stage.stage === 'Kassa' && stage.dropoffRate > 30) {
    recommendations.push('Förenkla kassaprocessen')
    recommendations.push('Erbjud fler betalningsalternativ')
    recommendations.push('Visa säkerhetsgarantier')
  }

  return recommendations
}

/**
 * Exempel 7: Lagerhantering och varningar
 */
export function manageinventory(
  inventory: Array<{
    productId: string
    currentStock: number
    dailyDemand: number
    leadTimeDays: number
    safetyStock: number
    daysInStock: number
    unitCost: number
    lastSaleDate?: Date
  }>
) {
  // Beräkna reorder points
  const withReorderPoints = inventory.map(item => ({
    ...item,
    reorderPoint: calculateReorderPoint(
      item.dailyDemand,
      item.leadTimeDays,
      item.safetyStock
    ),
    maxStock: Math.ceil(item.dailyDemand * item.leadTimeDays * 2),
    minStock: item.safetyStock
  }))

  // Generera varningar
  const alerts = generateStockAlerts(withReorderPoints)

  // Identifiera död lager
  const deadStock = identifyDeadStock(inventory.map(item => ({ ...item, quantity: item.currentStock })))

  // Beräkna totalt lagervärde
  const totalInventoryValue = inventory.reduce(
    (sum, item) => sum + (item.currentStock * item.unitCost),
    0
  )

  // Beräkna värde av död lager
  const deadStockValue = deadStock.reduce(
    (sum, item) => sum + item.value,
    0
  )

  return {
    alerts,
    deadStock,
    metrics: {
      totalInventoryValue,
      deadStockValue,
      deadStockPercentage: (deadStockValue / totalInventoryValue) * 100,
      criticalAlerts: alerts.filter(a => a.priority === 'high').length
    },
    recommendations: generateInventoryRecommendations(alerts, deadStock)
  }
}

function generateInventoryRecommendations(
  alerts: any[],
  deadStock: any[]
): string[] {
  const recommendations: string[] = []

  const outOfStock = alerts.filter(a => a.type === 'out').length
  const lowStock = alerts.filter(a => a.type === 'low').length
  const overstock = alerts.filter(a => a.type === 'overstock').length

  if (outOfStock > 0) {
    recommendations.push(`${outOfStock} produkter är slut i lager - beställ omedelbart`)
  }

  if (lowStock > 5) {
    recommendations.push(`${lowStock} produkter har lågt lager - planera påfyllning`)
  }

  if (overstock > 10) {
    recommendations.push(`${overstock} produkter har överlager - överväg kampanj`)
  }

  if (deadStock.length > 0) {
    const clearanceItems = deadStock.filter(d => d.recommendation === 'clearance').length
    if (clearanceItems > 0) {
      recommendations.push(`${clearanceItems} produkter bör säljas ut med rabatt`)
    }
  }

  return recommendations
}

/**
 * Exempel 8: Paketpriser och kampanjer
 */
export function createProductBundle(
  products: Product[],
  bundleType: 'fixed-discount' | 'tiered' | 'bogo'
) {
  const totalPrice = products.reduce((sum, p) => sum + p.price, 0)

  switch (bundleType) {
    case 'fixed-discount':
      // Fast rabatt på paketet
      const bundlePrice = calculateBundlePrice(products, 15)
      return {
        products,
        originalPrice: totalPrice,
        bundlePrice,
        savings: totalPrice - bundlePrice,
        savingsPercentage: 15
      }

    case 'tiered':
      // Trappstegsrabatt
      let discount = 10
      if (products.length >= 5) discount = 20
      else if (products.length >= 3) discount = 15

      const tieredPrice = calculateBundlePrice(products, discount)
      return {
        products,
        originalPrice: totalPrice,
        bundlePrice: tieredPrice,
        savings: totalPrice - tieredPrice,
        savingsPercentage: discount
      }

    case 'bogo':
      // Köp X få Y gratis
      const sortedByPrice = [...products].sort((a, b) => b.price - a.price)
      const freeItems = Math.floor(products.length / 2)
      const freeValue = sortedByPrice
        .slice(-freeItems)
        .reduce((sum, p) => sum + p.price, 0)

      return {
        products,
        originalPrice: totalPrice,
        bundlePrice: totalPrice - freeValue,
        savings: freeValue,
        freeItems
      }

    default:
      return {
        products,
        originalPrice: totalPrice,
        bundlePrice: totalPrice,
        savings: 0,
        savingsPercentage: 0
      }
  }
}
