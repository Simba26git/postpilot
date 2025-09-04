// @ts-ignore - Twilio types will be available after installation
import { Twilio } from 'twilio'

export interface WhatsAppMessage {
  from: string
  body: string
  mediaUrl?: string
  timestamp: Date
}

export interface WhatsAppTrigger {
  type: 'post_request' | 'approval' | 'analytics_request' | 'edit_request'
  clientPhone: string
  message: string
  metadata?: any
}

class WhatsAppService {
  private twilio: any
  private whatsappNumber: string

  constructor() {
    this.twilio = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    )
    this.whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886'
  }

  async sendMessage(to: string, message: string, mediaUrl?: string) {
    try {
      const messageData: any = {
        body: message,
        from: this.whatsappNumber,
        to: `whatsapp:${to}`
      }

      if (mediaUrl) {
        messageData.mediaUrl = [mediaUrl]
      }

      const response = await this.twilio.messages.create(messageData)
      return response
    } catch (error) {
      console.error('Error sending WhatsApp message:', error)
      throw new Error('Failed to send WhatsApp message')
    }
  }

  async sendPostApproval(clientPhone: string, postContent: string, postId: string) {
    const message = `🎯 *Post Approval Request*

Content:
${postContent}

Reply with:
✅ APPROVE ${postId} - to approve
❌ REJECT ${postId} - to reject
✏️ EDIT ${postId} [changes] - to request edits`

    return this.sendMessage(clientPhone, message)
  }

  async sendAnalyticsReport(clientPhone: string, reportData: any) {
    const message = `📊 *Weekly Analytics Report*

📈 Engagement: ${reportData.engagement}%
👥 Followers: +${reportData.newFollowers}
❤️ Likes: ${reportData.totalLikes}
💬 Comments: ${reportData.totalComments}
🔄 Shares: ${reportData.totalShares}

Best performing post: "${reportData.topPost}"

Full report: ${reportData.reportUrl}`

    return this.sendMessage(clientPhone, message)
  }

  async sendContentSuggestions(clientPhone: string, suggestions: string[]) {
    const message = `💡 *AI Content Suggestions*

${suggestions.map((suggestion, index) => `${index + 1}. ${suggestion}`).join('\n\n')}

Reply with the number you'd like to use, or ask for more suggestions!`

    return this.sendMessage(clientPhone, message)
  }

  parseIncomingMessage(message: WhatsAppMessage): WhatsAppTrigger | null {
    const body = message.body.toLowerCase().trim()

    // Post approval responses
    if (body.includes('approve')) {
      const postId = this.extractPostId(body)
      return {
        type: 'approval',
        clientPhone: message.from,
        message: body,
        metadata: { action: 'approve', postId }
      }
    }

    if (body.includes('reject')) {
      const postId = this.extractPostId(body)
      return {
        type: 'approval',
        clientPhone: message.from,
        message: body,
        metadata: { action: 'reject', postId }
      }
    }

    if (body.includes('edit')) {
      const postId = this.extractPostId(body)
      const editInstructions = body.replace(/edit\s+\w+/i, '').trim()
      return {
        type: 'edit_request',
        clientPhone: message.from,
        message: body,
        metadata: { postId, instructions: editInstructions }
      }
    }

    // Content requests
    if (body.includes('post') || body.includes('content') || body.includes('create')) {
      return {
        type: 'post_request',
        clientPhone: message.from,
        message: body
      }
    }

    // Analytics requests
    if (body.includes('analytics') || body.includes('report') || body.includes('stats')) {
      return {
        type: 'analytics_request',
        clientPhone: message.from,
        message: body
      }
    }

    return null
  }

  private extractPostId(message: string): string {
    const match = message.match(/\b([a-zA-Z0-9]{8,})\b/)
    return match ? match[1] : ''
  }

  async sendVoiceMessage(clientPhone: string, audioUrl: string, caption?: string) {
    try {
      const messageData: any = {
        from: this.whatsappNumber,
        to: `whatsapp:${clientPhone}`,
        mediaUrl: [audioUrl]
      }

      if (caption) {
        messageData.body = caption
      }

      const response = await this.twilio.messages.create(messageData)
      return response
    } catch (error) {
      console.error('Error sending WhatsApp voice message:', error)
      throw new Error('Failed to send WhatsApp voice message')
    }
  }

  async notifySubscriptionExpiry(clientPhone: string, daysLeft: number) {
    const message = `⚠️ *Subscription Reminder*

Your PostPilot AI subscription expires in ${daysLeft} days.

To continue enjoying uninterrupted service, please renew your subscription:
${process.env.APP_URL}/subscription

Need help? Just reply to this message!`

    return this.sendMessage(clientPhone, message)
  }
}

export default WhatsAppService
