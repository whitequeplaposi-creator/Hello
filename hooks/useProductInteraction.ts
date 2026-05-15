'use client'

import { useCallback, useEffect } from 'react'

/**
 * Hook för att spåra produktinteraktioner och trigga uppdateringar
 */
export function useProductInteraction(onInteraction?: () => void) {
  const trackInteraction = useCallback((productId: string, action: 'view' | 'click') => {
    // Spara interaktion i localStorage för analytics
    const interactions = JSON.parse(localStorage.getItem('product_interactions') || '[]')
    interactions.push({
      productId,
      action,
      timestamp: Date.now()
    })
    
    // Behåll endast de senaste 100 interaktionerna
    if (interactions.length > 100) {
      interactions.shift()
    }
    
    localStorage.setItem('product_interactions', JSON.stringify(interactions))
    
    // Trigga callback för uppdatering
    if (onInteraction) {
      onInteraction()
    }
  }, [onInteraction])

  return { trackInteraction }
}

/**
 * Hook för att hantera produktlistans uppdatering
 */
export function useProductRefresh() {
  const refreshProducts = useCallback(async () => {
    try {
      // Hämta nya produkter från API
      const response = await fetch('/api/products?refresh=true&limit=50', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      
      const data = await response.json()
      return data.products || []
    } catch (error) {
      console.error('Error refreshing products:', error)
      return null
    }
  }, [])

  return { refreshProducts }
}
