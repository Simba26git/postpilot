import OpenAI from 'openai'

class AIContentGenerator {
  private openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  }

  async generateCaption(prompt: string, platform: string, brandGuidelines?: any) {
    try {
      const systemPrompt = `You are an expert social media content creator. Generate engaging captions for ${platform}. 
      ${brandGuidelines ? `Follow these brand guidelines: ${JSON.stringify(brandGuidelines)}` : ''}
      
      Guidelines:
      - Keep it engaging and authentic
      - Include relevant hashtags
      - Match the platform's tone (professional for LinkedIn, casual for Instagram, etc.)
      - Include call-to-action when appropriate`

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      })

      return response.choices[0]?.message?.content || ""
    } catch (error) {
      console.error('Error generating caption:', error)
      throw new Error('Failed to generate caption')
    }
  }

  async generateHashtags(content: string, platform: string, count: number = 10) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Generate ${count} relevant hashtags for ${platform} based on the content. Return only hashtags separated by spaces, no other text.`
          },
          { role: "user", content: content }
        ],
        temperature: 0.5,
        max_tokens: 200
      })

      const hashtags = response.choices[0]?.message?.content?.split(' ') || []
      return hashtags.filter(tag => tag.startsWith('#'))
    } catch (error) {
      console.error('Error generating hashtags:', error)
      return []
    }
  }

  async generateImageIdeas(prompt: string) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Generate 3 creative image ideas for social media posts. Be specific about composition, style, and visual elements."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 300
      })

      return response.choices[0]?.message?.content || ""
    } catch (error) {
      console.error('Error generating image ideas:', error)
      throw new Error('Failed to generate image ideas')
    }
  }

  async generateEngagementReply(comment: string, brandTone: string = "friendly") {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Generate a ${brandTone} and professional reply to this social media comment. Keep it brief, authentic, and engaging.`
          },
          { role: "user", content: comment }
        ],
        temperature: 0.7,
        max_tokens: 100
      })

      return response.choices[0]?.message?.content || ""
    } catch (error) {
      console.error('Error generating reply:', error)
      throw new Error('Failed to generate reply')
    }
  }

  async analyzePerformance(analyticsData: any, competitorData?: any) {
    try {
      const dataString = JSON.stringify(analyticsData)
      const competitorString = competitorData ? JSON.stringify(competitorData) : ""

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a social media analytics expert. Analyze the performance data and provide insights, recommendations, and improvement strategies."
          },
          {
            role: "user",
            content: `Analytics Data: ${dataString}${competitorString ? `\n\nCompetitor Data: ${competitorString}` : ""}\n\nProvide detailed analysis and actionable recommendations.`
          }
        ],
        temperature: 0.3,
        max_tokens: 800
      })

      return response.choices[0]?.message?.content || ""
    } catch (error) {
      console.error('Error analyzing performance:', error)
      throw new Error('Failed to analyze performance')
    }
  }

  async generateTrendingContent(trends: string[], platform: string) {
    try {
      const trendsString = trends.join(', ')
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `Generate engaging content ideas for ${platform} based on current trends. Provide 3 different content ideas with captions.`
          },
          {
            role: "user",
            content: `Current trending topics: ${trendsString}`
          }
        ],
        temperature: 0.8,
        max_tokens: 600
      })

      return response.choices[0]?.message?.content || ""
    } catch (error) {
      console.error('Error generating trending content:', error)
      throw new Error('Failed to generate trending content')
    }
  }

  async generateContentIdeas(topic: string, options?: {
    platform?: string
    count?: number
    type?: string
  }) {
    try {
      const prompt = `Generate ${options?.count || 5} creative content ideas about: ${topic}
      
      Requirements:
      - Platform: ${options?.platform || 'general'}
      - Content type: ${options?.type || 'mixed'}
      - Include brief descriptions
      - Make them engaging and shareable
      
      Format as numbered list with brief descriptions.`

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 600,
      })

      return {
        content: completion.choices[0].message.content,
        metadata: { platform: options?.platform, count: options?.count }
      }
    } catch (error) {
      console.error('Error generating content ideas:', error)
      throw new Error('Failed to generate content ideas')
    }
  }

  async analyzeAudience(description: string, options?: {
    platform?: string
  }) {
    try {
      const prompt = `Analyze the target audience for: ${description}
      
      Platform: ${options?.platform || 'general'}
      
      Provide insights on:
      - Demographics
      - Interests
      - Behavior patterns
      - Content preferences
      - Optimal posting times
      - Engagement strategies`

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
      })

      return {
        content: completion.choices[0].message.content,
        metadata: { platform: options?.platform }
      }
    } catch (error) {
      console.error('Error analyzing audience:', error)
      throw new Error('Failed to analyze audience')
    }
  }

  async analyzeCompetitors(industry: string, options?: {
    platform?: string
  }) {
    try {
      const prompt = `Analyze competitor strategies in the ${industry} industry on ${options?.platform || 'social media'}.
      
      Provide insights on:
      - Common content themes
      - Posting frequency
      - Engagement tactics
      - Hashtag strategies
      - Opportunities for differentiation
      - Best practices to adopt`

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
      })

      return {
        content: completion.choices[0].message.content,
        metadata: { platform: options?.platform }
      }
    } catch (error) {
      console.error('Error analyzing competitors:', error)
      throw new Error('Failed to analyze competitors')
    }
  }

  async suggestOptimalTiming(audience: string, options?: {
    platform?: string
  }) {
    try {
      const prompt = `Suggest optimal posting times for ${audience} on ${options?.platform || 'social media'}.
      
      Consider:
      - Audience demographics
      - Platform algorithm preferences
      - Time zones
      - Industry best practices
      - Day of week patterns
      
      Provide specific recommendations with reasoning.`

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 600,
      })

      return {
        content: completion.choices[0].message.content,
        metadata: { platform: options?.platform }
      }
    } catch (error) {
      console.error('Error suggesting optimal timing:', error)
      throw new Error('Failed to suggest optimal timing')
    }
  }

  async generateImagePrompt(description: string, options?: {
    platform?: string
    style?: string
  }) {
    try {
      const prompt = `Create a detailed image generation prompt for: ${description}
      
      Style: ${options?.style || 'professional'}
      Platform: ${options?.platform || 'social media'}
      
      Include:
      - Visual style and composition
      - Color palette
      - Mood and atmosphere
      - Technical specifications
      - Platform-specific requirements`

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 400,
      })

      return {
        content: completion.choices[0].message.content,
        metadata: { platform: options?.platform, style: options?.style }
      }
    } catch (error) {
      console.error('Error generating image prompt:', error)
      throw new Error('Failed to generate image prompt')
    }
  }

  async predictTrends(industry: string, options?: {
    platform?: string
    timeframe?: string
  }) {
    try {
      const prompt = `Predict upcoming trends in ${industry} for ${options?.platform || 'social media'} over the next ${options?.timeframe || '3 months'}.
      
      Consider:
      - Current market patterns
      - Seasonal factors
      - Platform algorithm changes
      - User behavior shifts
      - Industry developments
      
      Provide actionable trend predictions with timing.`

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
      })

      return {
        content: completion.choices[0].message.content,
        metadata: { platform: options?.platform, timeframe: options?.timeframe }
      }
    } catch (error) {
      console.error('Error predicting trends:', error)
      throw new Error('Failed to predict trends')
    }
  }
}

export default AIContentGenerator
