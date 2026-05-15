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
  originalPrice?: number
  badge?: string
  discount?: number
}

interface HeroCarouselProps {
  products: Product[]
}

export default function HeroCarousel({ products }: HeroCarouselProps) {
  const [heroProducts, setHeroProducts] = useState<HeroProduct[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    try {
      setIsLoading(true)
      
      const availableProducts = products.filter(product => 
        product.inStock && 
        product.id && 
        product.name && 
        product.price &&
        product.image
      )
      
      if (availableProducts.length === 0) {
        const fallbackProducts = products.filter(product => 
          product.inStock && 
          product.id && 
          product.name && 
          product.price
        )
        setHeroProducts(fallbackProducts.slice(0, 4).map((product, index) => ({
          id: product.id,
          name: cleanText(product.name),
          description: cleanText(product.description),
          price: product.price,
          category: cleanText(product.category),
          inStock: product.inStock,
          imageUrl: product.image || `/product-${product.id}.jpg`,
          heroTitle: cleanText(product.name),
          heroDescription: `Upptäck kvalitet till bästa pris`,
          originalPrice: Math.round(product.price * 1.4),
          badge: index === 0 ? 'NYHET' : index === 1 ? 'POPULÄR' : 'REA',
          discount: Math.round(((product.price * 1.4) - product.price) / (product.price * 1.4) * 100)
        })))
        setIsLoading(false)
        return
      }
      
      const selectedProducts: HeroProduct[] = availableProducts.slice(0, 4).map((product, index) => ({
        id: product.id,
        name: cleanText(product.name),
        description: cleanText(product.description),
        price: product.price,
        category: cleanText(product.category),
        inStock: product.inStock,
        imageUrl: product.image,
        heroTitle: cleanText(product.name),
        heroDescription: `Exklusiv design med premium kvalitet`,
        originalPrice: Math.round(product.price * 1.4),
        badge: index === 0 ? 'NYHET' : index === 1 ? 'POPULÄR' : index === 2 ? 'REA' : 'TREND',
        discount: Math.round(((product.price * 1.4) - product.price) / (product.price * 1.4) * 100)
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
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === heroProducts.length - 1 ? 0 : prevIndex + 1
        )
        setIsTransitioning(false)
      }, 150)
    }, 6000)

    return () => clearInterval(interval)
  }, [heroProducts.length])

  const goToSlide = (index: number) => {
    if (index === currentIndex) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex(index)
      setIsTransitioning(false)
    }, 150)
  }

  const goToPrevious = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex(currentIndex === 0 ? heroProducts.length - 1 : currentIndex - 1)
      setIsTransitioning(false)
    }, 150)
  }

  const goToNext = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex(currentIndex === heroProducts.length - 1 ? 0 : currentIndex + 1)
      setIsTransitioning(false)
    }, 150)
  }

  if (isLoading) {
    return (
      <section className="relative w-full h-[500px] md:h-[600px] bg-gray-50 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Laddar produkter...</p>
          </div>
        </div>
      </section>
    )
  }

  if (heroProducts.length === 0) {
    return null
  }

  const currentProduct = heroProducts[currentIndex]

  return (
    <section className="relative w-full h-[500px] md:h-[600px] lg:h-[650px] overflow-hidden bg-white">
      {/* Main Content Container */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className={`space-y-6 lg:space-y-8 transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
              
              {/* Badge */}
              <div className="flex items-center gap-3">
                <span className={`inline-block px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full ${
                  currentProduct.badge === 'NYHET' ? 'bg-green-100 text-green-800' :
                  currentProduct.badge === 'POPULÄR' ? 'bg-blue-100 text-blue-800' :
                  currentProduct.badge === 'REA' ? 'bg-red-100 text-red-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {currentProduct.badge}
                </span>
                {currentProduct.discount && (
                  <span className="bg-black text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    -{currentProduct.discount}%
                  </span>
                )}
              </div>

              {/* Category */}
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                {currentProduct.category}
              </p>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                {currentProduct.heroTitle || currentProduct.name}
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg">
                {currentProduct.heroDescription || currentProduct.description}
              </p>

              {/* Price Section */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl md:text-4xl font-bold text-gray-900">
                    ${currentProduct.price}
                  </span>
                  {currentProduct.originalPrice && (
                    <span className="text-xl text-gray-400 line-through">
                      ${currentProduct.originalPrice}
                    </span>
                  )}
                </div>
                {currentProduct.inStock ? (
                  <span className="bg-green-50 text-green-700 text-sm font-medium px-3 py-1 rounded-full border border-green-200">
                    I lager
                  </span>
                ) : (
                  <span className="bg-red-50 text-red-700 text-sm font-medium px-3 py-1 rounded-full border border-red-200">
                    Slut i lager
                  </span>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href={`/produkt/${currentProduct.id}`}
                  className="inline-flex items-center justify-center px-8 py-4 bg-black text-white font-semibold text-lg rounded-lg hover:bg-gray-800 transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  Köp nu
                  <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                
                <a
                  href="/products"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-semibold text-lg rounded-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                >
                  Se mer
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 pt-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Fri frakt över $50</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>30 dagars retur</span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className={`relative transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              <div className="relative aspect-square max-w-lg mx-auto">
                <img 
                  src={currentProduct.imageUrl || '/product-placeholder.jpg'}
                  alt={currentProduct.name}
                  className="w-full h-full object-cover rounded-2xl shadow-2xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const placeholder = target.parentElement?.querySelector('.image-fallback')
                    if (placeholder) {
                      (placeholder as HTMLElement).style.display = 'flex'
                    }
                  }}
                />
                <div className="image-fallback absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-2xl" style={{ display: 'none' }}>
                  <div className="text-center text-gray-600">
                    <div className="text-6xl mb-4">📦</div>
                    <p className="text-xl font-semibold">{currentProduct.name}</p>
                  </div>
                </div>
                
                {/* Floating Discount Badge */}
                {currentProduct.discount && (
                  <div className="absolute -top-4 -right-4 bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg transform rotate-12">
                    -{currentProduct.discount}%
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {heroProducts.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-10"
            aria-label="Föregående produkt"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-10"
            aria-label="Nästa produkt"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {heroProducts.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {heroProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-8 bg-black' 
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Gå till produkt ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
