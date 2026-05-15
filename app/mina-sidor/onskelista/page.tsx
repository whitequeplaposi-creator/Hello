'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useFavorites } from '@/lib/FavoritesContext'
import { useLanguage } from '@/lib/LanguageContext'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'
import { Product } from '@/lib/types'

export default function Wishlist() {
  const { favoriteIds, removeFavorite } = useFavorites()
  const { t } = useLanguage()
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Handle remove favorite
  const handleRemoveFavorite = (productId: string) => {
    removeFavorite(productId)
  }

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      const idsToFetch = favoriteIds
      console.log('Fetching products for IDs:', idsToFetch)
      
      if (idsToFetch.length === 0) {
        setFavoriteProducts([])
        setLoading(false)
        return
      }

      setLoading(true)
      const products: Product[] = []
      
      for (const id of idsToFetch) {
        try {
          console.log('Fetching product with ID:', id)
          const response = await fetch(`/api/products/${id}`)
          const data = await response.json()
          console.log('Product fetched:', data)
          if (data.success && data.product) {
            products.push(data.product)
          } else {
            console.log('Product not found for ID:', id)
          }
        } catch (error) {
          console.error(`Error fetching product ${id}:`, error)
        }
      }
      
      console.log('Final products array:', products)
      setFavoriteProducts(products)
      setLoading(false)
    }

    fetchFavoriteProducts()
  }, [favoriteIds])

  if (!favoriteIds || favoriteIds.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />

        <main className="flex-grow">
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
              <div className="flex items-center gap-3 mb-2">
                <Link href="/mina-sidor" className="text-gray-400 hover:text-gray-600" aria-label={t('myPagesBackAria')}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">{t('wishlist')}</h1>
              </div>
              <p className="text-gray-500">{t('yourSavedFavorites')}</p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('emptyWishlist')}</h2>
              <p className="text-gray-500 mb-6">{t('noSavedProducts')}</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                {t('startShopping')}
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center gap-3 mb-2">
              <Link href="/mina-sidor" className="text-gray-400 hover:text-gray-600" aria-label={t('myPagesBackAria')}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">{t('wishlist')}</h1>
            </div>
            <p className="text-gray-500">{t('yourSavedFavorites')}</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {loading ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">{t('wishlistLoading')}</p>
            </div>
          ) : favoriteProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('emptyWishlist')}</h2>
              <p className="text-gray-500 mb-6">{t('noSavedProducts')}</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                {t('startShopping')}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {favoriteProducts.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />
                  <button
                    onClick={() => handleRemoveFavorite(product.id)}
                    className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors z-10"
                    title={t('wishlistRemoveFromTitle')}
                  >
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
