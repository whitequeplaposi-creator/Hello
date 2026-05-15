import { Product } from '../types'

/**
 * Inventory Optimization - Lageroptimering
 */

/**
 * Economic Order Quantity (EOQ) - Optimal beställningskvantitet
 */
export function calculateEOQ(
  annualDemand: number,
  orderCost: number,
  holdingCost: number
): number {
  return Math.sqrt((2 * annualDemand * orderCost) / holdingCost)
}

/**
 * Reorder Point - Beställningspunkt
 */
export function calculateReorderPoint(
  dailyDemand: number,
  leadTimeDays: number,
  safetyStock: number = 0
): number {
  return dailyDemand * leadTimeDays + safetyStock
}

/**
 * Safety Stock - Säkerhetslager
 */
export function calculateSafetyStock(
  maxDailyDemand: number,
  avgDailyDemand: number,
  maxLeadTime: number,
  avgLeadTime: number
): number {
  return (maxDailyDemand * maxLeadTime) - (avgDailyDemand * avgLeadTime)
}

/**
 * ABC Analysis - Klassificera produkter efter värde
 */
export interface ABCClassification {
  productId: string
  class: 'A' | 'B' | 'C'
  annualValue: number
  cumulativePercentage: number
}

export function performABCAnalysis(
  products: Array<{ id: string; annualSales: number; unitCost: number }>
): ABCClassification[] {
  // Beräkna årligt värde för varje produkt
  const productsWithValue = products.map(p => ({
    productId: p.id,
    annualValue: p.annualSales * p.unitCost
  }))

  // Sortera efter värde (högst först)
  productsWithValue.sort((a, b) => b.annualValue - a.annualValue)

  // Beräkna totalt värde
  const totalValue = productsWithValue.reduce((sum, p) => sum + p.annualValue, 0)

  // Klassificera
  let cumulativeValue = 0
  return productsWithValue.map(p => {
    cumulativeValue += p.annualValue
    const cumulativePercentage = (cumulativeValue / totalValue) * 100

    let classification: 'A' | 'B' | 'C'
    if (cumulativePercentage <= 80) {
      classification = 'A' // Top 80% av värdet
    } else if (cumulativePercentage <= 95) {
      classification = 'B' // Nästa 15%
    } else {
      classification = 'C' // Sista 5%
    }

    return {
      productId: p.productId,
      class: classification,
      annualValue: p.annualValue,
      cumulativePercentage
    }
  })
}

/**
 * Demand Forecasting - Efterfrågeprognostisering
 */

/**
 * Moving Average - Glidande medelvärde
 */
export function calculateMovingAverage(
  historicalData: number[],
  periods: number = 3
): number {
  if (historicalData.length < periods) {
    return historicalData.reduce((a, b) => a + b, 0) / historicalData.length
  }

  const recentData = historicalData.slice(-periods)
  return recentData.reduce((a, b) => a + b, 0) / periods
}

/**
 * Exponential Smoothing - Exponentiell utjämning
 */
export function exponentialSmoothing(
  historicalData: number[],
  alpha: number = 0.3
): number {
  if (historicalData.length === 0) return 0
  if (historicalData.length === 1) return historicalData[0]

  let forecast = historicalData[0]
  for (let i = 1; i < historicalData.length; i++) {
    forecast = alpha * historicalData[i] + (1 - alpha) * forecast
  }

  return forecast
}

/**
 * Seasonal Adjustment - Säsongsjustering
 */
export function adjustForSeasonality(
  baseDemand: number,
  month: number
): number {
  // Säsongsfaktorer (1 = normal, >1 = hög säsong, <1 = låg säsong)
  const seasonalFactors: Record<number, number> = {
    1: 0.8, // Januari - låg
    2: 0.85, // Februari
    3: 0.95, // Mars
    4: 1.0, // April
    5: 1.1, // Maj
    6: 1.2, // Juni - hög
    7: 1.3, // Juli - högst
    8: 1.2, // Augusti
    9: 1.0, // September
    10: 1.05, // Oktober
    11: 1.15, // November - Black Friday
    12: 1.4, // December - jul
  }

  return baseDemand * (seasonalFactors[month] || 1.0)
}

/**
 * Stock Turnover - Lageromsättning
 */
export function calculateStockTurnover(
  costOfGoodsSold: number,
  averageInventoryValue: number
): number {
  if (averageInventoryValue === 0) return 0
  return costOfGoodsSold / averageInventoryValue
}

/**
 * Days Sales of Inventory (DSI) - Dagar i lager
 */
export function calculateDSI(
  averageInventory: number,
  costOfGoodsSold: number,
  days: number = 365
): number {
  if (costOfGoodsSold === 0) return 0
  return (averageInventory / costOfGoodsSold) * days
}

/**
 * Dead Stock Detection - Identifiera död lager
 */
export interface DeadStockItem {
  productId: string
  daysInStock: number
  quantity: number
  value: number
  recommendation: 'discount' | 'clearance' | 'donate'
}

export function identifyDeadStock(
  inventory: Array<{
    productId: string
    daysInStock: number
    quantity: number
    unitCost: number
    lastSaleDate?: Date
  }>
): DeadStockItem[] {
  const deadStock: DeadStockItem[] = []

  inventory.forEach(item => {
    let recommendation: 'discount' | 'clearance' | 'donate' | null = null

    if (item.daysInStock > 180) {
      recommendation = 'clearance'
    } else if (item.daysInStock > 120) {
      recommendation = 'discount'
    } else if (item.daysInStock > 90 && item.quantity > 50) {
      recommendation = 'discount'
    }

    // Extra check för produkter utan försäljning
    if (item.lastSaleDate) {
      const daysSinceLastSale = Math.floor(
        (Date.now() - item.lastSaleDate.getTime()) / (1000 * 60 * 60 * 24)
      )
      if (daysSinceLastSale > 365) {
        recommendation = 'donate'
      }
    }

    if (recommendation) {
      deadStock.push({
        productId: item.productId,
        daysInStock: item.daysInStock,
        quantity: item.quantity,
        value: item.quantity * item.unitCost,
        recommendation
      })
    }
  })

  return deadStock.sort((a, b) => b.value - a.value)
}

