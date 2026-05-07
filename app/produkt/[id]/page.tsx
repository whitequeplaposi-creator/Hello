import { notFound } from 'next/navigation'
import { getProduct, getProducts, getRelatedProducts } from '@/lib/db'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductDetailPage from '@/components/ProductDetailPage'
import type { Metadata } from 'next'

interface PageProps {
  params: { id: string }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProduct(params.id)
  
  if (!product) {
    return {
      title: 'Produkt hittades inte',
    }
  }

  return {
    title: `${product.name} - ${product.price} kr`,
    description: product.description,
  }
}

// Generate static params for all products at build time
export async function generateStaticParams() {
  const products = await getProducts()
  
  return products.map((product) => ({
    id: product.id,
  }))
}

export default async function ProduktPage({ params }: PageProps) {
  // Fetch product and related products in parallel for faster loading
  const [product, relatedProductsResult] = await Promise.all([
    getProduct(params.id),
    getProduct(params.id).then(p => p ? getRelatedProducts(params.id, p.category) : [])
  ])

  if (!product) {
    notFound()
  }

  const relatedProducts = relatedProductsResult

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
