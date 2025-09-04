import { NextRequest, NextResponse } from 'next/server'
import AIContentGenerator from '@/lib/ai-content-generator'

export async function POST(request: NextRequest) {
  try {
    const { analyticsData, competitorData } = await request.json()

    if (!analyticsData) {
      return NextResponse.json(
        { error: 'Analytics data is required' },
        { status: 400 }
      )
    }

    const aiGenerator = new AIContentGenerator()
    const analysis = await aiGenerator.analyzePerformance(analyticsData, competitorData)

    return NextResponse.json({
      analysis,
      success: true
    })
  } catch (error) {
    console.error('Error analyzing performance:', error)
    return NextResponse.json(
      { error: 'Failed to analyze performance' },
      { status: 500 }
    )
  }
}
