'use client'

import { useState, useEffect, useMemo } from 'react'
import { Product } from '@/lib/types'
import { cleanText } from '@/lib/utils'
import { useCart } from '@/lib/CartContext'
import { useFavorites } from '@/lib/FavoritesContext'
import { useLanguage } from '@/lib/LanguageContext'
import ShoppingCartIcon from './ShoppingCartIcon'

interface HeroSheinProps {
  products: Product[]
}

type HeroCategoryId = 'superDeals' | 'topTrends' | 'brandZone' | 'flashSale' | 'newIn'

const HERO_BASE_ORDER: HeroCategoryId[] = ['superDeals', 'topTrends', 'brandZone', 'flashSale', 'newIn']

// ---------------------------------------------------------------------------
// Seeded Position Randomization
// ---------------------------------------------------------------------------

/**
 * Mulberry32 — deterministisk PRNG. Ger stabila tal i [0, 1) för ett givet frö.
 */
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Fisher-Yates shuffle med seeded PRNG.
 * Returnerar en ny array — originalet påverkas inte.
 */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr]
  const rand = mulberry32(seed)
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Hämtar (eller skapar) ett sessions-frö lagrat i sessionStorage.
 * Stabilt under hela sessionen, nytt frö vid varje ny session.
 */
function getHeroSessionSeed(): number {
  if (typeof window === 'undefined') return 42
  const key = 'hero_position_seed'
  const stored = sessionStorage.getItem(key)
  if (stored) return parseInt(stored, 10)
  const seed = Math.floor(Math.random() * 2 ** 32)
  sessionStorage.setItem(key, String(seed))
  return seed
}

/**
 * Returnerar ett kategori-unikt frö genom att XOR:a sessions-fröet med
 * ett deterministiskt offset per kategori-ID. Garanterar att varje
 * kategori shufflas med ett eget frö — ingen kategori delar ordning.
 */
function categorySeed(sessionSeed: number, categoryId: HeroCategoryId): number {
  // Unika offsets per kategori — välj godtyckliga primtal för god spridning
  const offsets: Record<HeroCategoryId, number> = {
    superDeals: 0x9e3779b9,
    flashSale:  0x6c62272e,
    topTrends:  0x517cc1b7,
    brandZone:  0xf4cfd400,
    newIn:      0x27d4eb2f,
  }
  return (sessionSeed ^ offsets[categoryId]) >>> 0
}

/** Slumpad kategoriordning — beräknas en gång per sidladdning (utanför komponenten) */
const HERO_ORDER: HeroCategoryId[] = seededShuffle(HERO_BASE_ORDER, getHeroSessionSeed())

const CATEGORY_TKEY: Record<HeroCategoryId, string> = {
  superDeals: 'heroCatSuperDeals',
  topTrends: 'heroCatTopTrends',
  brandZone: 'heroCatBrandZone',
  flashSale: 'heroCatFlashSale',
  newIn: 'heroCatNewIn',
}

