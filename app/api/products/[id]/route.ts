import { NextResponse } from 'next/server';
import { getProduct } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await getProduct(params.id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Produkt hittades inte' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Kunde inte hämta produkt'
      },
      { status: 500 }
    );
  }
}
