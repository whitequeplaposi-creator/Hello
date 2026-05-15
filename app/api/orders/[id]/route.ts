import { NextRequest, NextResponse } from 'next/server';
import { getOrder, getOrderItems, updateOrderStatus } from '@/lib/customerDb';
import client from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    
    const order = await getOrder(orderId);
    if (!order) {
      return NextResponse.json(
        { error: 'Beställning hittades inte' },
        { status: 404 }
      );
    }

    const items = await getOrderItems(orderId);

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        items
      }
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Internt serverfel' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    const body = await request.json();
    const { status, paymentStatus, estimatedDeliveryDate, actualDeliveryDate } = body;

    // Update order status
    if (status) {
      await updateOrderStatus(orderId, status, paymentStatus);
    }

    // Update shipment delivery dates if provided
    if (estimatedDeliveryDate || actualDeliveryDate) {
      try {
        const updates = [];
        const values = [];

        if (estimatedDeliveryDate) {
          updates.push('estimated_delivery_date = ?');
          values.push(estimatedDeliveryDate);
        }
        if (actualDeliveryDate) {
          updates.push('actual_delivery_date = ?');
          values.push(actualDeliveryDate);
        }

        if (updates.length > 0) {
          updates.push('updated_at = ?');
          values.push(new Date().toISOString());
          values.push(orderId);

          await client.execute({
            sql: `UPDATE shipments SET ${updates.join(', ')} WHERE order_id = ?`,
            args: values
          });
        }
      } catch (shipmentError) {
        console.error('Error updating shipment:', shipmentError);
      }
    }

    // Fetch updated order
    const order = await getOrder(orderId);
    const items = await getOrderItems(orderId);

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        items
      }
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Internt serverfel' },
      { status: 500 }
    );
  }
}
