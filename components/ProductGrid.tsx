'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import ProductCard from './ProductCard'
import { useCategory } from '@/lib/CategoryContext'
import { useSearch } from '@/lib/SearchContext'
import { Product } from '@/lib/types'
import { validateAndDeduplicateProducts, applyDiversityLayer, applyPositionRandomization } from '@/lib/productUtils'
import { useProductInteraction, useProductRefresh } from '@/hooks/useProductInteraction'
import { useTrackProductEvent } from '@/hooks/usePersonalization'
import { useLanguage } from '@/lib/LanguageContext'

const PRODUCTS_PER_PAGE = 70
const INITIAL_PRODUCTS = 70

interface ProductGridProps {
  initialProducts: Product[]
}

export default function ProductGrid({ initialProducts }: ProductGridProps) {
  const { selectedCategory } = useCategory()
  const { searchQuery } = useSearch()
  const { t } = useLanguage()
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [allProducts, setAllProducts] = useState<Product[]>(initialProducts)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const { refreshProducts } = useProductRefresh()
  
  // Ta bort dubbletter från allProducts - memoize to prevent infinite loops
  const [deduplicatedProducts, setDeduplicatedProducts] = useState<Product[]>([])
  
  useEffect(() => {
    const next = validateAndDeduplicateProducts(allProducts)
    setDeduplicatedProducts(next)
  }, [allProducts])
  
  // Hämta sökresultat från API när sökning är aktiv
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim() || searchQuery.trim().length < 2) {
        setSearchResults([])
        setIsSearching(false)
        return
      }

      setIsSearching(true)
      try {
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`)
        const data = await response.json()
        
        if (data.products) {
          setSearchResults(data.products)
        }
      } catch (error) {
        console.error('Error fetching search results:', error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }

    // Debounce search
    const timeoutId = setTimeout(fetchSearchResults, 300)
    return () => clearTimeout(timeoutId)
  }, [searchQuery])
  
  // Funktion för att uppdatera produktlistan från databasen
  const handleProductRefresh = useCallback(async () => {
    if (isRefreshing) return
    
    setIsRefreshing(true)
    const newProducts = await refreshProducts()
    
    if (newProducts && newProducts.length > 0) {
      setAllProducts(newProducts)
      // Återställ till första sidan med nya produkter
      setPage(2)
      setClickCount(0) // Återställ klickräknaren
    }
    
    setIsRefreshing(false)
  }, [refreshProducts, isRefreshing])
  
  // Hook för att spåra produktinteraktioner
  const handleInteraction = useCallback(() => {
    const newCount = clickCount + 1
    setClickCount(newCount)
    
    // Uppdatera automatiskt efter var 10:e klick
    if (newCount >= 10) {
      handleProductRefresh()
    }
  }, [clickCount, handleProductRefresh])
  
  const { trackInteraction } = useProductInteraction()
  const { trackEvent } = useTrackProductEvent()
  
  // Filter products based on search query and category
  const filteredProducts = useMemo(() => {
    // Om sökning är aktiv, använd sökresultat från API
    if (searchQuery.trim() && searchQuery.trim().length >= 2) {
      return searchResults
    }

    let filtered = deduplicatedProducts
    
    // Apply category filter
    if (selectedCategory && selectedCategory !== 'All') {
      // Category keywords for filtering
      const categoryKeywords: Record<string, string[]> = {
        'Men': ['herr', 'män', 'man', 'men', 'mens', 'herrmode', 'herrkläder'],
        'Women': ['dam', 'kvinna', 'kvinnor', 'women', 'womens', 'dammode', 'damkläder', 'ladies'],
        'Sweater': ['sweater', 'tröja', 'pullover', 'hoodie', 'sweatshirt'],
        'Jacket': ['jacket', 'jacka', 'coat', 'rock', 'blazer', 'cardigan'],
        'Dress': ['dress', 'klänning', 'gown', 'maxi'],
        'T-shirt': ['t-shirt', 'tshirt', 't shirt', 'skjorta', 'tee'],
        'Trousers': ['trousers', 'pants', 'byxa', 'jeans', 'leggings', 'shorts'],
        'Belt': ['belt', 'bälte', 'waist belt'],
        'Shoes': ['shoes', 'skor', 'sneakers', 'boots', 'sandals', 'heels', 'loafers'],
      }
      
      const keywords = categoryKeywords[selectedCategory]
      if (keywords) {
        filtered = filtered.filter(p => {
          const nameLower = p.name.toLowerCase()
          return keywords.some(keyword => nameLower.includes(keyword))
        })
      }
    }

    // Post-Ranking Diversity Layer: blanda kategorier så att liknande
    // produkter inte visas efter varandra. Aktiveras ENDAST på startsidan
    // (dvs. när ingen sökning eller kategorifilter är aktivt).
    const diversified = applyDiversityLayer(filtered)

    // Position Randomization: slumpar om positioner inom block för att
    // startsidan ska kännas dynamisk mellan sessioner.
    // Aktiveras BARA när varken sökning eller kategorifilter är aktivt —
    // filtrerade/sökta vyer ska förbli deterministiska.
    if (!selectedCategory || selectedCategory === 'All') {
      return applyPositionRandomization(diversified)
    }
    return diversified
  }, [searchQuery, searchResults, selectedCategory, deduplicatedProducts])
  
  // Load more products manually
  const loadMoreProducts = () => {
    if (loading) return
    
    setLoading(true)
    const totalProducts = filteredProducts.length
    const endIndex = Math.min(page * PRODUCTS_PER_PAGE, totalProducts)
    
    // Simulate loading delay
    setTimeout(() => {
      setVisibleProducts(filteredProducts.slice(0, endIndex))
      setPage(prev => prev + 1)
      setLoading(false)
    }, 300)
  }
  
  // Initial load - recalculate when dependencies change
  useEffect(() => {
    setVisibleProducts(filteredProducts.slice(0, INITIAL_PRODUCTS))
    setPage(2) // Start from page 2 since we already loaded initial products
  }, [filteredProducts])
  
  // Check if all products are loaded
  const allProductsLoaded = visibleProducts.length >= filteredProducts.length
  
  return (
    <>
      {/* Refresh indicator */}
      {isRefreshing && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-600 mr-2"></div>
          <span className="text-blue-700 font-medium">{t('gridRefreshingProducts')}</span>
        </div>
      )}
      
      {/* Search loading indicator */}
      {isSearching && (
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-600 mr-2"></div>
          <span className="text-gray-700 font-medium">Söker...</span>
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {visibleProducts.map((product, index) => (
          <ProductCard 
            key={product.id} 
            product={product}
            priority={index < 12}
            onInteraction={() => {
              trackInteraction(product.id, 'click')
              trackEvent(product, 'click')
              handleInteraction()
            }}
          />
        ))}
      </div>
      
      {/* "Load more" button */}
      {!allProductsLoaded && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMoreProducts}
            disabled={loading}
            className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                {t('gridLoading')}
              </>
            ) : (
              t('gridLoadMore')
            )}
          </button>
        </div>
      )}
    </>
  )
}
