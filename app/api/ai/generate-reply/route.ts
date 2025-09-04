import { NextRequest, NextResponse } from 'next/server'
import AIContentGenerator from '@/lib/ai-content-generator'

export async function POST(request: NextRequest) {
  try {
    const { comment, brandTone } = await request.json()

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment is required' },
        { status: 400 }
      )
    }

    const aiGenerator = new AIContentGenerator()
    const reply = await aiGenerator.generateEngagementReply(comment, brandTone)

    return NextResponse.json({
      reply,
      success: true
    })
  } catch (error) {
    console.error('Error generating reply:', error)
    return NextResponse.json(
      { error: 'Failed to generate reply' },
      { status: 500 }
    )
  }
}
