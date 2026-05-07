'use client'

import { useState, useEffect, useCallback } from 'react'
import ProductCard from './ProductCard'
import { useCategory } from '@/lib/CategoryContext'
import { useSearch } from '@/lib/SearchContext'
import { Product } from '@/lib/types'

const PRODUCTS_PER_PAGE = 70
const INITIAL_PRODUCTS = 70

interface ProductGridProps {
  initialProducts: Product[]
}

export default function ProductGrid({ initialProducts }: ProductGridProps) {
  const { selectedCategory } = useCategory()
  const { searchQuery } = useSearch()
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  
  // Filter products based on search query only
  const getFilteredProducts = useCallback(() => {
    let filtered = initialProducts
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      )
    }
    
    return filtered
  }, [searchQuery, initialProducts])
  
  // Load more products manually
  const loadMoreProducts = () => {
    if (loading) return
    
    setLoading(true)
    const filteredProducts = getFilteredProducts()
    const totalProducts = filteredProducts.length
    const endIndex = Math.min(page * PRODUCTS_PER_PAGE, totalProducts)
    
    // Simulate loading delay
    setTimeout(() => {
      setVisibleProducts(filteredProducts.slice(0, endIndex))
      setPage(prev => prev + 1)
      setLoading(false)
    }, 300)
  }
  
  // Initial load
  useEffect(() => {
    const filteredProducts = getFilteredProducts()
    setVisibleProducts(filteredProducts.slice(0, INITIAL_PRODUCTS))
    setPage(2) // Start from page 2 since we already loaded initial products
  }, [getFilteredProducts])
  
  // Check if all products are loaded
  const filteredProducts = getFilteredProducts()
  const allProductsLoaded = visibleProducts.length >= filteredProducts.length
  
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {/* "Visa mer" button */}
      {!allProductsLoaded && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMoreProducts}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Laddar...
              </>
            ) : (
              'Visa mer'
            )}
          </button>
        </div>
      )}
      
      {/* Show message when all products are loaded */}
      {allProductsLoaded && visibleProducts.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-gray-500">Alla produkter är visade</p>
        </div>
      )}
    </>
  )
}
