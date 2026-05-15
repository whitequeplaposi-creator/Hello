import { Product } from '../types'

/**
 * Fuzzy Search - Fuzzy matching för produktsökning
 */
export function fuzzySearch(query: string, text: string): number {
  const queryLower = query.toLowerCase()
  const textLower = text.toLowerCase()

  // Exakt match
  if (textLower === queryLower) return 100

  // Innehåller hela sökningen
  if (textLower.includes(queryLower)) return 80

  // Levenshtein distance för fuzzy matching
  const distance = levenshteinDistance(queryLower, textLower)
  const maxLength = Math.max(queryLower.length, textLower.length)
  const similarity = 1 - distance / maxLength

  // Endast returnera poäng om likheten är över en viss tröskel
  const score = Math.round(similarity * 60)
  
  // Tröskel: endast returnera poäng om likheten är minst 30% och avståndet är rimligt
  if (score >= 18 && distance <= Math.max(queryLower.length, textLower.length) * 0.7) {
    return score
  }

  return 0
}

/**
 * Levenshtein Distance - Beräkna redigeringsavstånd
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        )
      }
    }
  }

  return matrix[str2.length][str1.length]
}

/**
 * Advanced Product Search - Avancerad produktsökning
 * Visar ALLA produkter som matchar sökningen, inte bara de med hög relevanspoäng
 */
export interface SearchOptions {
  query: string
  category?: string
  minPrice?: number
  maxPrice?: number
  colors?: string[]
  sizes?: string[]
  inStock?: boolean
  sortBy?: 'relevance' | 'price-asc' | 'price-desc' | 'name'
}

