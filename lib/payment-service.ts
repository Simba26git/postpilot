// @ts-ignore - Stripe types will be available after installation
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  features: string[]
  postsLimit: number
  accountsLimit: number
  aiCreditsLimit: number
  stripePriceId: string
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    interval: 'month',
    features: [
      'Up to 3 social accounts',
      '50 posts per month',
      'Basic AI content generation',
      '100 AI credits per month',
      'WhatsApp triggers',
      'Basic analytics'
    ],
    postsLimit: 50,
    accountsLimit: 3,
    aiCreditsLimit: 100,
    stripePriceId: 'price_basic_monthly'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 79,
    interval: 'month',
    features: [
      'Up to 10 social accounts',
      '200 posts per month',
      'Advanced AI content generation',
      '500 AI credits per month',
      'WhatsApp triggers & automation',
      'Advanced analytics & reports',
      'Competitor analysis',
      'Voice reports',
      'Priority support'
    ],
    postsLimit: 200,
    accountsLimit: 10,
    aiCreditsLimit: 500,
    stripePriceId: 'price_pro_monthly'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    interval: 'month',
    features: [
      'Unlimited social accounts',
      'Unlimited posts',
      'Custom AI model training',
      'Unlimited AI credits',
      'Full automation workflows',
      'Custom analytics & reports',
      'White-label option',
      'Dedicated account manager',
      '24/7 priority support'
    ],
    postsLimit: -1, // Unlimited
    accountsLimit: -1, // Unlimited
    aiCreditsLimit: -1, // Unlimited
    stripePriceId: 'price_enterprise_monthly'
  }
]

class PaymentService {
  async createCheckoutSession(planId: string, userId: string, successUrl: string, cancelUrl: string) {
    try {
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId)
      if (!plan) {
        throw new Error('Invalid plan selected')
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: plan.stripePriceId,
            quantity: 1
          }
        ],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        client_reference_id: userId,
        metadata: {
          userId: userId,
          planId: planId
        }
      })

      return session
    } catch (error) {
      console.error('Error creating checkout session:', error)
      throw new Error('Failed to create checkout session')
    }
  }

  async createPortalSession(customerId: string, returnUrl: string) {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl
      })

      return session
    } catch (error) {
      console.error('Error creating portal session:', error)
      throw new Error('Failed to create portal session')
    }
  }

  async handleWebhook(payload: string, signature: string) {
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )

      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutCompleted(event.data.object as any)
          break
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object as any)
          break
        case 'customer.subscription.deleted':
          await this.handleSubscriptionCanceled(event.data.object as any)
          break
        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object as any)
          break
        default:
          console.log(`Unhandled event type: ${event.type}`)
      }

      return { received: true }
    } catch (error) {
      console.error('Error handling webhook:', error)
      throw new Error('Webhook handling failed')
    }
  }

  private async handleCheckoutCompleted(session: any) {
    const { client_reference_id: userId, customer: customerId, subscription: subscriptionId } = session
    const { planId } = session.metadata

    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId)
    if (!plan) return

    // This would update the database - implementing with Prisma
    console.log('Subscription created:', { userId, customerId, subscriptionId, planId })
  }

  private async handleSubscriptionUpdated(subscription: any) {
    // Handle subscription updates
    console.log('Subscription updated:', subscription.id)
  }

  private async handleSubscriptionCanceled(subscription: any) {
    // Handle subscription cancellation
    console.log('Subscription canceled:', subscription.id)
  }

  private async handlePaymentFailed(invoice: any) {
    // Handle failed payments
    console.log('Payment failed for subscription:', invoice.subscription)
  }

  async getSubscriptionDetails(subscriptionId: string) {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      return subscription
    } catch (error) {
      console.error('Error retrieving subscription:', error)
      throw new Error('Failed to retrieve subscription details')
    }
  }

  async cancelSubscription(subscriptionId: string) {
    try {
      const subscription = await stripe.subscriptions.cancel(subscriptionId)
      return subscription
    } catch (error) {
      console.error('Error canceling subscription:', error)
      throw new Error('Failed to cancel subscription')
    }
  }

  async updateSubscription(subscriptionId: string, newPriceId: string) {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      
      const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        items: [{
          id: subscription.items.data[0].id,
          price: newPriceId
        }]
      })

      return updatedSubscription
    } catch (error) {
      console.error('Error updating subscription:', error)
      throw new Error('Failed to update subscription')
    }
  }
}

export default PaymentService
