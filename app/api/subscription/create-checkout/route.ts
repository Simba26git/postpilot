import { NextRequest, NextResponse } from 'next/server'
import PaymentService from '@/lib/payment-service'

export async function POST(request: NextRequest) {
  try {
    const { planId, userId } = await request.json()

    if (!planId || !userId) {
      return NextResponse.json(
        { error: 'Plan ID and User ID are required' },
        { status: 400 }
      )
    }

    const paymentService = new PaymentService()
    const session = await paymentService.createCheckoutSession(
      planId,
      userId,
      `${process.env.APP_URL}/subscription/success`,
      `${process.env.APP_URL}/subscription/cancel`
    )

    return NextResponse.json({
      sessionUrl: session.url,
      success: true
    })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
