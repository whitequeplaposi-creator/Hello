import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    return NextResponse.json({
      success: true,
      received: {
        hasCustomerId: !!body.customerId,
        hasCustomerData: !!body.customerData,
        hasOrderData: !!body.orderData,
        customerData: body.customerData,
        orderData: body.orderData
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    });
  }
}
