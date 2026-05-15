import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Return static popular searches with English category names
    const popularSearches = [
      'sweater',
      'men',
      'trousers',
      'jacket',
      'dress',
      'cardigan',
      'socks',
      'women'
    ]
    
    return NextResponse.json({ popularSearches })
  } catch (error) {
    console.error('Error in popular searches:', error)
    // Fallback to basic searches
    return NextResponse.json({ 
      popularSearches: ['sweater', 'men', 'trousers', 'jacket'] 
    })
  }
}
