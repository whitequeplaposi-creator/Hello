import { NextResponse } from 'next/server'
import { getProducts } from '@/lib/db'
import { generateCategoriesFromProducts } from '@/lib/categoryGenerator'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lang = searchParams.get('lang') as 'sv' | 'en' || 'en'
    void lang // lang parameter reserved for future use
    
    // Fetch all products from database
    const products = await getProducts()
    
    // Extract product names
    const productNames = products.map(p => p.name).filter(name => name && name.length > 0)
    
    // Generate categories based on product names (now in English)
    const generatedCategories = generateCategoriesFromProducts(productNames)
    
    // Return category names (always in English)
    const categories = generatedCategories.map(cat => cat.name)
    
    return NextResponse.json({ 
      categories: categories,
      // Extra metadata for debugging (optional)
      metadata: {
        totalProducts: products.length,
        categoriesGenerated: generatedCategories.length,
        language: 'en',
        details: generatedCategories.map(cat => ({
          ...cat,
          originalName: cat.name
        }))
      }
    })
  } catch (error) {
    console.error('Error generating categories:', error)
    return NextResponse.json({ 
      categories: [],
      error: 'Could not generate categories'
    }, { status: 500 })
  }
}
