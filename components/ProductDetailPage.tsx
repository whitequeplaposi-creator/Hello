'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Product } from '@/lib/types'
import { useCart } from '@/lib/CartContext'
import { useLanguage } from '@/lib/LanguageContext'
import { cleanText, formatPrice, colorNameToHex } from '@/lib/utils'
import ShoppingCartIcon from './ShoppingCartIcon'
import ProductPageCartIcon from './ProductPageCartIcon'
import TruckIcon from './TruckIcon'
import SimplePaymentMethods from './SimplePaymentMethods'

interface Review {
  id: string
  author: string
  rating: number
  title: string
  body: string
  date: string
  verified: boolean
}

const sampleReviews: Review[] = [
  {
    id: '1',
    author: 'Anna K.',
    rating: 5,
    title: 'Fantastisk kvalitet!',
    body: 'Mycket nöjd med produkten. Kvaliteten är utmärkt och leveransen var snabb. Rekommenderas starkt!',
    date: '2025-03-15',
    verified: true,
  },
  {
    id: '2',
    author: 'Erik S.',
    rating: 4,
    title: 'Bra produkt',
    body: 'Goda material och fin passform. Skulle önska lite fler färgalternativ, men överlag mycket bra.',
    date: '2025-02-28',
    verified: true,
  },
  {
    id: '3',
    author: 'Maria L.',
    rating: 5,
    title: 'Precis som förväntat',
    body: 'Produkten motsvarar beskrivningen perfekt. Mycket professionell förpackning och snabb leverans.',
    date: '2025-01-10',
    verified: false,
  },
]

interface ProductDetailPageProps {
  product: Product
  relatedProducts: Product[]
}

