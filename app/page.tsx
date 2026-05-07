import Header from '@/components/Header'
import Hero from '@/components/Hero'
import ProductGrid from '@/components/ProductGrid'
import Footer from '@/components/Footer'
import { getProducts } from '@/lib/db'

export default async function Home() {
  const products = await getProducts()
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Hero products={products} />
      <main className="flex-grow px-2 sm:px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <ProductGrid initialProducts={products} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
