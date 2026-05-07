import { Product } from './types'
import { getProducts } from './db'
import { cleanText } from './utils'

export interface HeroProduct {
  id: string
  name: string
  description: string
  price: number
  category: string
  inStock: boolean
  imageUrl?: string
  heroTitle?: string
  heroDescription?: string
}

// Function to get featured products for hero section from database
export async function getHeroProducts(): Promise<HeroProduct[]> {
  try {
    const dbProducts = await getProducts()
    
    const availableProducts = dbProducts.filter(product => product.inStock)
    
    if (availableProducts.length === 0) {
      return []
    }
    
    // Ta de första 3 produkterna från databasen
    const selectedProducts: HeroProduct[] = availableProducts.slice(0, 3).map(product => ({
      id: product.id,
      name: cleanText(product.name),
      description: cleanText(product.description),
      price: product.price,
      category: cleanText(product.category),
      inStock: product.inStock,
      imageUrl: product.image || `/product-${product.id}.jpg`,
      heroTitle: cleanText(product.name),
      heroDescription: `${cleanText(product.description)}. Endast ${product.price} USD. Kvalitetsprodukter med snabb leverans.`
    }))
    
    return selectedProducts
  } catch (error) {
    console.error('Fel vid hämtning av hero-produkter från databasen:', error)
    return []
  }
}

// Function to get a single hero product by index
export async function getHeroProductByIndex(index: number): Promise<HeroProduct | null> {
  try {
    const heroProducts = await getHeroProducts()
    return heroProducts[index] || null
  } catch (error) {
    console.error('Fel vid hämtning av hero-produkt med index:', error)
    return null
  }
}
