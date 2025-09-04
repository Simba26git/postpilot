import { NextRequest, NextResponse } from 'next/server'
import AIContentGenerator from '@/lib/ai-content-generator'

export async function POST(request: NextRequest) {
  try {
    const { prompt, platform, brandGuidelines } = await request.json()

    if (!prompt || !platform) {
      return NextResponse.json(
        { error: 'Prompt and platform are required' },
        { status: 400 }
      )
    }

    const aiGenerator = new AIContentGenerator()
    const caption = await aiGenerator.generateCaption(prompt, platform, brandGuidelines)
    const hashtags = await aiGenerator.generateHashtags(caption, platform)

    return NextResponse.json({
      caption,
      hashtags,
      success: true
    })
  } catch (error) {
    console.error('Error generating content:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}
