// AI Content Generation and Scheduling Services

export interface ContentGenerationOptions {
  type: 'flyer' | 'video' | 'image' | 'carousel' | 'story' | 'reel';
  platform: string;
  prompt: string;
  style?: string;
  dimensions?: string;
  duration?: number; // for videos
  brand?: {
    colors: string[];
    fonts: string[];
    logo: string;
  };
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:5';
  voiceover?: {
    enabled: boolean;
    voice: string;
    script: string;
    language: string;
  };
  quality?: 'draft' | 'standard' | 'premium' | 'ultra';
  model?: string;
}

export interface VoiceGenerationOptions {
  text: string;
  voice: string;
  language: string;
  style?: 'natural' | 'professional' | 'conversational' | 'energetic' | 'calm' | 'authoritative';
  speed?: number;
  pitch?: number;
  emotion?: 'neutral' | 'happy' | 'sad' | 'excited' | 'confident' | 'friendly';
  outputFormat?: 'mp3' | 'wav' | 'ogg';
  quality?: 'standard' | 'premium' | 'studio';
  backgroundMusic?: {
    enabled: boolean;
    type: 'corporate' | 'upbeat' | 'calm' | 'cinematic' | 'none';
    volume: number;
  };
}

export interface CanvaDesignOptions {
  type: 'social-post' | 'story' | 'flyer' | 'logo' | 'banner' | 'presentation' | 'poster' | 'brochure';
  platform: string;
  prompt: string;
  dimensions?: string;
  style: 'professional' | 'creative' | 'minimalist' | 'bold' | 'elegant' | 'playful';
  colorScheme?: string[];
  animation?: boolean;
  elements?: {
    text?: {
      headline: string;
      subtext?: string;
      callToAction?: string;
    };
    images?: string[];
    logo?: string;
    brandColors?: string[];
  };
}

export interface AIControllerOptions {
  action: string;
  parameters?: any;
  automation_level?: 'minimal' | 'moderate' | 'aggressive' | 'autonomous';
  schedule?: {
    enabled: boolean;
    frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
    time?: string;
    timezone?: string;
  };
}

export interface SchedulingAnalysis {
  optimalTime: string;
  confidence: number;
  reasoning: string;
  engagementPrediction: number;
  bestDays: string[];
  platformOptimization: {
    platform: string;
    bestTime: string;
    expectedReach: number;
  }[];
}

export interface AIGeneratedContent {
  id: string;
  type: ContentGenerationOptions['type'];
  url: string;
  prompt: string;
  platform: string;
  generatedAt: string;
  metadata: {
    model: string;
    processingTime: number;
    cost: number;
  };
}

export class AIContentService {
  private static readonly API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api';

  // OpenAI-powered content generation for posts and captions
  static async generatePostContent(options: {
    platform: string;
    type: 'caption' | 'hashtags' | 'full_post' | 'story_text';
    topic: string;
    tone?: 'professional' | 'casual' | 'funny' | 'inspirational' | 'promotional';
    length?: 'short' | 'medium' | 'long';
    includeHashtags?: boolean;
    includeEmojis?: boolean;
  }): Promise<{ content: string; hashtags?: string[]; suggestions?: string[] }> {
    try {
      const response = await fetch(`${this.API_BASE}/ai/test-openai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: this.buildContentPrompt(options),
          model: 'gpt-3.5-turbo',
          max_tokens: options.length === 'short' ? 100 : options.length === 'medium' ? 200 : 300
        })
      });
      
      if (!response.ok) throw new Error('Content generation failed');
      
      const result = await response.json();
      const content = result.response;
      
      // Parse hashtags if requested
      const hashtags = options.includeHashtags ? this.extractHashtags(content) : [];
      
      return {
        content: content,
        hashtags: hashtags,
        suggestions: [
          'Try adding more emojis for engagement',
          'Consider posting during peak hours',
          'Include a call-to-action'
        ]
      };
    } catch (error) {
      console.error('Content generation failed:', error);
      // Return fallback content
      return {
        content: `Check out this amazing ${options.topic} content! ${options.includeEmojis ? '✨🔥' : ''}`,
        hashtags: options.includeHashtags ? [`#${options.topic.replace(/\s+/g, '')}`] : [],
        suggestions: ['OpenAI API quota exceeded - using fallback content']
      };
    }
  }

