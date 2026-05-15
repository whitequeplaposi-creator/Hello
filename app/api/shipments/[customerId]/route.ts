import { NextRequest, NextResponse } from 'next/server';
import { getCustomerShipments } from '@/lib/logisticsDb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {
    const { customerId } = await params;
    
    // Verifiera att customerId är giltig
    if (!customerId || typeof customerId !== 'string') {
      return NextResponse.json(
        { error: 'Ogiltig kund-ID' },
        { status: 400 }
      );
    }

    const shipments = await getCustomerShipments(customerId);

    return NextResponse.json({
      success: true,
      shipments
    });

  } catch (error) {
    console.error('Error fetching shipments:', error);
    return NextResponse.json(
      { error: 'Internt serverfel' },
      { status: 500 }
    );
  }
}
