import { NextRequest, NextResponse } from 'next/server'
import AIContentGenerator from '@/lib/ai-content-generator'

const aiGenerator = new AIContentGenerator()

export async function POST(request: NextRequest) {
  try {
    const { tool, input, platform, tone } = await request.json()

    let result
    
    switch (tool) {
      case 'caption-generator':
        const caption = await aiGenerator.generateCaption(input, platform)
        result = {
          content: caption,
          metadata: { platform, tone }
        }
        break
        
      case 'hashtag-research':
        const hashtags = await aiGenerator.generateHashtags(input, platform, 20)
        result = {
          content: Array.isArray(hashtags) ? hashtags.join(' ') : hashtags,
          metadata: { platform, count: 20 }
        }
        break
        
      case 'content-ideas':
        result = await aiGenerator.generateContentIdeas(input, {
          platform,
          count: 5
        })
        break
        
      case 'audience-insights':
        result = await aiGenerator.analyzeAudience(input, {
          platform
        })
        break
        
      case 'competitor-analysis':
        result = await aiGenerator.analyzeCompetitors(input, {
          platform
        })
        break
        
      case 'optimal-timing':
        result = await aiGenerator.suggestOptimalTiming(input, {
          platform
        })
        break
        
      case 'image-generator':
        result = await aiGenerator.generateImagePrompt(input, {
          platform,
          style: tone
        })
        break
        
      case 'trend-predictor':
        result = await aiGenerator.predictTrends(input, {
          platform,
          timeframe: '30d'
        })
        break
        
      default:
        return NextResponse.json(
          { error: 'Unknown AI tool' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      content: result.content,
      metadata: result.metadata || {}
    })

  } catch (error) {
    console.error('AI generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}
