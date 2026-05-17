import { notFound } from 'next/navigation'
import { getProduct, getProducts, getRelatedProducts } from '@/lib/db'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductDetailPage from '@/components/ProductDetailPage'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ id: string }>
}

// Allow dynamic rendering for products not pre-built at build time
export const dynamicParams = true

// Revalidate product pages every hour
export const revalidate = 3600

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)
  
  if (!product) {
    return { title: 'Produkt hittades inte' }
  }

  return {
    title: `${product.name} - ${product.price} USD`,
    description: product.description,
  }
}

// Pre-build the most common product pages at build time
export async function generateStaticParams() {
  const products = await getProducts(500)
  return products.map((product) => ({ id: product.id }))
}

export default async function ProduktPage({ params }: PageProps) {
  const { id } = await params

  // Run both queries in parallel — cuts load time roughly in half
  const [product, relatedProducts] = await Promise.all([
    getProduct(id),
    getRelatedProducts(id),
  ])

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <ProductDetailPage product={product} relatedProducts={relatedProducts} />
      </main>
      <Footer />
    </div>
  )
}
