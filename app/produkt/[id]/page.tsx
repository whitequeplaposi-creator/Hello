import { notFound } from 'next/navigation'
import { getProduct, getProducts, getRelatedProducts } from '@/lib/db'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductDetailPage from '@/components/ProductDetailPage'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ id: string }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)
  
  if (!product) {
    return {
      title: 'Produkt hittades inte',
    }
  }

  return {
    title: `${product.name} - ${product.price} USD`,
    description: product.description,
  }
}

// Generate static params for all products at build time
export async function generateStaticParams() {
  // Limit to 50 products to avoid cache size issues during build
  const products = await getProducts(50)
  
  return products.map((product) => ({
    id: product.id,
  }))
}

export default async function ProduktPage({ params }: PageProps) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(id, product.category)

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
