'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/lib/types'
import { cleanText } from '@/lib/utils'

interface HeroProduct {
  id: string
  name: string
  description: string
  price: number
  category: string
  inStock: boolean
  imageUrl?: string
  heroTitle?: string
  heroDescription?: string
}

interface HeroCarouselProps {
  products: Product[]
}

export default function HeroCarousel({ products }: HeroCarouselProps) {
  const [heroProducts, setHeroProducts] = useState<HeroProduct[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      setIsLoading(true)
      
      const availableProducts = products.filter(product => product.inStock)
      
      if (availableProducts.length === 0) {
        setHeroProducts([])
        setIsLoading(false)
        return
      }
      
      // Ta de första 3 produkterna från databasen
      const selectedProducts: HeroProduct[] = availableProducts.slice(0, 3).map(product => ({
        id: product.id,
        name: cleanText(product.name),
        description: cleanText(product.description),
        price: product.price,
        category: cleanText(product.category),
        inStock: product.inStock,
        imageUrl: product.image || `/product-${product.id}.jpg`,
        heroTitle: cleanText(product.name),
        heroDescription: `${cleanText(product.description)}. Endast ${product.price} USD. Kvalitetsprodukter med snabb leverans.`
      }))
      
      setHeroProducts(selectedProducts)
    } catch (error) {
      console.error('Misslyckades att ladda hero-produkter:', error)
      setHeroProducts([])
    } finally {
      setIsLoading(false)
    }
  }, [products])

  useEffect(() => {
    if (heroProducts.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === heroProducts.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [heroProducts.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? heroProducts.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === heroProducts.length - 1 ? 0 : currentIndex + 1)
  }

  if (isLoading) {
    return (
      <div className="relative bg-gradient-to-br from-gray-50 to-white border-b border-gray-200 py-4 md:py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="bg-white rounded-2xl p-4 shadow-xl">
                <div className="w-full h-48 md:h-56 bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
            </div>
            <div className="flex-1 flex items-center">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (heroProducts.length === 0) {
    return (
      <div className="relative bg-gradient-to-br from-gray-50 to-white border-b border-gray-200 py-4 md:py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="bg-white rounded-2xl p-4 shadow-xl">
                <div className="w-full h-48 md:h-56 bg-gray-100 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🛍️</div>
                    <p className="text-gray-500">Laddar produkter från databasen...</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 flex items-center">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  Välkommen till vår e-handel
                </h2>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  Vi laddar produkterna från vår databas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentProduct = heroProducts[currentIndex]

  return (
    <div className="relative bg-gradient-to-br from-gray-50 to-white border-b border-gray-200 py-4 md:py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="relative bg-white rounded-2xl p-4 shadow-xl overflow-hidden">
              <div className="relative">
                <img 
                  src={currentProduct.imageUrl || '/product-placeholder.jpg'}
                  alt={currentProduct.name}
                  className="w-full h-48 md:h-56 object-cover rounded-xl transition-opacity duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const placeholder = target.parentElement?.querySelector('.image-fallback')
                    if (placeholder) {
                      (placeholder as HTMLElement).style.display = 'flex'
                    }
                  }}
                />
                
                <div className="absolute top-2 left-2 bg-gray-900 text-white px-2 py-1 text-xs font-semibold rounded">
                  {currentProduct.category}
                </div>
                
                <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 text-xs font-bold rounded">
                  ${currentProduct.price}
                </div>
                
                <div className="image-fallback absolute inset-0 bg-gray-100 rounded-xl flex items-center justify-center" style={{ display: 'none' }}>
                  <div className="text-center">
                    <div className="text-4xl mb-2">📦</div>
                    <p className="text-gray-500 text-sm">{currentProduct.name}</p>
                    <p className="text-gray-400 text-xs">Produktbild kunde inte laddas</p>
                  </div>
                </div>
              </div>

              <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200"
                aria-label="Föregående produkt"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200"
                aria-label="Nästa produkt"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {heroProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentIndex 
                        ? 'bg-gray-800' 
                        : 'bg-white/60 hover:bg-white/80'
                    }`}
                    aria-label={`Gå till produkt ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex items-center">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                {currentProduct.heroTitle || currentProduct.name}
              </h2>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">
                {currentProduct.heroDescription || currentProduct.description}
              </p>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-green-600">${currentProduct.price}</span>
                {currentProduct.inStock ? (
                  <span className="text-sm text-green-600 font-medium">✓ I lager</span>
                ) : (
                  <span className="text-sm text-red-600 font-medium">Slut i lager</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