/**
 * Optimal Stock Level - Optimal lagernivå
 */
export function calculateOptimalStockLevel(
  avgDailyDemand: number,
  leadTimeDays: number,
  serviceLevel: number = 0.95 // 95% service level
): {
  reorderPoint: number
  maxStock: number
  minStock: number
} {
  // Z-score för service level (95% = 1.65, 99% = 2.33)
  const zScore = serviceLevel >= 0.99 ? 2.33 : 1.65

  const safetyStock = Math.ceil(zScore * Math.sqrt(leadTimeDays) * avgDailyDemand)
  const reorderPoint = avgDailyDemand * leadTimeDays + safetyStock
  const maxStock = reorderPoint + avgDailyDemand * leadTimeDays
  const minStock = safetyStock

  return {
    reorderPoint: Math.ceil(reorderPoint),
    maxStock: Math.ceil(maxStock),
    minStock: Math.ceil(minStock)
  }
}

/**
 * Inventory Valuation - Lagervärdering
 */

/**
 * FIFO (First In, First Out)
 */
export function calculateFIFO(
  purchases: Array<{ quantity: number; unitCost: number }>,
  soldQuantity: number
): { costOfGoodsSold: number; remainingInventoryValue: number } {
  let remaining = soldQuantity
  let cogs = 0
  let remainingInventory = [...purchases]

  for (let i = 0; i < purchases.length && remaining > 0; i++) {
    const batch = purchases[i]
    const quantityToUse = Math.min(batch.quantity, remaining)
    
    cogs += quantityToUse * batch.unitCost
    remaining -= quantityToUse
    
    remainingInventory[i] = {
      ...batch,
      quantity: batch.quantity - quantityToUse
    }
  }

  const remainingInventoryValue = remainingInventory
    .filter(b => b.quantity > 0)
    .reduce((sum, b) => sum + b.quantity * b.unitCost, 0)

  return { costOfGoodsSold: cogs, remainingInventoryValue }
}

/**
 * LIFO (Last In, First Out)
 */
export function calculateLIFO(
  purchases: Array<{ quantity: number; unitCost: number }>,
  soldQuantity: number
): { costOfGoodsSold: number; remainingInventoryValue: number } {
  let remaining = soldQuantity
  let cogs = 0
  let remainingInventory = [...purchases]

  for (let i = purchases.length - 1; i >= 0 && remaining > 0; i--) {
    const batch = purchases[i]
    const quantityToUse = Math.min(batch.quantity, remaining)
    
    cogs += quantityToUse * batch.unitCost
    remaining -= quantityToUse
    
    remainingInventory[i] = {
      ...batch,
      quantity: batch.quantity - quantityToUse
    }
  }

  const remainingInventoryValue = remainingInventory
    .filter(b => b.quantity > 0)
    .reduce((sum, b) => sum + b.quantity * b.unitCost, 0)

  return { costOfGoodsSold: cogs, remainingInventoryValue }
}

/**
 * Weighted Average Cost
 */
export function calculateWeightedAverage(
  purchases: Array<{ quantity: number; unitCost: number }>,
  soldQuantity: number
): { costOfGoodsSold: number; remainingInventoryValue: number } {
  const totalQuantity = purchases.reduce((sum, p) => sum + p.quantity, 0)
  const totalCost = purchases.reduce((sum, p) => sum + p.quantity * p.unitCost, 0)
  
  const avgCost = totalCost / totalQuantity
  const cogs = soldQuantity * avgCost
  const remainingQuantity = totalQuantity - soldQuantity
  const remainingInventoryValue = remainingQuantity * avgCost

  return { costOfGoodsSold: cogs, remainingInventoryValue }
}

/**
 * Stock Alert System - Lagervarningssystem
 */
export interface StockAlert {
  productId: string
  type: 'low' | 'out' | 'overstock' | 'reorder'
  currentStock: number
  recommendedAction: string
  priority: 'high' | 'medium' | 'low'
}

export function generateStockAlerts(
  inventory: Array<{
    productId: string
    currentStock: number
    reorderPoint: number
    maxStock: number
    minStock: number
  }>
): StockAlert[] {
  const alerts: StockAlert[] = []

  inventory.forEach(item => {
    if (item.currentStock === 0) {
      alerts.push({
        productId: item.productId,
        type: 'out',
        currentStock: item.currentStock,
        recommendedAction: 'Beställ omedelbart',
        priority: 'high'
      })
    } else if (item.currentStock <= item.minStock) {
      alerts.push({
        productId: item.productId,
        type: 'low',
        currentStock: item.currentStock,
        recommendedAction: 'Beställ inom 24 timmar',
        priority: 'high'
      })
    } else if (item.currentStock <= item.reorderPoint) {
      alerts.push({
        productId: item.productId,
        type: 'reorder',
        currentStock: item.currentStock,
        recommendedAction: 'Planera beställning',
        priority: 'medium'
      })
    } else if (item.currentStock >= item.maxStock) {
      alerts.push({
        productId: item.productId,
        type: 'overstock',
        currentStock: item.currentStock,
        recommendedAction: 'Överväg kampanj eller rabatt',
        priority: 'low'
      })
    }
  })

  return alerts.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}
