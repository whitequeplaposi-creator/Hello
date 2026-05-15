import { NextResponse } from 'next/server'
import { getProducts } from '@/lib/db'
import { filterProductsByCategory } from '@/lib/categoryGenerator'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    if (!category) {
      return NextResponse.json({ 
        error: 'Category missing',
        products: []
      }, { status: 400 })
    }
    
    // Fetch all products
    const allProducts = await getProducts()
    
    // Filter products based on category (now using English category names)
    const filteredProducts = filterProductsByCategory(
      allProducts.map(p => ({ id: p.id, name: p.name })),
      category
    )
    
    // Get full product information for filtered products
    const productIds = new Set(filteredProducts.map(p => p.id))
    const products = allProducts.filter(p => productIds.has(p.id))
    
    return NextResponse.json({ 
      category,
      products,
      count: products.length
    })
  } catch (error) {
    console.error('Error filtering products by category:', error)
    return NextResponse.json({ 
      error: 'Could not filter products',
      products: []
    }, { status: 500 })
  }
}
