'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface FavoritesContextType {
  favoriteIds: string[]
  addFavorite: (productId: string) => void
  removeFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

const FAVORITES_STORAGE_KEY = 'user_favorites'

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)
    if (stored) {
      try {
        setFavoriteIds(JSON.parse(stored))
      } catch (error) {
        console.error('Error loading favorites:', error)
      }
    }
  }, [])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds))
  }, [favoriteIds])

  // Listen for storage events to sync across tabs/pages
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === FAVORITES_STORAGE_KEY && e.newValue) {
        try {
          const newFavorites = JSON.parse(e.newValue)
          setFavoriteIds(newFavorites)
        } catch (error) {
          console.error('Error syncing favorites from storage:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const addFavorite = (productId: string) => {
    setFavoriteIds(prev => {
      // Check if already exists
      if (prev.includes(productId)) {
        return prev
      }
      return [...prev, productId]
    })
  }

  const removeFavorite = (productId: string) => {
    setFavoriteIds(prev => prev.filter(id => id !== productId))
  }

  const isFavorite = (productId: string) => {
    return favoriteIds.includes(productId)
  }

  return (
    <FavoritesContext.Provider value={{ favoriteIds, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