export default function HeroShein({ products }: HeroSheinProps) {
  const { t } = useLanguage()
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([])
  const [activeCategory, setActiveCategory] = useState<HeroCategoryId>('superDeals')
  const [itemsToShow, setItemsToShow] = useState(12)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)

  const { addToCart } = useCart()
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()

  const categorizedProducts = useMemo(() => {
    if (allProducts.length === 0) return {} as Record<HeroCategoryId, Product[]>

    const seed = getHeroSessionSeed()

    // Super Deals: prisintervall 25–50 kr — exkluderar Flash Sale-produkter (< 25)
    // så att de två sektionerna aldrig visar samma produkter.
    const superDealsPool = allProducts.filter(p => p.price >= 25 && p.price < 50)
    // Fallback: om poolen är tom (t.ex. alla produkter < 25) ta price < 50 men > flashSale-gränsen
    const superDealsProducts = superDealsPool.length > 0
      ? superDealsPool
      : allProducts.filter(p => p.price < 50 && p.price >= 25)

    // Flash Sale: lägsta prissegmentet (< 25) — aldrig överlapp med Super Deals
    const flashSaleProducts = allProducts.filter(p => p.price < 25)

    return {
      // Varje kategori shufflas med sitt eget unika frö → olika ordning per kategori
      superDeals: seededShuffle(superDealsProducts, categorySeed(seed, 'superDeals')),
      flashSale:  seededShuffle(flashSaleProducts,  categorySeed(seed, 'flashSale')),
      topTrends: seededShuffle(
        allProducts.filter(
          p =>
            p.category?.toLowerCase().includes('women') ||
            p.category?.toLowerCase().includes('fashion')
        ),
        categorySeed(seed, 'topTrends')
      ),
      brandZone: seededShuffle(
        allProducts.filter(p => p.price > 50),
        categorySeed(seed, 'brandZone')
      ),
      newIn: seededShuffle(
        allProducts.slice().reverse(),
        categorySeed(seed, 'newIn')
      ),
    }
  }, [allProducts])

  const currentCategoryProducts = useMemo(() => {
    const categoryProducts = categorizedProducts[activeCategory] || []
    return categoryProducts.length > 0 ? categoryProducts : allProducts
  }, [categorizedProducts, activeCategory, allProducts])

  useEffect(() => {
    try {
      setIsLoading(true)

      const availableProducts = products.filter(
        product => product.inStock && product.id && product.name && product.price
      )

      if (availableProducts.length === 0) {
        setIsLoading(false)
        return
      }

      setAllProducts(availableProducts)
    } catch (error) {
      console.error('Misslyckades att ladda hero-produkter:', error)
    } finally {
      setIsLoading(false)
    }
  }, [products])

  useEffect(() => {
    setDisplayedProducts(currentCategoryProducts.slice(0, itemsToShow))
  }, [currentCategoryProducts, itemsToShow])

  const handleCategoryChange = (category: HeroCategoryId) => {
    setActiveCategory(category)
    setItemsToShow(12)
  }

  const handleLoadMore = async () => {
    setIsLoadingMore(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setItemsToShow(prev => prev + 12)
    setIsLoadingMore(false)
  }

  const handleAddToCart = async (product: Product, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    setAddingToCart(product.id)

    try {
      addToCart(product)
      await new Promise(resolve => setTimeout(resolve, 300))
    } catch (error) {
      console.error('Misslyckades att lägga till i kundvagn:', error)
    } finally {
      setAddingToCart(null)
    }
  }

  const hasMoreProducts = currentCategoryProducts.length > itemsToShow
  const activeCategoryLabel = t(CATEGORY_TKEY[activeCategory])

  if (isLoading) {
    return (
      <section className="w-full h-[400px] bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-500 text-sm">{t('heroLoading')}</p>
        </div>
      </section>
    )
  }

  if (allProducts.length === 0) {
    return null
  }

  return (
    <section className="w-full bg-white">
      <div className="bg-black text-white text-center py-2 text-sm">
        <div className="container mx-auto px-4">
          <span className="font-medium">{t('heroBannerFreeShipping')}</span>
          <span className="mx-4">|</span>
          <span className="font-medium">{t('heroBannerFreeReturns')}</span>
          <span className="mx-4">|</span>
          <span className="font-medium">{t('heroBannerNoHiddenFees')}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {HERO_ORDER.map(id => (
            <button
              key={id}
              type="button"
              onClick={() => handleCategoryChange(id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === id ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t(CATEGORY_TKEY[id])}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-1">{activeCategoryLabel}</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {displayedProducts.map((product, index) => {
            const discounts = [22, 24, 30, 35, 40, 45, 50, 65, 70, 79]
            const discount = discounts[index % discounts.length]
            const originalPrice = Math.round(product.price * (1 + discount / 100))

            return (
              <a
                key={`${product.id}-${activeCategory}-${index}`}
                href={`/produkt/${product.id}`}
                className="group block bg-white hover:shadow-md transition-shadow duration-200"
              >
                <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
                  <img
                    src={product.image || '/product-placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/product-placeholder.jpg'
                    }}
                  />

                  <button
                    type="button"
                    onClick={e => handleAddToCart(product, e)}
                    disabled={addingToCart === product.id}
                    className="absolute bottom-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:bg-white hover:scale-110 disabled:opacity-50"
                    aria-label={t('heroAddToCartAria')}
                  >
                    {addingToCart === product.id ? (
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full animate-spin"></div>
                    ) : (
                      <ShoppingCartIcon className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={e => {
                      e.preventDefault()
                      e.stopPropagation()
                      if (isFavorite(product.id)) {
                        removeFavorite(product.id)
                      } else {
                        addFavorite(product.id)
                      }
                    }}
                    className="absolute bottom-2 left-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:bg-white hover:scale-110"
                    aria-label={t('heroWishlistAria')}
                  >
                    <svg
                      className={`w-4 h-4 transition-colors ${isFavorite(product.id) ? 'text-red-500 fill-red-500' : 'text-gray-700'}`}
                      fill={isFavorite(product.id) ? 'currentColor' : 'none'}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 000-6.364 4.5 4.5 0 00-6.364 0L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>

                <div className="p-2">
                  <h3 className="text-sm text-gray-900 mb-1 line-clamp-2 leading-tight">{cleanText(product.name)}</h3>

                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold text-black">${product.price}</span>
                    {index < 8 && (
                      <span className="text-sm text-gray-400 line-through">${originalPrice}</span>
                    )}
                  </div>

                  {index < 4 && (
                    <div className="text-xs text-blue-600 font-medium">
                      #{['MoonlitCouture', 'CaprisRetro', 'BubbleHem', 'Mermaidcore'][index]}
                    </div>
                  )}
                </div>
              </a>
            )
          })}
        </div>

        {hasMoreProducts && (
          <div className="text-center mt-8">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
            >
              {isLoadingMore ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t('heroLoading')}
                </>
              ) : (
                t('heroLoadMore')
              )}
            </button>
          </div>
        )}

        {!hasMoreProducts && displayedProducts.length > 12 && (
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              {t('heroSeenAllInCategory').replace('{category}', activeCategoryLabel)}
            </p>
            <button
              type="button"
              onClick={() => handleCategoryChange('superDeals')}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {t('heroExploreOtherCategories')}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
