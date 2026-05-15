'use client'

import { Product } from '@/lib/types'
import { 
  getCollaborativeRecommendations,
  getFrequentlyBoughtTogether 
} from '@/lib/algorithms'
import ProductCard from './ProductCard'

interface SmartRecommendationsProps {
  product: Product
  allProducts: Product[]
  type: 'similar' | 'bundle'
}

export default function SmartRecommendations({ 
  product, 
  allProducts, 
  type 
}: SmartRecommendationsProps) {
  const recommendations = type === 'similar'
    ? getCollaborativeRecommendations(product, allProducts, 6)
    : getFrequentlyBoughtTogether(product, allProducts, 3)

  const title = type === 'similar' 
    ? 'Liknande produkter' 
    : 'Köps ofta tillsammans'

  if (recommendations.length === 0) return null

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
