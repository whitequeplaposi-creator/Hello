'use client'

import { useMemo } from 'react'
import { useSearch } from '@/lib/SearchContext'
import type { Product } from '@/lib/types'

interface InlineSearchResultsProps {
  products: Product[]
}

export default function InlineSearchResults({ products }: InlineSearchResultsProps) {
  const { searchQuery } = useSearch()

  // Kontrollera om sökning är aktiv
  const isSearchActive = searchQuery.trim().length >= 2

  // Räkna antal resultat
  const resultCount = useMemo(() => {
    if (!isSearchActive) return 0
    
    const q = searchQuery.toLowerCase().trim()
    const words = q.split(/\s+/).filter(w => w.length > 1)

    return products.filter(p => {
      const name = p.name.toLowerCase()
      const category = p.category.toLowerCase()
      const description = p.description.toLowerCase()
      
      // Alla sökord måste matcha någonstans
      return words.every(word =>
        name.includes(word) || 
        category.includes(word) || 
        description.includes(word)
      )
    }).length
  }, [searchQuery, products, isSearchActive])

  if (!isSearchActive) return null

  return null // InlineSearchResults visar inte längre produkter, endast ProductGrid gör det
}