  private static buildContentPrompt(options: any): string {
    const toneMap: Record<string, string> = {
      professional: 'professional and authoritative',
      casual: 'casual and friendly',
      funny: 'humorous and entertaining',
      inspirational: 'motivational and uplifting',
      promotional: 'promotional but not pushy'
    };

    let prompt = `Create a ${options.type} for ${options.platform} about ${options.topic}. `;
    prompt += `The tone should be ${toneMap[options.tone] || 'engaging'}. `;
    prompt += `Length should be ${options.length || 'medium'}. `;
    
    if (options.includeHashtags) {
      prompt += 'Include relevant hashtags. ';
    }
    
    if (options.includeEmojis) {
      prompt += 'Use appropriate emojis to make it engaging. ';
    }
    
    prompt += `Make it optimized for ${options.platform} audience.`;
    
    return prompt;
  }

  private static extractHashtags(content: string): string[] {
    const hashtagRegex = /#[\w]+/g;
    const matches = content.match(hashtagRegex);
    return matches ? matches.slice(0, 10) : []; // Limit to 10 hashtags
  }

  // Enhanced video generation with multiple AI models
  static async generateVideo(options: ContentGenerationOptions): Promise<AIGeneratedContent> {
    try {
      const response = await fetch(`${this.API_BASE}/ai/video-generation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: options.prompt,
          model: options.model || 'runway-gen3',
          duration: options.duration || 10,
          aspectRatio: options.aspectRatio || (options.platform === 'tiktok' ? '9:16' : '16:9'),
          style: options.style || 'cinematic',
          platform: options.platform,
          quality: options.quality || 'standard',
          voiceover: options.voiceover,
          effects: ['motion_blur', 'dynamic_lighting'],
          soundtrack: {
            enabled: true,
            mood: 'upbeat',
            genre: 'corporate'
          }
        })
      });
      
      if (!response.ok) throw new Error('Video generation failed');
      return await response.json();
    } catch (error) {
      console.error('Video generation failed:', error);
      throw error;
    }
  }

  // DALL-E 3 for high-quality images and flyers
  static async generateImage(options: ContentGenerationOptions): Promise<AIGeneratedContent> {
    try {
      const response = await fetch(`${this.API_BASE}/ai/generate-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: options.prompt,
          size: options.dimensions || '1024x1024',
          style: options.style || 'vivid',
          quality: 'hd',
          platform: options.platform
        })
      });
      
      if (!response.ok) throw new Error('Image generation failed');
      return await response.json();
    } catch (error) {
      console.error('Image generation failed:', error);
      throw error;
    }
  }

  // Enhanced Canva API for professional designs
  static async generateFlyer(options: ContentGenerationOptions): Promise<AIGeneratedContent> {
    try {
      const response = await fetch(`${this.API_BASE}/ai/canva-design`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'flyer',
          platform: options.platform,
          prompt: options.prompt,
          style: options.style || 'professional',
          dimensions: options.dimensions || '8.5x11in',
          animation: false,
          elements: {
            text: {
              headline: options.prompt.split(' ').slice(0, 4).join(' '),
              callToAction: 'Learn More'
            }
          }
        })
      });
      
      if (!response.ok) throw new Error('Flyer generation failed');
      return await response.json();
    } catch (error) {
      console.error('Flyer generation failed:', error);
      throw error;
    }
  }

  // Generate human-like voiceovers
  static async generateVoiceover(options: VoiceGenerationOptions): Promise<any> {
    try {
      const response = await fetch(`${this.API_BASE}/ai/voice-generation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options)
      });
      
      if (!response.ok) throw new Error('Voice generation failed');
      return await response.json();
    } catch (error) {
      console.error('Voice generation failed:', error);
      throw error;
    }
  }

  // Generate Canva designs
  static async generateCanvaDesign(options: CanvaDesignOptions): Promise<any> {
    try {
      const response = await fetch(`${this.API_BASE}/ai/canva-design`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options)
      });
      
      if (!response.ok) throw new Error('Canva design generation failed');
      return await response.json();
    } catch (error) {
      console.error('Canva design generation failed:', error);
      throw error;
    }
  }

  // Master AI Controller for automation
  static async executeAIAction(options: AIControllerOptions): Promise<any> {
    try {
      const response = await fetch(`${this.API_BASE}/ai/master-controller`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options)
      });
      
      if (!response.ok) throw new Error('AI Controller action failed');
      return await response.json();
    } catch (error) {
      console.error('AI Controller action failed:', error);
      throw error;
    }
  }

  // Get available AI capabilities
  static async getAICapabilities(): Promise<any> {
    try {
      const response = await fetch(`${this.API_BASE}/ai/master-controller`);
      if (!response.ok) throw new Error('Failed to get AI capabilities');
      return await response.json();
    } catch (error) {
      console.error('Failed to get AI capabilities:', error);
      throw error;
    }
  }

  // Get available voice models
  static async getVoiceModels(): Promise<any> {
    try {
      const response = await fetch(`${this.API_BASE}/ai/voice-generation`);
      if (!response.ok) throw new Error('Failed to get voice models');
      return await response.json();
    } catch (error) {
      console.error('Failed to get voice models:', error);
      throw error;
    }
  }

  // Stable Video Diffusion for advanced video content
  static async generateAdvancedVideo(options: ContentGenerationOptions): Promise<AIGeneratedContent> {
    try {
      const response = await fetch(`${this.API_BASE}/ai/generate-advanced-video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: options.prompt,
          style: options.style || 'cinematic',
          duration: options.duration || 15,
          fps: 24,
          resolution: options.platform === 'youtube' ? '1920x1080' : '1080x1350'
        })
      });
      
      if (!response.ok) throw new Error('Advanced video generation failed');
      return await response.json();
    } catch (error) {
      console.error('Advanced video generation failed:', error);
      throw error;
    }
  }

  // Leonardo AI for professional design content
  static async generateDesign(options: ContentGenerationOptions): Promise<AIGeneratedContent> {
    try {
      const response = await fetch(`${this.API_BASE}/ai/generate-design`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: options.prompt,
          model_id: 'leonardo-creative',
          num_images: 1,
          width: parseInt(options.dimensions?.split('x')[0] || '1024'),
          height: parseInt(options.dimensions?.split('x')[1] || '1024'),
          guidance_scale: 7,
          platform: options.platform
        })
      });
      
      if (!response.ok) throw new Error('Design generation failed');
      return await response.json();
    } catch (error) {
      console.error('Design generation failed:', error);
      throw error;
    }
  }
}

