import { NextRequest, NextResponse } from 'next/server';

interface VideoGenerationRequest {
  prompt: string;
  model: 'runway-gen3' | 'stable-video' | 'pika-labs' | 'leonardo-motion';
  duration: number;
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:5';
  style: 'cinematic' | 'realistic' | 'animated' | 'professional' | 'creative';
  platform: string;
  quality: 'draft' | 'standard' | 'premium' | 'ultra';
  voiceover?: {
    enabled: boolean;
    voice: string;
    script: string;
    language: string;
  };
  effects?: string[];
  soundtrack?: {
    enabled: boolean;
    mood: string;
    genre: string;
  };
}

async function getTrainingData() {
  try {
    const response = await fetch('http://localhost:3001/api/ai/training-data');
    const data = await response.json();
    return data.brandGuidelines;
  } catch (error) {
    console.error('Failed to fetch training data:', error);
    return null;
  }
}

function enhanceVideoPromptWithTraining(
  originalPrompt: string, 
  brandGuidelines: any, 
  platform: string,
  style: string
) {
  if (!brandGuidelines) return originalPrompt;
  
  let enhancedPrompt = originalPrompt;
  
  // Add brand voice and visual style
  if (brandGuidelines.brandVoice) {
    enhancedPrompt += ` Video style: ${brandGuidelines.brandVoice}`;
  }
  
  // Add tone characteristics for visual storytelling
  if (brandGuidelines.toneCharacteristics?.length > 0) {
    const tones = brandGuidelines.toneCharacteristics.slice(0, 2).join(', ');
    enhancedPrompt += `. Visual tone: ${tones}`;
  }
  
  // Add color palette for video aesthetics
  if (brandGuidelines.colorPalette?.length > 0) {
    const colors = brandGuidelines.colorPalette.slice(0, 3).join(', ');
    enhancedPrompt += `. Color scheme: ${colors}`;
  }
  
  // Add design principles for video composition
  if (brandGuidelines.designPrinciples?.length > 0) {
    const principles = brandGuidelines.designPrinciples.slice(0, 2).join(', ');
    enhancedPrompt += `. Video composition: ${principles}`;
  }
  
  // Platform-specific optimization
  switch (platform) {
    case 'TikTok':
      enhancedPrompt += '. TikTok style: vertical 9:16, dynamic cuts, trending effects, engaging hook in first 3 seconds';
      break;
    case 'Instagram':
      enhancedPrompt += '. Instagram Reels: mobile-optimized, visually striking, story-driven, perfect for feed';
      break;
    case 'YouTube':
      enhancedPrompt += '. YouTube content: cinematic quality, professional lighting, clear narrative structure';
      break;
    case 'LinkedIn':
      enhancedPrompt += '. LinkedIn video: professional, business-focused, thought-leadership style, corporate quality';
      break;
    case 'Facebook':
      enhancedPrompt += '. Facebook video: social-friendly, engaging thumbnails, accessible content';
      break;
  }
  
  // Style-specific enhancements
  switch (style) {
    case 'cinematic':
      enhancedPrompt += '. Cinematic style: dramatic lighting, smooth camera movements, film-quality aesthetics';
      break;
    case 'realistic':
      enhancedPrompt += '. Realistic style: natural lighting, authentic scenarios, documentary feel';
      break;
    case 'animated':
      enhancedPrompt += '. Animated style: vibrant colors, dynamic motion graphics, creative transitions';
      break;
  }
  
  return enhancedPrompt;
}

