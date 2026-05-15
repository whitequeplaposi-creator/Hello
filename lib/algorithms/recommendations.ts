import { Product, CartItem } from '../types'

/**
 * Collaborative Filtering - Rekommendationer baserat på liknande produkter
 */
export function getCollaborativeRecommendations(
  product: Product,
  allProducts: Product[],
  limit: number = 6
): Product[] {
  const scores = allProducts
    .filter(p => p.id !== product.id && p.inStock)
    .map(p => ({
      product: p,
      score: calculateSimilarityScore(product, p)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  return scores.map(s => s.product)
}

/**
 * Beräkna likhetsscore mellan två produkter
 */
function calculateSimilarityScore(product1: Product, product2: Product): number {
  let score = 0

  // Samma kategori ger högt score
  if (product1.category === product2.category) {
    score += 50
  }

  // Liknande pris ger poäng
  const priceDiff = Math.abs(product1.price - product2.price)
  const priceScore = Math.max(0, 30 - (priceDiff / 100))
  score += priceScore

  // Gemensamma färger
  if (product1.colors && product2.colors) {
    const commonColors = product1.colors.filter(c => product2.colors?.includes(c))
    score += commonColors.length * 5
  }

  // Gemensamma storlekar
  if (product1.sizes && product2.sizes) {
    const commonSizes = product1.sizes.filter(s => product2.sizes?.includes(s))
    score += commonSizes.length * 3
  }

  return score
}

/**
 * Content-Based Filtering - Rekommendationer baserat på användarens historik
 */
export function getContentBasedRecommendations(
  userHistory: Product[],
  allProducts: Product[],
  limit: number = 6
): Product[] {
  if (userHistory.length === 0) {
    return getPopularProducts(allProducts, limit)
  }

  // Analysera användarens preferenser
  const preferences = analyzeUserPreferences(userHistory)

  const scores = allProducts
    .filter(p => !userHistory.some(h => h.id === p.id) && p.inStock)
    .map(p => ({
      product: p,
      score: calculatePreferenceScore(p, preferences)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  return scores.map(s => s.product)
}

interface UserPreferences {
  categories: Map<string, number>
  priceRange: { min: number; max: number; avg: number }
  colors: Map<string, number>
  sizes: Map<string, number>
}

function analyzeUserPreferences(history: Product[]): UserPreferences {
  const categories = new Map<string, number>()
  const colors = new Map<string, number>()
  const sizes = new Map<string, number>()
  let totalPrice = 0

  history.forEach(product => {
    // Räkna kategorier
    categories.set(product.category, (categories.get(product.category) || 0) + 1)

    // Räkna färger
    product.colors?.forEach(color => {
      colors.set(color, (colors.get(color) || 0) + 1)
    })

    // Räkna storlekar
    product.sizes?.forEach(size => {
      sizes.set(size, (sizes.get(size) || 0) + 1)
    })

    totalPrice += product.price
  })

  const prices = history.map(p => p.price)
  const priceRange = {
    min: Math.min(...prices),
    max: Math.max(...prices),
    avg: totalPrice / history.length
  }

  return { categories, priceRange, colors, sizes }
}

function calculatePreferenceScore(product: Product, preferences: UserPreferences): number {
  let score = 0

  // Kategori-preferens
  const categoryCount = preferences.categories.get(product.category) || 0
  score += categoryCount * 30

  // Pris-preferens (produkter nära användarens genomsnittspris)
  const priceDiff = Math.abs(product.price - preferences.priceRange.avg)
  const priceScore = Math.max(0, 40 - (priceDiff / 50))
  score += priceScore

  // Färg-preferens
  if (product.colors) {
    product.colors.forEach(color => {
      const colorCount = preferences.colors.get(color) || 0
      score += colorCount * 5
    })
  }

  // Storlek-preferens
  if (product.sizes) {
    product.sizes.forEach(size => {
      const sizeCount = preferences.sizes.get(size) || 0
      score += sizeCount * 3
    })
  }

  return score
}

/**
 * Frequently Bought Together - Produkter som ofta köps tillsammans
 */
export function getFrequentlyBoughtTogether(
  product: Product,
  allProducts: Product[],
  limit: number = 3
): Product[] {
  // I en riktig implementation skulle detta baseras på faktisk köpdata
  // Här använder vi en heuristisk baserad på kategori och pris
  
  const complementaryCategories = getComplementaryCategories(product.category)
  
  const recommendations = allProducts
    .filter(p => 
      p.id !== product.id && 
      p.inStock &&
      complementaryCategories.includes(p.category) &&
      p.price <= product.price * 0.7 // Kompletterande produkter är ofta billigare
    )
    .sort((a, b) => {
      // Prioritera produkter med liknande pris
      const aDiff = Math.abs(a.price - product.price * 0.3)
      const bDiff = Math.abs(b.price - product.price * 0.3)
      return aDiff - bDiff
    })
    .slice(0, limit)

  return recommendations
}

function getComplementaryCategories(category: string): string[] {
  const complementaryMap: Record<string, string[]> = {
    'Men': ['Shoes', 'Accessories', 'Bags', 'Underwear'],
    'Women': ['Shoes', 'Accessories', 'Bags', 'Jewelry', 'Underwear'],
    'Children': ['Shoes', 'Accessories', 'Bags'],
    'Shoes': ['Accessories', 'Underwear'],
    'Accessories': ['Bags', 'Jewelry'],
    'Bags': ['Accessories', 'Jewelry'],
    'Jewelry': ['Accessories', 'Bags'],
    'Sports & Leisure': ['Shoes', 'Accessories'],
    'Outerwear': ['Accessories', 'Shoes', 'Underwear'],
    'Swimwear': ['Accessories', 'Shoes'],
  }

  return complementaryMap[category] || []
}

/**
 * Trending Products - Trendande produkter baserat på popularitet
 */
export function getTrendingProducts(
  allProducts: Product[],
  limit: number = 10
): Product[] {
  // I en riktig implementation skulle detta baseras på faktiska visningar/köp
  // Här simulerar vi med en viktad slumpmässig algoritm
  
  return allProducts
    .filter(p => p.inStock)
    .map(p => ({
      product: p,
      trendScore: calculateTrendScore(p)
    }))
    .sort((a, b) => b.trendScore - a.trendScore)
    .slice(0, limit)
    .map(t => t.product)
}

function calculateTrendScore(product: Product): number {
  let score = Math.random() * 50 // Bas-slumpmässighet

  // Nya produkter (New Arrivals) får högre score
  if (product.category === 'New Arrivals') {
    score += 30
  }

  // Rea-produkter får också högre score
  if (product.category === 'Sale') {
    score += 25
  }

  // Produkter i medelprisklass är ofta populärare
  if (product.price >= 300 && product.price <= 1000) {
    score += 20
  }

  return score
}

/**
 * Cart-Based Recommendations - Rekommendationer baserat på varukorg
 */
export function getCartBasedRecommendations(
  cartItems: CartItem[],
  allProducts: Product[],
  limit: number = 6
): Product[] {
  if (cartItems.length === 0) {
    return getTrendingProducts(allProducts, limit)
  }

  const cartProducts = cartItems.map(item => item.product)
  const cartCategories = new Set(cartProducts.map(p => p.category))
  const avgCartPrice = cartProducts.reduce((sum, p) => sum + p.price, 0) / cartProducts.length

  const recommendations = allProducts
    .filter(p => 
      !cartProducts.some(cp => cp.id === p.id) && 
      p.inStock
    )
    .map(p => ({
      product: p,
      score: calculateCartRelevanceScore(p, cartCategories, avgCartPrice)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  return recommendations.map(r => r.product)
}

function calculateCartRelevanceScore(
  product: Product,
  cartCategories: Set<string>,
  avgCartPrice: number
): number {
  let score = 0

  // Samma kategori som något i varukorgen
  if (cartCategories.has(product.category)) {
    score += 30
  }

  // Kompletterande kategori
  const complementary = Array.from(cartCategories).some(cat =>
    getComplementaryCategories(cat).includes(product.category)
  )
  if (complementary) {
    score += 40
  }

  // Liknande pris som genomsnittet i varukorgen
  const priceDiff = Math.abs(product.price - avgCartPrice)
  const priceScore = Math.max(0, 30 - (priceDiff / 100))
  score += priceScore

  return score
}

/**
 * Popular Products - Mest populära produkter
 */
export function getPopularProducts(
  allProducts: Product[],
  limit: number = 10
): Product[] {
  // I en riktig implementation skulle detta baseras på faktisk försäljningsdata
  // Här använder vi en heuristisk baserad på pris och kategori
  
  return allProducts
    .filter(p => p.inStock)
    .sort((a, b) => {
      // Produkter i medelprisklass rankas högre
      const aScore = a.price >= 200 && a.price <= 1000 ? 1 : 0
      const bScore = b.price >= 200 && b.price <= 1000 ? 1 : 0
      return bScore - aScore
    })
    .slice(0, limit)
}

/**
 * Smart Search Ranking - Rankar sökresultat baserat på relevans
 */
export function rankSearchResults(
  query: string,
  products: Product[],
  userHistory?: Product[]
): Product[] {
  const lowerQuery = query.toLowerCase()

  return products
    .map(p => ({
      product: p,
      score: calculateSearchRelevance(p, lowerQuery, userHistory)
    }))
    .sort((a, b) => b.score - a.score)
    .map(r => r.product)
}

function calculateSearchRelevance(
  product: Product,
  query: string,
  userHistory?: Product[]
): number {
  let score = 0

  const name = product.name.toLowerCase()
  const description = product.description.toLowerCase()
  const category = product.category.toLowerCase()

  // Exakt match i namn
  if (name === query) {
    score += 100
  } else if (name.includes(query)) {
    score += 50
  } else if (name.split(' ').some(word => word.startsWith(query))) {
    score += 30
  }

  // Match i beskrivning
  if (description.includes(query)) {
    score += 20
  }

  // Match i kategori
  if (category.includes(query)) {
    score += 15
  }

  // Boost om produkten är i lager
  if (product.inStock) {
    score += 10
  }

  // Boost om användaren tidigare visat intresse för kategorin
  if (userHistory) {
    const hasInterest = userHistory.some(h => h.category === product.category)
    if (hasInterest) {
      score += 25
    }
  }

  return score
}
