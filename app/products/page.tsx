import { Suspense } from 'react'
import { getProducts } from '@/lib/db'
import ProductsClient from './ProductsClient'

function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-16 text-center text-gray-600">
      Laddar katalog…
    </div>
  )
}

export default async function ProductsPage() {
  const products = await getProducts()
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsClient products={products} />
    </Suspense>
  )
}
