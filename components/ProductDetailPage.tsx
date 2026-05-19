'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Product } from '@/lib/types'
import { useCart } from '@/lib/CartContext'
import { useLanguage } from '@/lib/LanguageContext'
import { cleanText, formatPrice, colorNameToHex } from '@/lib/utils'
import ShoppingCartIcon from './ShoppingCartIcon'
import ProductPageCartIcon from './ProductPageCartIcon'
import TruckIcon from './TruckIcon'
import FavoriteButton from './FavoriteButton'
import ProductCard from './ProductCard'
import ProductReviews from './ProductReviews'
import VariantSelector, { VariantState } from './VariantSelector'
import { useTrackProductEvent } from '@/hooks/usePersonalization'

interface ProductDetailPageProps {
  product: Product
  relatedProducts: Product[]
}

export default function ProductDetailPage({ product, relatedProducts }: ProductDetailPageProps) {
  const { addToCart } = useCart()
  const { t } = useLanguage()
  const { trackEvent } = useTrackProductEvent()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [currentPrice, setCurrentPrice] = useState(product.price)
  const [variantInStock, setVariantInStock] = useState(product.inStock)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description')
  const [addedToCart, setAddedToCart] = useState(false)

  // Spåra produktvisning när sidan laddas
  const pageOpenTime = useRef(Date.now())
  useEffect(() => {
    trackEvent(product, 'view')
    return () => {
      // Spåra tid spenderad på sidan när användaren lämnar
      const durationSeconds = Math.round((Date.now() - pageOpenTime.current) / 1000)
      if (durationSeconds > 2) {
        trackEvent(product, 'click', { durationSeconds })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id])

  const images = product.images && product.images.length > 0
    ? product.images
    : product.image
      ? [product.image]
      : []

  const hasMultipleColors = (product.colors?.length ?? 0) >= 2
  const hasSizes = (product.sizes?.length ?? 0) > 0

  const handleAddToCart = () => {
    // Color required only when product has 2+ colors
    if (hasMultipleColors && !selectedColor) return
    // Size always required when sizes exist
    if (hasSizes && !selectedSize) return

    const colorToUse = selectedColor ?? (product.colors?.[0] ?? '')
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize ?? '', colorToUse)
    }
    trackEvent(product, 'add_to_cart')
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleVariantChange = useCallback((state: VariantState) => {
    setSelectedColor(state.selectedColor)
    setSelectedSize(state.selectedSize)
    setSelectedImage(state.currentImageIndex)
    setCurrentPrice(state.currentPrice)
    setVariantInStock(state.inStock)
  }, [])

  const canAddToCart =
    variantInStock &&
    (!hasMultipleColors || !!selectedColor) &&
    (!hasSizes || !!selectedSize)

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border border-gray-200">
            {images.length > 0 ? (
              <Image
                src={images[selectedImage]}
                alt={cleanText(product.name)}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
                quality={85}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-24 h-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            {!product.inStock && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1.5 text-sm font-semibold rounded-lg">
                {t('outOfStockBadge')}
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-gray-900 ring-1 ring-gray-900' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Category Badge */}
          <div>
            <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
              {product.category}
            </span>
          </div>

          {/* Product Name */}
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            {cleanText(product.name)}
          </h1>

          {/* Rating Summary */}
          <div className="flex items-center gap-3">
            {renderStars(0)}
            <span className="text-sm text-gray-600">
              <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => setActiveTab('reviews')}>
                {t('reviews').toLowerCase()}
              </span>
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900 transition-all duration-200">
                {formatPrice(currentPrice)}
              </span>
              {currentPrice !== product.price && (
                <span className="text-sm text-gray-400 line-through">{formatPrice(product.price)}</span>
              )}
              {currentPrice >= 499 && (
                <span className="text-sm text-green-600 font-medium">
                  {t('freeShipping')}
                </span>
              )}
            </div>
            <div onClick={() => trackEvent(product, 'wishlist')}>
              <FavoriteButton productId={product.id} />
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full transition-colors ${variantInStock ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`text-sm font-medium transition-colors ${variantInStock ? 'text-green-700' : 'text-red-700'}`}>
              {variantInStock ? t('inStock') : t('outOfStockBadge')}
              {selectedColor && selectedSize && (
                <span className="ml-1 font-normal text-gray-500">
                  — {selectedColor}, {selectedSize}
                </span>
              )}
            </span>
          </div>

          {/* Variant Selector */}
          {((product.colors && product.colors.length > 0) || (product.sizes && product.sizes.length > 0)) && (
            <VariantSelector
              colors={product.colors ?? []}
              sizes={product.sizes ?? []}
              images={images}
              basePrice={product.price}
              baseInStock={product.inStock}
              currentImageIndex={selectedImage}
              onChange={handleVariantChange}
            />
          )}

          {/* Quantity & Add to Cart */}
          <div className="space-y-3">
            {/* Validation hint */}
            {!canAddToCart && variantInStock && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                {hasMultipleColors && !selectedColor && hasSizes && !selectedSize
                  ? 'Välj färg och storlek för att lägga i varukorgen'
                  : hasMultipleColors && !selectedColor
                    ? 'Välj en färg för att lägga i varukorgen'
                    : hasSizes && !selectedSize
                      ? 'Välj en storlek för att lägga i varukorgen'
                      : null}
              </p>
            )}

            <div className="flex gap-3">
              {/* Quantity */}
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors text-lg font-medium"
                  aria-label="Minska antal"
                >
                  −
                </button>
                <span className="px-5 py-3 text-center font-medium min-w-[3rem] border-x border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors text-lg font-medium"
                  aria-label="Öka antal"
                >
                  +
                </button>
              </div>

              {/* Add to Cart — icon only */}
              <button
                onClick={handleAddToCart}
                disabled={!canAddToCart}
                className={`flex items-center justify-center p-2 transition-all duration-200 ${
                  addedToCart
                    ? 'text-green-600'
                    : canAddToCart
                      ? 'text-gray-900 hover:text-gray-600 active:scale-95'
                      : 'text-gray-300 cursor-not-allowed'
                }`}
                aria-label="Lägg i varukorg"
              >
                {addedToCart ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <ProductPageCartIcon className="w-9 h-9" />
                )}
              </button>
            </div>

            {/* Size guide link */}
            {product.sizes && product.sizes.length > 0 && (
              <button
                onClick={() => setShowSizeGuide(true)}
                className="text-xs text-blue-600 hover:text-blue-700 underline"
              >
                Storleksguide
              </button>
            )}
          </div>

          {/* Delivery Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <TruckIcon className="w-6 h-6 text-gray-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-800">{t('deliveryTime')}</p>
                <p className="text-xs text-gray-500">{t('deliveryTimeValue')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <svg className="w-6 h-6 text-gray-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-xs font-semibold text-gray-800">{t('returnPolicy')}</p>
                <p className="text-xs text-gray-500">{t('returnPolicyValue')}</p>
              </div>
            </div>
          </div>


        </div>
      </div>

      {/* Tabs Section */}
      <div className="border-t border-gray-200 pt-8">
        <div className="flex gap-0 border-b border-gray-200 mb-6">
          {(['description', 'specifications', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                activeTab === tab
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t(tab)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'description' && (
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed text-base">
              {cleanText(product.description)}
            </p>
            <div className="mt-6 p-6 bg-gray-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('deliveryInfo')}</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <TruckIcon className="w-4 h-4" />
                  <span>{t('deliveryTime')}: {t('deliveryTimeValue')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{t('freeShipping')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{t('returnPolicyValue')}</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'specifications' && (
          <div className="max-w-2xl">
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-8 text-sm font-medium text-gray-500 w-40">{t('category')}</td>
                  <td className="py-3 text-sm text-gray-900">{product.category}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-8 text-sm font-medium text-gray-500">{t('price')}</td>
                  <td className="py-3 text-sm text-gray-900">{formatPrice(product.price)}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-8 text-sm font-medium text-gray-500">{t('availability')}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${product.inStock ? 'text-green-700' : 'text-red-700'}`}>
                      <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
                      {product.inStock ? t('inStock') : t('outOfStockBadge')}
                    </span>
                  </td>
                </tr>
                {product.colors && product.colors.length > 0 && (
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pr-8 text-sm font-medium text-gray-500">{t('colors')}</td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((color, index) => {
                          const hex = colorNameToHex(color)
                          return (
                            <span key={index} className="inline-flex items-center gap-1.5 text-sm text-gray-900">
                              <span
                                className={`w-3.5 h-3.5 rounded-full inline-block border ${hex ? 'border-gray-200' : 'border-gray-300 border-dashed'}`}
                                style={hex ? { backgroundColor: hex } : undefined}
                              />
                              {color}
                            </span>
                          )
                        })}
                      </div>
                    </td>
                  </tr>
                )}
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-8 text-sm font-medium text-gray-500">{t('deliveryTime')}</td>
                  <td className="py-3 text-sm text-gray-900">{t('deliveryTimeValue')}</td>
                </tr>
                <tr>
                  <td className="py-3 pr-8 text-sm font-medium text-gray-500">{t('returnPolicy')}</td>
                  <td className="py-3 text-sm text-gray-900">{t('returnPolicyValue')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'reviews' && (
          <ProductReviews produktId={product.id} />
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <RelatedProductsSection relatedProducts={relatedProducts} t={t} />
      )}

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Storleksguide</h2>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Hur du mäter</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">1</div>
                    <div>
                      <p className="font-medium text-gray-900">Byst</p>
                      <p className="text-sm text-gray-600">Mät runt den bredaste delen av din byst</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">2</div>
                    <div>
                      <p className="font-medium text-gray-900">Midja</p>
                      <p className="text-sm text-gray-600">Mät runt din naturliga midja, vanligtvis nära naveln</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">3</div>
                    <div>
                      <p className="font-medium text-gray-900">Höft</p>
                      <p className="text-sm text-gray-600">Mät runt den bredaste delen av dina höfter</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Storlekstabell</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">Storlek</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">Byst (cm)</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">Midja (cm)</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">Höft (cm)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">XS</td>
                        <td className="px-4 py-3 text-sm text-gray-600">80-84</td>
                        <td className="px-4 py-3 text-sm text-gray-600">62-66</td>
                        <td className="px-4 py-3 text-sm text-gray-600">88-92</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">S</td>
                        <td className="px-4 py-3 text-sm text-gray-600">84-88</td>
                        <td className="px-4 py-3 text-sm text-gray-600">66-70</td>
                        <td className="px-4 py-3 text-sm text-gray-600">92-96</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">M</td>
                        <td className="px-4 py-3 text-sm text-gray-600">88-92</td>
                        <td className="px-4 py-3 text-sm text-gray-600">70-74</td>
                        <td className="px-4 py-3 text-sm text-gray-600">96-100</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">L</td>
                        <td className="px-4 py-3 text-sm text-gray-600">92-96</td>
                        <td className="px-4 py-3 text-sm text-gray-600">74-78</td>
                        <td className="px-4 py-3 text-sm text-gray-600">100-104</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">XL</td>
                        <td className="px-4 py-3 text-sm text-gray-600">96-100</td>
                        <td className="px-4 py-3 text-sm text-gray-600">78-82</td>
                        <td className="px-4 py-3 text-sm text-gray-600">104-108</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Tips för rätt storlek</h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>• Om du är mellan två storlekar, välj den större för bästa komfort</li>
                  <li>• Tänk på vilket material plagget är gjort av - vissa material ger mer</li>
                  <li>• Läs produktbeskrivningen för specifik passforminformation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Separate client component for related products with load more functionality
function RelatedProductsSection({
  relatedProducts,
  t,
}: {
  relatedProducts: Product[]
  t: (key: string) => string
}) {
  // Client-side ID deduplication as a safety net against any server-side
  // duplicates that may slip through (e.g. from cache inconsistencies).
  const uniqueProducts = relatedProducts.filter(
    (p, index, self) => index === self.findIndex((q) => q.id === p.id)
  )

  const [visibleCount, setVisibleCount] = useState(8)
  const visible = uniqueProducts.slice(0, visibleCount)
  const hasMore = visibleCount < uniqueProducts.length

  if (uniqueProducts.length === 0) return null

  return (
    <div className="border-t border-gray-200 mt-12 pt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('relatedProducts')}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {visible.map((related) => (
          <ProductCard key={related.id} product={related} />
        ))}
      </div>
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 8)}
            className="px-8 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            {t('loadMore')}
          </button>
        </div>
      )}
    </div>
  )
}
