import { NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/lib/db'

// Cache för sökresultat (i produktion, använd Redis eller liknande)
const searchCache = new Map<string, { products: any[], timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minuter

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ products: [] })
    }

    const queryLower = query.toLowerCase().trim()
    
    // Check cache first
    const cached = searchCache.get(queryLower)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({ 
        products: cached.products,
        count: cached.products.length,
        cached: true
      })
    }

    // Hämta ALLA produkter från databasen
    const allProducts = await getProducts()
    
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 1)
    
    // Filtrera produkter baserat på sökningen - optimerad version
    const filtered = allProducts.filter(p => {
      const name = p.name.toLowerCase()
      const description = p.description.toLowerCase()
      const category = p.category.toLowerCase()
      
      // Snabb kontroll: om namnet innehåller hela sökningen, inkludera direkt
      if (name.includes(queryLower) || category.includes(queryLower)) {
        return true
      }
      
      // Annars kontrollera alla sökord
      return queryWords.every(word => {
        // Kontrollera namn, beskrivning och kategori
        const textMatch = name.includes(word) || 
                         description.includes(word) || 
                         category.includes(word)
        
        // Kontrollera även färger och storlekar om de finns
        const colorMatch = p.colors?.some(color => color.toLowerCase().includes(word)) || false
        const sizeMatch = p.sizes?.some(size => size.toLowerCase().includes(word)) || false
        
        return textMatch || colorMatch || sizeMatch
      })
    })

    // Sortera efter relevans - optimerad version
    filtered.sort((a, b) => {
      const aName = a.name.toLowerCase()
      const bName = b.name.toLowerCase()
      
      // Exakt matchning först
      if (aName === queryLower) return -1
      if (bName === queryLower) return 1
      
      // Börjar med sökningen
      const aStarts = aName.startsWith(queryLower)
      const bStarts = bName.startsWith(queryLower)
      if (aStarts && !bStarts) return -1
      if (bStarts && !aStarts) return 1
      
      // Innehåller sökningen i namnet
      const aInName = aName.includes(queryLower)
      const bInName = bName.includes(queryLower)
      if (aInName && !bInName) return -1
      if (bInName && !aInName) return 1
      
      return 0
    })

    // Cache results
    searchCache.set(queryLower, {
      products: filtered,
      timestamp: Date.now()
    })

    // Clean old cache entries (keep max 50 entries)
    if (searchCache.size > 50) {
      const entries = Array.from(searchCache.entries())
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
      entries.slice(0, entries.length - 50).forEach(([key]) => {
        searchCache.delete(key)
      })
    }

    return NextResponse.json({ 
      products: filtered,
      count: filtered.length,
      cached: false
    })
  } catch (error) {
    console.error('Error searching products:', error)
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    )
  }
}
