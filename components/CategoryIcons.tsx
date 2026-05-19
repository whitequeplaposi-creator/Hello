'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Product } from '@/lib/types'
import { cleanText } from '@/lib/utils'
import { useLanguage } from '@/lib/LanguageContext'

interface CategoryWithProduct {
  name: string
  href: string
  gradient: string
  product: Product | null
  productCount: number
}

function labelKeyForSlug(slug: string): string {
  const map: Record<string, string> = {
    sweater: 'catIconSweater',
    men: 'catIconMen',
    women: 'catIconWomen',
    trousers: 'catIconTrousers',
    dress: 'catIconDress',
    jacket: 'catIconJacket',
    't-shirt': 'catIconTshirt',
  }
  return map[slug.toLowerCase()] ?? 'categoryAll'
}

// Maps canonical category name to the keywords used in categoryGenerator.ts
// so product matching in CategoryIcons mirrors the same logic as the header/ProductGrid
const categoryMatchKeywords: Record<string, string[]> = {
  Men: ['herr', 'män', 'man', 'men', 'mens', 'herrmode', 'herrkläder'],
  Women: ['dam', 'kvinna', 'kvinnor', 'women', 'womens', 'dammode', 'damkläder', 'ladies'],
  Sweater: ['sweater', 'tröja', 'pullover', 'hoodie', 'sweatshirt'],
  Jacket: ['jacket', 'jacka', 'coat', 'rock', 'blazer', 'cardigan'],
  Dress: ['dress', 'klänning', 'gown', 'maxi'],
  'T-shirt': ['t-shirt', 'tshirt', 't shirt', 'skjorta', 'tee'],
  Trousers: ['trousers', 'pants', 'byxa', 'jeans', 'leggings', 'shorts'],
}

interface CategoryIconsProps {
  products: Product[]
}

export default function CategoryIcons({ products }: CategoryIconsProps) {
  const { t } = useLanguage()
  const [categories, setCategories] = useState<CategoryWithProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Canonical names match categoryKeywords keys in categoryGenerator.ts (Title Case)
  const categoryConfig = [
    { name: 'Sweater', gradient: 'from-blue-500 to-blue-700' },
    { name: 'Men', gradient: 'from-gray-500 to-gray-700' },
    { name: 'Women', gradient: 'from-pink-500 to-rose-600' },
    { name: 'Trousers', gradient: 'from-indigo-500 to-purple-600' },
    { name: 'Dress', gradient: 'from-purple-500 to-pink-600' },
    { name: 'Jacket', gradient: 'from-green-500 to-emerald-600' },
    { name: 'T-shirt', gradient: 'from-sky-400 to-blue-500' },
  ]

  useEffect(() => {
    try {
      setIsLoading(true)
      
      const categoriesWithProducts: CategoryWithProduct[] = categoryConfig.map((config) => {
        // Hitta produkter som matchar kategorin direkt från databasen
        let categoryProducts = products.filter(product => {
          if (!product.category || !product.inStock) return false
          
          // Använd kategorin som redan är satt i databasen
          return product.category.toLowerCase() === config.name.toLowerCase()
        })
        
        // Om inga produkter hittas med exakt matchning, använd samma keyword-logik
        // som categoryGenerator.ts och ProductGrid för konsekvent filtrering
        if (categoryProducts.length === 0) {
          const keywords = categoryMatchKeywords[config.name] ?? []
          categoryProducts = products.filter(product => {
            if (!product.inStock) return false
            const nameLower = product.name.toLowerCase()
            return keywords.some(kw => nameLower.includes(kw))
          })
        }
        
        // Välj en slumpmässig produkt från kategorin
        const randomProduct = categoryProducts.length > 0 
          ? categoryProducts[Math.floor(Math.random() * categoryProducts.length)]
          : null

        return {
          name: config.name,
          href: `/products?category=${config.name}`,
          gradient: config.gradient,
          product: randomProduct,
          productCount: categoryProducts.length,
        }
      })

      // Filtrera bort kategorier utan produkter och sortera efter antal produkter
      const validCategories = categoriesWithProducts
        .filter(cat => cat.productCount > 0)
        .sort((a, b) => b.productCount - a.productCount)

      // Om vi har färre än 7 kategorier med produkter, lägg till tomma kategorier
      const allCategories = [...validCategories]
      if (allCategories.length < 7) {
        const emptyCategories = categoriesWithProducts
          .filter(cat => cat.productCount === 0)
          .slice(0, 7 - allCategories.length)
        allCategories.push(...emptyCategories)
      }

      setCategories(allCategories.slice(0, 7))
    } catch (error) {
      console.error('Misslyckades att ladda kategorier:', error)
      setCategories([])
    } finally {
      setIsLoading(false)
    }
  }, [products])

  if (isLoading) {
    return (
      <section className="relative bg-gradient-to-b from-white to-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 md:gap-8">
            {[...Array(7)].map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="mt-3 h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (categories.length === 0) {
    return null
  }

  return (
    <section className="relative bg-gradient-to-b from-white to-gray-50 py-12 px-4 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute left-10 top-20 w-20 h-20 bg-blue-200 rounded-full opacity-20 blur-xl animate-pulse"></div>
      <div className="absolute right-10 bottom-20 w-16 h-16 bg-pink-200 rounded-full opacity-20 blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
            {t('shopByCategoryTitle')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            {t('shopByCategorySubtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 md:gap-8">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              href={category.href}
              className="group flex flex-col items-center animate-fade-in-scale"
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden shadow-lg hover:shadow-xl transform transition-all duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-2 group-active:scale-95 border-4 border-white">
                {category.product ? (
                  <>
                    {/* Produktbild från databasen */}
                    <img
                      src={category.product.image || '/product-placeholder.jpg'}
                      alt={cleanText(category.product.name)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const fallback = target.parentElement?.querySelector('.image-fallback')
                        if (fallback) {
                          (fallback as HTMLElement).style.display = 'flex'
                        }
                      }}
                    />
                    
                    {/* Fallback endast om produktbild inte laddas */}
                    <div className={`image-fallback absolute inset-0 bg-gradient-to-br ${category.gradient} flex items-center justify-center`} style={{ display: 'none' }}>
                      <div className="text-center text-white">
                        <div className="text-lg sm:text-xl md:text-2xl mb-1">📦</div>
                        <span className="text-xs sm:text-sm font-medium">
                          {t(labelKeyForSlug(category.name))}
                        </span>
                      </div>
                    </div>
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </>
                ) : (
                  // Fallback endast om ingen produkt finns i kategorin
                  <div className={`w-full h-full bg-gradient-to-br ${category.gradient} flex items-center justify-center opacity-60`}>
                    <div className="text-center text-white">
                      <div className="text-lg sm:text-xl md:text-2xl mb-1">🔍</div>
                      <span className="text-xs sm:text-sm font-medium">
                        {t(labelKeyForSlug(category.name))}
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              <span className="mt-3 text-sm sm:text-base font-semibold text-gray-700 text-center group-hover:text-gray-900 transition-colors duration-300">
                {t(labelKeyForSlug(category.name))}
              </span>
              
              {/* Underline effect removed */}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}