export default function ProductDetailPage({ product, relatedProducts }: ProductDetailPageProps) {
  const { addToCart } = useCart()
  const { t } = useLanguage()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description')
  const [reviews, setReviews] = useState<Review[]>(sampleReviews)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({
    author: '',
    title: '',
    body: '',
    rating: 5,
  })

  const images = product.images && product.images.length > 0
    ? product.images
    : product.image
      ? [product.image]
      : []

  const averageRating = useMemo(() => {
    return reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0
  }, [reviews])

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      return
    }
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
  }

  const canAddToCart = selectedColor && selectedSize && product.inStock

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    const review: Review = {
      id: Date.now().toString(),
      author: newReview.author,
      rating: newReview.rating,
      title: newReview.title,
      body: newReview.body,
      date: new Date().toISOString().split('T')[0],
      verified: false,
    }
    setReviews([review, ...reviews])
    setNewReview({ author: '', title: '', body: '', rating: 5 })
    setShowReviewForm(false)
  }

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setNewReview(prev => ({ ...prev, rating: star }))}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          >
            <svg
              className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-gray-500">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-gray-800 transition-colors">{t('breadcrumbsHome')}</Link></li>
          <li>/</li>
          <li><Link href="/" className="hover:text-gray-800 transition-colors">{t('breadcrumbsProducts')}</Link></li>
          <li>/</li>
          <li className="text-gray-800 font-medium truncate max-w-xs">{cleanText(product.name)}</li>
        </ol>
      </nav>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border border-gray-200">
            {images.length > 0 ? (
              <img
                src={images[selectedImage]}
                alt={cleanText(product.name)}
                className="w-full h-full object-cover"
                loading="lazy"
                fetchPriority="high"
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
                  <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
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
            {renderStars(Math.round(averageRating))}
            <span className="text-sm text-gray-600">
              {averageRating.toFixed(1)} ({reviews.length} {t('reviews').toLowerCase()})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.price >= 499 && (
              <span className="text-sm text-green-600 font-medium">
                {t('freeShipping')}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`text-sm font-medium ${product.inStock ? 'text-green-700' : 'text-red-700'}`}>
              {product.inStock ? t('inStock') : t('outOfStockBadge')}
            </span>
          </div>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">{t('colors')}</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color, index) => {
                  const hex = colorNameToHex(color)
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(color)}
                      className={`flex items-center gap-1.5 group cursor-pointer transition-all ${
                        selectedColor === color ? 'ring-2 ring-gray-900 rounded-full' : ''
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full border-2 transition-all ${
                          hex ? 'border-gray-200 group-hover:border-gray-400' : 'border-gray-300 border-dashed'
                        }`}
                        style={hex ? { backgroundColor: hex } : undefined}
                        title={color}
                      >
                        {!hex && (
                          <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-400 font-medium">
                            ?
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">{color}</span>
                    </button>
                  )
                })}
              </div>
              {selectedColor && (
                <p className="text-xs text-gray-500 mt-2">Vald färg: {selectedColor}</p>
              )}
            </div>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">Storlek</h3>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-xs text-blue-600 hover:text-blue-700 underline"
                >
                  Storleksguide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${
                      selectedSize === size
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-300 hover:border-gray-400 text-gray-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {selectedSize && (
                <p className="text-xs text-gray-500 mt-2">Vald storlek: {selectedSize}</p>
              )}
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors text-lg font-medium"
              >
                −
              </button>
              <span className="px-5 py-3 text-center font-medium min-w-[3rem] border-x border-gray-300">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors text-lg font-medium"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              className={`p-2 rounded transition-colors ${
                canAddToCart
                  ? 'hover:bg-gray-100 cursor-pointer'
                  : 'bg-gray-50 cursor-not-allowed opacity-50'
              }`}
              aria-label="Lägg i varukorg"
            >
              <ProductPageCartIcon className="w-6 h-6" />
            </button>
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
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <svg className="w-6 h-6 text-gray-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div>
                <p className="text-xs font-semibold text-gray-800">{t('securePayment')}</p>
                <p className="text-xs text-gray-500">{t('securePaymentValue')}</p>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="pt-2">
            <SimplePaymentMethods />
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
              {tab === 'reviews' && (
                <span className="ml-1.5 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                  {reviews.length}
                </span>
              )}
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
          <div className="space-y-6">
            {/* Rating Summary */}
            <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-xl">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
                <div className="mt-1">{renderStars(Math.round(averageRating))}</div>
                <div className="text-sm text-gray-500 mt-1">{reviews.length} {t('reviews').toLowerCase()}</div>
              </div>
              <div className="flex-1 space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviews.filter(r => r.rating === star).length
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                  return (
                    <div key={star} className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600 w-3">{star}</span>
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-gray-500 w-6 text-right">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Write Review Button */}
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-6 py-2.5 border border-gray-900 text-gray-900 rounded-lg font-medium text-sm hover:bg-gray-900 hover:text-white transition-all"
            >
              {t('writeReview')}
            </button>

            {/* Review Form */}
            {showReviewForm && (
              <form onSubmit={handleSubmitReview} className="p-6 bg-gray-50 rounded-xl space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('yourName')}</label>
                  <input
                    type="text"
                    required
                    value={newReview.author}
                    onChange={(e) => setNewReview(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('reviewRating')}</label>
                  {renderStars(newReview.rating, true)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('reviewTitle')}</label>
                  <input
                    type="text"
                    required
                    value={newReview.title}
                    onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('reviewBody')}</label>
                  <textarea
                    required
                    rows={4}
                    value={newReview.body}
                    onChange={(e) => setNewReview(prev => ({ ...prev, body: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition-all"
                >
                  {t('submitReview')}
                </button>
              </form>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">{t('noReviews')}</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {reviews.map((review) => (
                  <div key={review.id} className="py-6 first:pt-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600">
                            {review.author.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 text-sm">{review.author}</span>
                              {review.verified && (
                                <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  {t('verifiedPurchase')}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-400">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      {renderStars(review.rating)}
                    </div>
                    <h4 className="font-semibold text-gray-900 mt-3 text-sm">{review.title}</h4>
                    <p className="text-gray-600 mt-1 text-sm leading-relaxed">{review.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-gray-200 mt-12 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('relatedProducts')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {relatedProducts.slice(0, 5).map((related) => (
              <Link key={related.id} href={`/produkt/${related.id}`} className="group block">
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all">
                  <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    {related.image ? (
                      <img
                        src={related.image}
                        alt={cleanText(related.name)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-medium text-gray-900 line-clamp-1">{cleanText(related.name)}</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">{formatPrice(related.price)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
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