export function advancedSearch(
  products: Product[],
  options: SearchOptions
): Product[] {
  let results = products

  // Filtrera på kategori
  if (options.category) {
    results = results.filter(p => p.category === options.category)
  }

  // Filtrera på pris
  if (options.minPrice !== undefined) {
    results = results.filter(p => p.price >= options.minPrice!)
  }
  if (options.maxPrice !== undefined) {
    results = results.filter(p => p.price <= options.maxPrice!)
  }

  // Filtrera på färg
  if (options.colors && options.colors.length > 0) {
    results = results.filter(p =>
      p.colors?.some(c => options.colors!.includes(c))
    )
  }

  // Filtrera på storlek
  if (options.sizes && options.sizes.length > 0) {
    results = results.filter(p =>
      p.sizes?.some(s => options.sizes!.includes(s))
    )
  }

  // Filtrera på lagerstatus
  if (options.inStock !== undefined) {
    results = results.filter(p => p.inStock === options.inStock)
  }

  // Sök i text
  if (options.query) {
    results = results.map(p => ({
      product: p,
      score: calculateSearchScore(p, options.query)
    }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(r => r.product)
  }

  // Sortera
  results = sortProducts(results, options.sortBy || 'relevance')

  return results
}

function calculateSearchScore(product: Product, query: string): number {
  let score = 0
  const queryLower = query.toLowerCase()

  // Sök i namn (högsta prioritet)
  const nameScore = fuzzySearch(query, product.name)
  score += nameScore * 2

  // Sök i beskrivning (medelhög prioritet)
  const descScore = fuzzySearch(query, product.description)
  score += descScore

  // Sök i kategori (lägre prioritet)
  const catScore = fuzzySearch(query, product.category)
  score += catScore * 0.5

  // Enkel matchning endast om ingen fuzzy match hittades
  if (score === 0) {
    // Ge minimal poäng för enkla matchningar som fuzzySearch missar
    if (product.name.toLowerCase().includes(queryLower)) {
      score = 10
    } else if (product.description.toLowerCase().includes(queryLower)) {
      score = 5
    } else if (product.category.toLowerCase().includes(queryLower)) {
      score = 3
    }
  }

  return score
}

function sortProducts(products: Product[], sortBy: string): Product[] {
  switch (sortBy) {
    case 'price-asc':
      return [...products].sort((a, b) => a.price - b.price)
    case 'price-desc':
      return [...products].sort((a, b) => b.price - a.price)
    case 'name':
      return [...products].sort((a, b) => a.name.localeCompare(b.name))
    case 'relevance':
    default:
      return products
  }
}

/**
 * Auto-Complete - Automatisk komplettering
 */
export function getAutoCompleteSuggestions(
  query: string,
  products: Product[],
  limit: number = 5
): string[] {
  if (query.length < 2) return []

  const suggestions = new Set<string>()
  const queryLower = query.toLowerCase()

  products.forEach(product => {
    // Produktnamn
    if (product.name.toLowerCase().includes(queryLower)) {
      suggestions.add(product.name)
    }

    // Kategori
    if (product.category.toLowerCase().includes(queryLower)) {
      suggestions.add(product.category)
    }

    // Beskrivning (ord)
    const words = product.description.toLowerCase().split(' ')
    words.forEach(word => {
      if (word.startsWith(queryLower) && word.length > 3) {
        suggestions.add(word)
      }
    })
  })

  return Array.from(suggestions).slice(0, limit)
}

/**
 * Search Query Expansion - Expandera sökfrågor
 */
export function expandSearchQuery(query: string): string[] {
  const expansions = [query]
  const synonyms: Record<string, string[]> = {
    'skjorta': ['shirt', 'blus', 'topp'],
    'byxor': ['pants', 'jeans', 'chinos'],
    'skor': ['shoes', 'sneakers', 'kängor'],
    'väska': ['bag', 'handväska', 'ryggsäck'],
    'klocka': ['watch', 'armbandsur'],
    'smycke': ['jewelry', 'halsband', 'ring'],
    'jacka': ['jacket', 'kappa', 'ytterplagg'],
  }

  const queryLower = query.toLowerCase()
  Object.entries(synonyms).forEach(([key, values]) => {
    if (queryLower.includes(key)) {
      values.forEach(synonym => {
        expansions.push(queryLower.replace(key, synonym))
      })
    }
  })

  return expansions
}

/**
 * Spell Correction - Stavningskorrigering
 */
export function suggestSpellCorrection(
  query: string,
  products: Product[]
): string | null {
  const allWords = new Set<string>()

  products.forEach(p => {
    p.name.toLowerCase().split(' ').forEach(w => allWords.add(w))
    p.description.toLowerCase().split(' ').forEach(w => allWords.add(w))
    allWords.add(p.category.toLowerCase())
  })

  const queryWords = query.toLowerCase().split(' ')
  const corrections: string[] = []

  queryWords.forEach(word => {
    if (word.length < 3) {
      corrections.push(word)
      return
    }

    let bestMatch = word
    let bestDistance = Infinity

    allWords.forEach(dictWord => {
      if (Math.abs(dictWord.length - word.length) > 2) return

      const distance = levenshteinDistance(word, dictWord)
      if (distance < bestDistance && distance <= 2) {
        bestDistance = distance
        bestMatch = dictWord
      }
    })

    corrections.push(bestMatch)
  })

  const correctedQuery = corrections.join(' ')
  return correctedQuery !== query.toLowerCase() ? correctedQuery : null
}

/**
 * Search Analytics - Sökanalys
 */
export interface SearchAnalytics {
  query: string
  resultCount: number
  timestamp: Date
  clickedProducts: string[]
}

export function analyzeSearchPerformance(
  analytics: SearchAnalytics[]
): {
  topQueries: Array<{ query: string; count: number }>
  zeroResultQueries: string[]
  avgResultCount: number
  clickThroughRate: number
} {
  const queryCounts = new Map<string, number>()
  const zeroResults = new Set<string>()
  let totalResults = 0
  let totalClicks = 0

  analytics.forEach(a => {
    queryCounts.set(a.query, (queryCounts.get(a.query) || 0) + 1)
    
    if (a.resultCount === 0) {
      zeroResults.add(a.query)
    }
    
    totalResults += a.resultCount
    totalClicks += a.clickedProducts.length
  })

  const topQueries = Array.from(queryCounts.entries())
    .map(([query, count]) => ({ query, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  const avgResultCount = analytics.length > 0 ? totalResults / analytics.length : 0
  const clickThroughRate = totalResults > 0 ? (totalClicks / totalResults) * 100 : 0

  return {
    topQueries,
    zeroResultQueries: Array.from(zeroResults),
    avgResultCount,
    clickThroughRate
  }
}

/**
 * Faceted Search - Fasetterad sökning
 */
export interface SearchFacets {
  categories: Map<string, number>
  priceRanges: Map<string, number>
  colors: Map<string, number>
  sizes: Map<string, number>
}

export function generateSearchFacets(products: Product[]): SearchFacets {
  const categories = new Map<string, number>()
  const priceRanges = new Map<string, number>()
  const colors = new Map<string, number>()
  const sizes = new Map<string, number>()

  products.forEach(p => {
    // Kategorier
    categories.set(p.category, (categories.get(p.category) || 0) + 1)

    // Prisintervall
    const priceRange = getPriceRange(p.price)
    priceRanges.set(priceRange, (priceRanges.get(priceRange) || 0) + 1)

    // Färger
    p.colors?.forEach(color => {
      colors.set(color, (colors.get(color) || 0) + 1)
    })

    // Storlekar
    p.sizes?.forEach(size => {
      sizes.set(size, (sizes.get(size) || 0) + 1)
    })
  })

  return { categories, priceRanges, colors, sizes }
}

function getPriceRange(price: number): string {
  if (price < 200) return '0-199 USD'
  if (price < 500) return '200-499 USD'
  if (price < 1000) return '500-999 USD'
  if (price < 2000) return '1000-1999 USD'
  return '2000+ USD'
}

/**
 * Semantic Search - Semantisk sökning
 */
export function semanticSearch(
  query: string,
  products: Product[]
): Product[] {
  // Expandera sökningen med synonymer
  const expandedQueries = expandSearchQuery(query)

  // Sök med alla expanderade queries
  const results = new Map<string, number>()

  expandedQueries.forEach((q, index) => {
    const weight = 1 / (index + 1) // Första query viktigast

    products.forEach(p => {
      const score = calculateSearchScore(p, q) * weight
      const currentScore = results.get(p.id) || 0
      results.set(p.id, currentScore + score)
    })
  })

  // Sortera och returnera
  return products
    .filter(p => (results.get(p.id) || 0) > 0)
    .sort((a, b) => (results.get(b.id) || 0) - (results.get(a.id) || 0))
}
