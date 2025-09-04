"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Check, Crown, Zap, Users, Brain, BarChart3, MessageCircle, Shield } from "lucide-react"

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: { monthly: 29, yearly: 290 },
    description: "Perfect for individuals and small businesses",
    features: [
      "Up to 3 social accounts",
      "50 posts per month",
      "Basic AI content generation",
      "100 AI credits per month",
      "WhatsApp triggers",
      "Basic analytics",
      "Email support"
    ],
    limitations: ["Limited automation", "Basic templates only"],
    popular: false,
    color: "border-gray-200"
  },
  {
    id: "pro",
    name: "Pro",
    price: { monthly: 79, yearly: 790 },
    description: "Best for growing businesses and agencies",
    features: [
      "Up to 10 social accounts",
      "200 posts per month",
      "Advanced AI content generation",
      "500 AI credits per month",
      "Full WhatsApp automation",
      "Advanced analytics & reports",
      "Competitor analysis",
      "Voice reports with ElevenLabs",
      "Priority support",
      "Custom brand guidelines",
      "Team collaboration"
    ],
    limitations: [],
    popular: true,
    color: "border-orange-500"
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: { monthly: 199, yearly: 1990 },
    description: "For large teams and enterprise solutions",
    features: [
      "Unlimited social accounts",
      "Unlimited posts",
      "Custom AI model training",
      "Unlimited AI credits",
      "Advanced automation workflows",
      "Custom analytics & white-label reports",
      "Dedicated account manager",
      "API access",
      "White-label option",
      "Custom integrations",
      "24/7 phone support",
      "Training & onboarding"
    ],
    limitations: [],
    popular: false,
    color: "border-purple-500"
  }
]

const features = [
  {
    icon: Brain,
    title: "AI-Powered Content Generation",
    description: "Generate engaging captions, hashtags, and content ideas"
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Integration",
    description: "Trigger actions and get updates via WhatsApp"
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Deep insights and performance tracking"
  },
  {
    icon: Zap,
    title: "Automation Workflows",
    description: "Streamline your social media management"
  },
  {
    icon: Users,
    title: "Multi-Account Management",
    description: "Manage multiple clients and accounts"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level security and compliance"
  }
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Digital Marketing Manager",
    company: "TechCorp",
    content: "PostPilot AI has revolutionized our social media strategy. The AI content generation saves us hours every week!",
    avatar: "/diverse-woman-portrait.png"
  },
  {
    name: "Michael Chen",
    role: "Agency Owner",
    company: "Growth Agency",
    content: "Managing 50+ client accounts used to be overwhelming. Now it's seamless with PostPilot AI's automation.",
    avatar: "/thoughtful-man.png"
  },
  {
    name: "Emily Rodriguez",
    role: "Content Creator",
    company: "Freelancer",
    content: "The WhatsApp integration is a game-changer. My clients love the instant updates and approval system.",
    avatar: "/woman-2.png"
  }
]

export default function SubscriptionPage() {
  const [isYearly, setIsYearly] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handleSubscribe = async (planId: string) => {
    try {
      const response = await fetch('/api/subscription/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          userId: 'current-user-id', // Replace with actual user ID
        }),
      })

      const data = await response.json()
      if (data.sessionUrl) {
        window.location.href = data.sessionUrl
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="mb-8">
            <Badge className="bg-orange-100 text-orange-800 border-orange-200">
              <Crown className="w-3 h-3 mr-1" />
              Choose Your Plan
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Supercharge Your Social Media with{" "}
            <span className="text-orange-500">AI</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Join thousands of businesses using PostPilot AI to automate their social media, 
            engage with customers via WhatsApp, and generate content that converts.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`font-medium ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={`font-medium ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Yearly
            </span>
            {isYearly && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Save 20%
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${plan.color} ${
                plan.popular ? 'border-2 shadow-xl scale-105' : 'border'
              } transition-all hover:shadow-lg`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-orange-500 text-white px-4 py-1">
                    <Crown className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    ${isYearly ? plan.price.yearly : plan.price.monthly}
                  </span>
                  <span className="text-muted-foreground">
                    /{isYearly ? 'year' : 'month'}
                  </span>
                  {isYearly && (
                    <div className="text-sm text-green-600 font-medium">
                      Save ${(plan.price.monthly * 12) - plan.price.yearly}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.limitations.length > 0 && (
                  <div className="space-y-2 pt-4 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Limitations
                    </p>
                    {plan.limitations.map((limitation, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        • {limitation}
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  className={`w-full ${
                    plan.popular
                      ? 'bg-orange-500 hover:bg-orange-600'
                      : 'bg-primary hover:bg-primary/90'
                  }`}
                  onClick={() => handleSubscribe(plan.id)}
                >
                  {plan.id === 'enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  {plan.id !== 'enterprise' ? '14-day free trial • No credit card required' : 'Custom pricing available'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-muted/50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to succeed</h2>
            <p className="text-xl text-muted-foreground">
              Powerful features designed to grow your social media presence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Loved by thousands of businesses</h2>
            <p className="text-xl text-muted-foreground">
              See what our customers are saying about PostPilot AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <p className="text-sm mb-4 italic">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-muted/50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="font-semibold mb-2">Can I change plans at any time?</h3>
              <p className="text-muted-foreground">
                Yes! You can upgrade or downgrade your plan at any time. Changes will be prorated automatically.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What happens if I exceed my limits?</h3>
              <p className="text-muted-foreground">
                You'll receive notifications when approaching limits. You can either upgrade your plan or wait for the next billing cycle.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-muted-foreground">
                Yes! All plans come with a 14-day free trial. No credit card required to start.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">How does WhatsApp integration work?</h3>
              <p className="text-muted-foreground">
                Connect your WhatsApp Business account to trigger actions, receive notifications, and approve content directly through WhatsApp messages.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your social media?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of businesses already using PostPilot AI to grow their online presence.
          </p>
          <Button 
            size="lg" 
            className="bg-orange-500 hover:bg-orange-600"
            onClick={() => handleSubscribe('pro')}
          >
            Start Your Free Trial
          </Button>
        </div>
      </div>
    </div>
  )
}