export class AISchedulingService {
  private static readonly API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api';

  // Analyze optimal posting times using AI
  static async analyzeOptimalScheduling(
    content: any,
    platform: string,
    userTimezone: string = 'UTC'
  ): Promise<SchedulingAnalysis> {
    try {
      const response = await fetch(`${this.API_BASE}/ai/analyze-scheduling`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content_type: content.type,
          platform,
          user_timezone: userTimezone,
          historical_data: true,
          audience_analysis: true,
          content_description: content.caption || content.prompt
        })
      });
      
      if (!response.ok) throw new Error('Scheduling analysis failed');
      return await response.json();
    } catch (error) {
      console.error('Scheduling analysis failed:', error);
      throw error;
    }
  }

  // Get platform-specific insights
  static async getPlatformInsights(platform: string): Promise<any> {
    try {
      const response = await fetch(`${this.API_BASE}/ai/platform-insights/${platform}`);
      if (!response.ok) throw new Error('Platform insights failed');
      return await response.json();
    } catch (error) {
      console.error('Platform insights failed:', error);
      throw error;
    }
  }

  // Auto-schedule content based on AI recommendations
  static async autoScheduleContent(
    content: any,
    platforms: string[],
    userPreferences: any = {}
  ): Promise<any> {
    try {
      const response = await fetch(`${this.API_BASE}/ai/auto-schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          platforms,
          user_preferences: userPreferences,
          optimization_goal: 'engagement' // or 'reach', 'clicks'
        })
      });
      
      if (!response.ok) throw new Error('Auto-scheduling failed');
      return await response.json();
    } catch (error) {
      console.error('Auto-scheduling failed:', error);
      throw error;
    }
  }
}

// Content upload and processing service
export class ContentUploadService {
  private static readonly API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api';

  static async uploadAndAnalyze(file: File, platform?: string): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (platform) formData.append('platform', platform);

      const response = await fetch(`${this.API_BASE}/content/upload-analyze`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) throw new Error('Upload and analysis failed');
      return await response.json();
    } catch (error) {
      console.error('Upload and analysis failed:', error);
      throw error;
    }
  }

  static async optimizeForPlatform(content: any, platform: string): Promise<any> {
    try {
      const response = await fetch(`${this.API_BASE}/content/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          platform,
          auto_resize: true,
          auto_caption: true
        })
      });
      
      if (!response.ok) throw new Error('Content optimization failed');
      return await response.json();
    } catch (error) {
      console.error('Content optimization failed:', error);
      throw error;
    }
  }
}
