import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const refresh = searchParams.get('refresh') === 'true';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    
    // Om refresh är true, hämta alltid nya produkter från databasen
    const products = await getProducts(limit);
    
    const response = NextResponse.json({
      success: true,
      products,
      count: products.length,
      timestamp: Date.now()
    });
    
    // Om refresh är aktiverat, sätt headers för att undvika caching
    if (refresh) {
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
    }
    
    return response;
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Kunde inte hämta produkter',
        products: []
      },
      { status: 500 }
    );
  }
}