export async function POST(request: NextRequest) {
  try {
    const body: VideoGenerationRequest = await request.json();
    const { prompt, model, duration, aspectRatio, style, platform, quality, voiceover, effects, soundtrack } = body;
    
    // Get brand training data
    const brandGuidelines = await getTrainingData();
    const enhancedPrompt = enhanceVideoPromptWithTraining(prompt, brandGuidelines, platform, style);
    
    // Simulate different AI model responses
    let videoResult;
    const startTime = Date.now();
    
    switch (model) {
      case 'runway-gen3':
        videoResult = await generateRunwayVideo(enhancedPrompt, duration, aspectRatio, quality);
        break;
      case 'stable-video':
        videoResult = await generateStableVideo(enhancedPrompt, duration, aspectRatio, style);
        break;
      case 'pika-labs':
        videoResult = await generatePikaVideo(enhancedPrompt, duration, aspectRatio, effects || []);
        break;
      case 'leonardo-motion':
        videoResult = await generateLeonardoVideo(enhancedPrompt, duration, aspectRatio, style);
        break;
      default:
        videoResult = await generateRunwayVideo(enhancedPrompt, duration, aspectRatio, quality);
    }
    
    const processingTime = (Date.now() - startTime) / 1000;
    
    // Add voiceover if requested
    let finalResult: any = { ...videoResult };
    if (voiceover?.enabled) {
      finalResult.voiceover = await generateVoiceover(voiceover.script, voiceover.voice, voiceover.language);
    }
    
    // Add soundtrack if requested
    if (soundtrack?.enabled) {
      finalResult.soundtrack = await generateSoundtrack(soundtrack.mood, soundtrack.genre, duration);
    }
    
    const response = {
      id: `video_${Date.now()}`,
      type: 'video',
      url: videoResult.url,
      thumbnail: videoResult.thumbnail,
      prompt: enhancedPrompt,
      originalPrompt: prompt,
      platform,
      model,
      style,
      duration,
      aspectRatio,
      quality,
      generatedAt: new Date().toISOString(),
      metadata: {
        model: model,
        processingTime,
        cost: calculateVideoCost(model, duration, quality),
        brandEnhanced: !!brandGuidelines,
        voiceover: voiceover?.enabled || false,
        soundtrack: soundtrack?.enabled || false,
        effects: effects || [],
        dimensions: getDimensionsFromAspectRatio(aspectRatio),
        fileSize: `${Math.round(duration * 2.5)}MB` // Estimate
      },
      voiceover: finalResult.voiceover,
      soundtrack: finalResult.soundtrack
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Video generation failed:', error);
    return NextResponse.json(
      { error: 'Video generation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function generateRunwayVideo(prompt: string, duration: number, aspectRatio: string, quality: string) {
  // Simulate RunwayML Gen-3 Turbo API
  await new Promise(resolve => setTimeout(resolve, 3000 + duration * 500)); // Realistic processing time
  
  return {
    url: `/api/mock-video/runway_${Date.now()}.mp4`,
    thumbnail: `/api/mock-video/runway_${Date.now()}_thumb.jpg`,
    model: 'Gen-3 Alpha Turbo',
    resolution: quality === 'ultra' ? '4K' : quality === 'premium' ? '1080p' : '720p'
  };
}

async function generateStableVideo(prompt: string, duration: number, aspectRatio: string, style: string) {
  // Simulate Stable Video Diffusion
  await new Promise(resolve => setTimeout(resolve, 4000 + duration * 600));
  
  return {
    url: `/api/mock-video/stable_${Date.now()}.mp4`,
    thumbnail: `/api/mock-video/stable_${Date.now()}_thumb.jpg`,
    model: 'Stable Video Diffusion 1.1',
    resolution: '1024x576'
  };
}

async function generatePikaVideo(prompt: string, duration: number, aspectRatio: string, effects: string[]) {
  // Simulate Pika Labs API
  await new Promise(resolve => setTimeout(resolve, 2500 + duration * 400));
  
  return {
    url: `/api/mock-video/pika_${Date.now()}.mp4`,
    thumbnail: `/api/mock-video/pika_${Date.now()}_thumb.jpg`,
    model: 'Pika 1.0',
    resolution: '1280x720',
    effects: effects || ['motion_blur', 'dynamic_lighting']
  };
}

async function generateLeonardoVideo(prompt: string, duration: number, aspectRatio: string, style: string) {
  // Simulate Leonardo AI Motion
  await new Promise(resolve => setTimeout(resolve, 3500 + duration * 550));
  
  return {
    url: `/api/mock-video/leonardo_${Date.now()}.mp4`,
    thumbnail: `/api/mock-video/leonardo_${Date.now()}_thumb.jpg`,
    model: 'Leonardo Motion',
    resolution: '1920x1080'
  };
}

async function generateVoiceover(script: string, voice: string, language: string) {
  // Simulate voice generation
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    url: `/api/mock-audio/voice_${Date.now()}.mp3`,
    voice,
    language,
    duration: Math.ceil(script.length / 150), // Estimate speaking time
    script
  };
}

async function generateSoundtrack(mood: string, genre: string, duration: number) {
  // Simulate soundtrack generation
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    url: `/api/mock-audio/soundtrack_${Date.now()}.mp3`,
    mood,
    genre,
    duration,
    volume: 0.3 // Background level
  };
}

function calculateVideoCost(model: string, duration: number, quality: string): number {
  const baseCosts: Record<string, number> = {
    'runway-gen3': 0.05,
    'stable-video': 0.03,
    'pika-labs': 0.04,
    'leonardo-motion': 0.045
  };
  
  const qualityMultipliers: Record<string, number> = {
    'draft': 0.7,
    'standard': 1.0,
    'premium': 1.5,
    'ultra': 2.0
  };
  
  return (baseCosts[model] || 0.04) * duration * (qualityMultipliers[quality] || 1.0);
}

function getDimensionsFromAspectRatio(aspectRatio: string): string {
  const dimensions: Record<string, string> = {
    '16:9': '1920x1080',
    '9:16': '1080x1920',
    '1:1': '1080x1080',
    '4:5': '1080x1350'
  };
  
  return dimensions[aspectRatio] || '1920x1080';
}
