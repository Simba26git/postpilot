// @ts-ignore - ElevenLabs types will be available after installation
import { ElevenLabsApi } from 'elevenlabs'

class VoiceService {
  private elevenlabs: any

  constructor() {
    this.elevenlabs = new ElevenLabsApi({
      apiKey: process.env.ELEVENLABS_API_KEY
    })
  }

  async generateVoiceReport(text: string, voiceId: string = "21m00Tcm4TlvDq8ikWAM"): Promise<Buffer> {
    try {
      const response = await this.elevenlabs.textToSpeech.convert({
        voice_id: voiceId,
        text: text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      })

      // Convert response to buffer
      const chunks: any[] = []
      for await (const chunk of response) {
        chunks.push(chunk)
      }
      
      return Buffer.concat(chunks)
    } catch (error) {
      console.error('Error generating voice:', error)
      throw new Error('Failed to generate voice report')
    }
  }

  async generateAnalyticsVoiceReport(analyticsData: any): Promise<Buffer> {
    const reportText = `
    Weekly Analytics Report:
    
    Your social media performance this week shows ${analyticsData.engagement}% engagement rate.
    You gained ${analyticsData.newFollowers} new followers.
    Your posts received ${analyticsData.totalLikes} likes, ${analyticsData.totalComments} comments, and ${analyticsData.totalShares} shares.
    
    Your best performing post was: "${analyticsData.topPost}".
    
    ${analyticsData.insights || 'Keep up the great work!'}
    `

    return this.generateVoiceReport(reportText)
  }

  async generateClientBrief(briefContent: string): Promise<Buffer> {
    const briefText = `
    Client Brief:
    
    ${briefContent}
    
    This brief has been prepared by your PostPilot AI assistant. Please review and let us know if you need any adjustments.
    `

    return this.generateVoiceReport(briefText)
  }

  async generateContentSuggestionVoice(suggestions: string[]): Promise<Buffer> {
    const suggestionText = `
    Here are your AI-generated content suggestions:
    
    ${suggestions.map((suggestion, index) => `Suggestion ${index + 1}: ${suggestion}`).join('\n\n')}
    
    These suggestions are based on current trends and your brand guidelines. Let me know which one you'd like to develop further.
    `

    return this.generateVoiceReport(suggestionText)
  }

  async getAvailableVoices() {
    try {
      const response = await this.elevenlabs.voices.getAll()
      return response.voices
    } catch (error) {
      console.error('Error fetching voices:', error)
      throw new Error('Failed to fetch available voices')
    }
  }

  async createCustomVoice(name: string, audioFiles: Buffer[]) {
    try {
      // This would be implemented based on ElevenLabs voice cloning API
      const response = await this.elevenlabs.voices.create({
        name: name,
        files: audioFiles,
        description: `Custom voice for ${name}`
      })
      return response
    } catch (error) {
      console.error('Error creating custom voice:', error)
      throw new Error('Failed to create custom voice')
    }
  }
}

export default VoiceService
