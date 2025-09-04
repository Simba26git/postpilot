import { NextRequest, NextResponse } from 'next/server'
import WhatsAppService from '@/lib/whatsapp-service'
import AIContentGenerator from '@/lib/ai-content-generator'
// import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { Body, From, To } = await request.json()

    const whatsappService = new WhatsAppService()
    const aiGenerator = new AIContentGenerator()

    const message = {
      from: From,
      body: Body,
      timestamp: new Date()
    }

    const trigger = whatsappService.parseIncomingMessage(message)

    if (!trigger) {
      await whatsappService.sendMessage(
        From.replace('whatsapp:', ''),
        "👋 Hi! I'm your PostPilot AI assistant. I can help you with:\n\n📝 Create posts\n📊 Get analytics\n✅ Approve content\n\nJust tell me what you need!"
      )
      return NextResponse.json({ success: true })
    }

    // Store the trigger in database
    // await prisma.whatsAppTrigger.create({
    //   data: {
    //     userId: 'user-id', // Get from phone number lookup
    //     phoneNumber: From.replace('whatsapp:', ''),
    //     message: Body,
    //     triggerType: trigger.type,
    //     metadata: trigger.metadata
    //   }
    // })

    // Process different trigger types
    switch (trigger.type) {
      case 'post_request':
        await handlePostRequest(trigger, whatsappService, aiGenerator)
        break
      case 'approval':
        await handleApproval(trigger, whatsappService)
        break
      case 'analytics_request':
        await handleAnalyticsRequest(trigger, whatsappService)
        break
      case 'edit_request':
        await handleEditRequest(trigger, whatsappService, aiGenerator)
        break
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing WhatsApp webhook:', error)
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}

async function handlePostRequest(trigger: any, whatsappService: WhatsAppService, aiGenerator: AIContentGenerator) {
  const phoneNumber = trigger.clientPhone.replace('whatsapp:', '')
  
  try {
    // Generate content based on the request
    const caption = await aiGenerator.generateCaption(trigger.message, 'Instagram')
    const hashtags = await aiGenerator.generateHashtags(caption, 'Instagram')
    
    const fullContent = `${caption}\n\n${hashtags.join(' ')}`
    
    // Send for approval
    const postId = generatePostId()
    await whatsappService.sendPostApproval(phoneNumber, fullContent, postId)
    
  } catch (error) {
    await whatsappService.sendMessage(
      phoneNumber,
      "❌ Sorry, I encountered an error generating your content. Please try again."
    )
  }
}

async function handleApproval(trigger: any, whatsappService: WhatsAppService) {
  const phoneNumber = trigger.clientPhone.replace('whatsapp:', '')
  const { action, postId } = trigger.metadata
  
  if (action === 'approve') {
    // Schedule or publish the post
    await whatsappService.sendMessage(
      phoneNumber,
      `✅ Great! Post ${postId} has been approved and scheduled. You'll receive a confirmation once it's published.`
    )
  } else if (action === 'reject') {
    await whatsappService.sendMessage(
      phoneNumber,
      `❌ Post ${postId} has been rejected. Would you like me to generate new content?`
    )
  }
}

async function handleAnalyticsRequest(trigger: any, whatsappService: WhatsAppService) {
  const phoneNumber = trigger.clientPhone.replace('whatsapp:', '')
  
  // Mock analytics data - replace with real data from database
  const analyticsData = {
    engagement: 85,
    newFollowers: 156,
    totalLikes: 2340,
    totalComments: 89,
    totalShares: 45,
    topPost: "Summer vibes and good times! 🌞",
    reportUrl: `${process.env.APP_URL}/analytics/weekly-report`
  }
  
  await whatsappService.sendAnalyticsReport(phoneNumber, analyticsData)
}

async function handleEditRequest(trigger: any, whatsappService: WhatsAppService, aiGenerator: AIContentGenerator) {
  const phoneNumber = trigger.clientPhone.replace('whatsapp:', '')
  const { postId, instructions } = trigger.metadata
  
  try {
    // Generate revised content based on edit instructions
    const revisedCaption = await aiGenerator.generateCaption(
      `Revise this content based on these instructions: ${instructions}`,
      'Instagram'
    )
    
    await whatsappService.sendPostApproval(phoneNumber, revisedCaption, postId)
    
  } catch (error) {
    await whatsappService.sendMessage(
      phoneNumber,
      "❌ Sorry, I couldn't process your edit request. Please try again."
    )
  }
}

function generatePostId(): string {
  return Math.random().toString(36).substring(2, 15)
}
