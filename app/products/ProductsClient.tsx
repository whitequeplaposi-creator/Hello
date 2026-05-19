'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Product } from '@/lib/types'
import ProductCard from '@/components/ProductCard'
import { useLanguage } from '@/lib/LanguageContext'
import { filterProductsByCategory, resolveGeneratedCategoryName } from '@/lib/categoryGenerator'

interface ProductsClientProps {
  products: Product[]
}

export default function ProductsClient({ products }: ProductsClientProps) {
  const { t } = useLanguage()
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()
  const categoryFilter = searchParams.get('category')

  useEffect(() => {
    setIsLoading(true)

    if (!categoryFilter) {
      setFilteredProducts(products)
      setIsLoading(false)
      return
    }

    const canonical = resolveGeneratedCategoryName(categoryFilter)
    if (canonical) {
      const matched = filterProductsByCategory(
        products.map((p) => ({ id: p.id, name: p.name || '' })),
        canonical
      )
      const idSet = new Set(matched.map((p) => p.id))
      setFilteredProducts(products.filter((p) => idSet.has(p.id)))
      setIsLoading(false)
      return
    }

    const filtered = products.filter((product) => {
      if (!product.category) return false
      const productCategory = product.category.toLowerCase()
      const searchTerm = categoryFilter.toLowerCase()
      return (
        productCategory.includes(searchTerm) ||
        productCategory.includes(searchTerm.replace('-', ' ')) ||
        productCategory.includes(searchTerm.replace(' ', '-')) ||
        (searchTerm === 'men' && (productCategory.includes('man') || productCategory.includes('herr'))) ||
        (searchTerm === 'women' && (productCategory.includes('woman') || productCategory.includes('dam'))) ||
        (searchTerm === 't-shirt' && (productCategory.includes('tshirt') || productCategory.includes('t shirt')))
      )
    })
    setFilteredProducts(filtered)
    setIsLoading(false)
  }, [categoryFilter, products])

  const displayProducts = filteredProducts.filter((product) => product.inStock)

  const categoryTitle =
    categoryFilter &&
    `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}`

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="bg-[#f5f5f5] min-h-screen">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 md:py-8">
          <div className="mb-6">
            <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
                <div className="aspect-square bg-gray-200 animate-pulse" />
                <div className="p-2 space-y-2">
                  <div className="h-3 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 md:py-8">
        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {categoryFilter ? categoryTitle : t('catalogTitleAll')}
          </h1>
        </div>

        {displayProducts.length === 0 ? (
          <div className="text-center text-gray-600 py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-bold mb-2">
              {categoryFilter ? t('catalogEmptyCategoryTitle') : t('catalogEmptyGeneralTitle')}
            </h2>
            <p className="mb-6 text-gray-500">
              {categoryFilter
                ? t('catalogEmptyCategoryHint', { cat: categoryFilter })
                : t('catalogEmptyDbBody')}
            </p>
            {categoryFilter && (
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-neutral-900 text-white font-semibold rounded-full hover:bg-black transition-colors"
              >
                {t('catalogReturnToHome')}
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {displayProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center mt-10">
              <p className="text-sm text-gray-500">
                {t('catalogFooterLine', { shown: displayProducts.length, total: products.length })}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
