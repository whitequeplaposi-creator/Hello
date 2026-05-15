import { NextRequest, NextResponse } from 'next/server';
import { getCustomerOrders } from '@/lib/customerDb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: customerId } = await params;
    
    // Verifiera att customerId är giltig
    if (!customerId || typeof customerId !== 'string') {
      return NextResponse.json(
        { error: 'Ogiltig kund-ID' },
        { status: 400 }
      );
    }

    const orders = await getCustomerOrders(customerId);

    return NextResponse.json({
      success: true,
      orders
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return NextResponse.json(
      { error: 'Internt serverfel' },
      { status: 500 }
    );
  }
}
