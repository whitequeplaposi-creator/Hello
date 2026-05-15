import ClientHomePage from '@/components/ClientHomePage'
import { getProducts } from '@/lib/db'

export default async function Home() {
  const products = await getProducts()

  console.log(`Home page received ${products.length} products`)

  return <ClientHomePage products={products} />
}
