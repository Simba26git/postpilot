import { NextRequest, NextResponse } from 'next/server'
import PaymentService from '@/lib/payment-service'

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('stripe-signature')
    const body = await request.text()

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      )
    }

    const paymentService = new PaymentService()
    const result = await paymentService.handleWebhook(body, signature)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error handling webhook:', error)
    return NextResponse.json(
      { error: 'Webhook handling failed' },
      { status: 400 }
    )
  }
}
