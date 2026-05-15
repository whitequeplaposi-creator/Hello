/**
 * POST /api/user-events
 * Tar emot produktinteraktioner från klienten och sparar dem i databasen.
 * Kräver att användaren är inloggad (customer_id skickas i body).
 */

import { NextResponse } from 'next/server'
import { trackUserEvent, type EventType } from '@/lib/userBehaviorDb'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      customerId,
      productId,
      eventType,
      productCategory,
      productPrice,
      productColors,
      productSizes,
      sessionId,
      durationSeconds,
    } = body

    // Validering
    if (!customerId || typeof customerId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'customerId krävs' },
        { status: 400 }
      )
    }

    if (!productId || typeof productId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'productId krävs' },
        { status: 400 }
      )
    }

    const validEventTypes: EventType[] = [
      'view',
      'click',
      'add_to_cart',
      'remove_from_cart',
      'purchase',
      'wishlist',
      'share',
    ]

    if (!validEventTypes.includes(eventType)) {
      return NextResponse.json(
        { success: false, error: `Ogiltigt eventType: ${eventType}` },
        { status: 400 }
      )
    }

    await trackUserEvent({
      customerId,
      productId,
      eventType,
      productCategory,
      productPrice,
      productColors,
      productSizes,
      sessionId,
      durationSeconds,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[/api/user-events] POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Internt serverfel' },
      { status: 500 }
    )
  }
}
