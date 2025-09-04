import { NextRequest, NextResponse } from 'next/server';

interface VoiceGenerationRequest {
  text: string;
  voice: string;
  language: string;
  style?: 'natural' | 'professional' | 'conversational' | 'energetic' | 'calm' | 'authoritative';
  speed?: number; // 0.5 to 2.0
  pitch?: number; // -20 to +20
  emotion?: 'neutral' | 'happy' | 'sad' | 'excited' | 'confident' | 'friendly';
  outputFormat?: 'mp3' | 'wav' | 'ogg';
  quality?: 'standard' | 'premium' | 'studio';
  backgroundMusic?: {
    enabled: boolean;
    type: 'corporate' | 'upbeat' | 'calm' | 'cinematic' | 'none';
    volume: number; // 0.0 to 1.0
  };
  effects?: {
    reverb?: number; // 0.0 to 1.0
    echo?: number; // 0.0 to 1.0
    noise_reduction?: boolean;
    normalization?: boolean;
  };
}

// Available voice models from different providers
const VOICE_MODELS = {
  // ElevenLabs voices
  elevenlabs: {
    'rachel': { name: 'Rachel', gender: 'female', accent: 'American', age: 'young_adult' },
    'drew': { name: 'Drew', gender: 'male', accent: 'American', age: 'middle_aged' },
    'clyde': { name: 'Clyde', gender: 'male', accent: 'American', age: 'middle_aged' },
    'paul': { name: 'Paul', gender: 'male', accent: 'American', age: 'middle_aged' },
    'domi': { name: 'Domi', gender: 'female', accent: 'American', age: 'young_adult' },
    'dave': { name: 'Dave', gender: 'male', accent: 'British', age: 'young_adult' },
    'fin': { name: 'Fin', gender: 'male', accent: 'Irish', age: 'old' },
    'sarah': { name: 'Sarah', gender: 'female', accent: 'American', age: 'young_adult' },
    'antoni': { name: 'Antoni', gender: 'male', accent: 'American', age: 'young_adult' },
    'thomas': { name: 'Thomas', gender: 'male', accent: 'American', age: 'young_adult' }
  },
  // OpenAI TTS voices
  openai: {
    'alloy': { name: 'Alloy', gender: 'neutral', accent: 'American', age: 'young_adult' },
    'echo': { name: 'Echo', gender: 'male', accent: 'American', age: 'middle_aged' },
    'fable': { name: 'Fable', gender: 'male', accent: 'British', age: 'young_adult' },
    'onyx': { name: 'Onyx', gender: 'male', accent: 'American', age: 'middle_aged' },
    'nova': { name: 'Nova', gender: 'female', accent: 'American', age: 'young_adult' },
    'shimmer': { name: 'Shimmer', gender: 'female', accent: 'American', age: 'young_adult' }
  },
  // Microsoft Azure voices
  azure: {
    'aria': { name: 'Aria', gender: 'female', accent: 'American', age: 'young_adult' },
    'davis': { name: 'Davis', gender: 'male', accent: 'American', age: 'middle_aged' },
    'jane': { name: 'Jane', gender: 'female', accent: 'American', age: 'middle_aged' },
    'jason': { name: 'Jason', gender: 'male', accent: 'American', age: 'young_adult' },
    'jenny': { name: 'Jenny', gender: 'female', accent: 'American', age: 'young_adult' },
    'tony': { name: 'Tony', gender: 'male', accent: 'American', age: 'middle_aged' }
  },
  // Murf AI voices
  murf: {
    'ken': { name: 'Ken', gender: 'male', accent: 'American', age: 'middle_aged' },
    'lisa': { name: 'Lisa', gender: 'female', accent: 'American', age: 'young_adult' },
    'mark': { name: 'Mark', gender: 'male', accent: 'British', age: 'middle_aged' },
    'natalie': { name: 'Natalie', gender: 'female', accent: 'British', age: 'young_adult' },
    'ryan': { name: 'Ryan', gender: 'male', accent: 'Australian', age: 'young_adult' },
    'sophia': { name: 'Sophia', gender: 'female', accent: 'American', age: 'young_adult' }
  }
};

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

function enhanceTextWithBrandVoice(originalText: string, brandGuidelines: any): string {
  if (!brandGuidelines) return originalText;
  
  let enhancedText = originalText;
  
  // Add brand voice characteristics to speaking style
  if (brandGuidelines.brandVoice) {
    // Add speaking style cues based on brand voice
    switch (brandGuidelines.brandVoice.toLowerCase()) {
      case 'professional':
        enhancedText = addSpeakingCues(enhancedText, 'professional');
        break;
      case 'friendly':
        enhancedText = addSpeakingCues(enhancedText, 'conversational');
        break;
      case 'authoritative':
        enhancedText = addSpeakingCues(enhancedText, 'confident');
        break;
      case 'innovative':
        enhancedText = addSpeakingCues(enhancedText, 'energetic');
        break;
    }
  }
  
  // Add tone characteristics
  if (brandGuidelines.toneCharacteristics?.length > 0) {
    const primaryTone = brandGuidelines.toneCharacteristics[0];
    enhancedText = addTonalCues(enhancedText, primaryTone);
  }
  
  return enhancedText;
}

function addSpeakingCues(text: string, style: string): string {
  // Add SSML-like cues for different speaking styles
  switch (style) {
    case 'professional':
      return `<speak rate="medium" volume="medium">${text}</speak>`;
    case 'conversational':
      return `<speak rate="medium" volume="medium" style="friendly">${text}</speak>`;
    case 'confident':
      return `<speak rate="medium" volume="loud" style="authoritative">${text}</speak>`;
    case 'energetic':
      return `<speak rate="fast" volume="loud" style="excited">${text}</speak>`;
    default:
      return text;
  }
}

function addTonalCues(text: string, tone: string): string {
  // Add emotional context to the text
  const toneMap: Record<string, string> = {
    'confident': 'With confidence and clarity: ',
    'friendly': 'In a warm and welcoming tone: ',
    'professional': 'Speaking professionally: ',
    'enthusiastic': 'With enthusiasm and energy: ',
    'calm': 'In a calm and measured tone: ',
    'authoritative': 'With authority and conviction: '
  };
  
  const prefix = toneMap[tone.toLowerCase()] || '';
  return prefix + text;
}

export async function POST(request: NextRequest) {
  try {
    const body: VoiceGenerationRequest = await request.json();
    const { 
      text, 
      voice, 
      language, 
      style = 'natural', 
      speed = 1.0, 
      pitch = 0, 
      emotion = 'neutral',
      outputFormat = 'mp3',
      quality = 'standard',
      backgroundMusic,
      effects
    } = body;
    
    // Get brand training data
    const brandGuidelines = await getTrainingData();
    const enhancedText = enhanceTextWithBrandVoice(text, brandGuidelines);
    
    const startTime = Date.now();
    
    // Determine voice provider and model
    const voiceInfo = getVoiceInfo(voice);
    
    // Generate voice based on provider
    let voiceResult;
    switch (voiceInfo.provider) {
      case 'elevenlabs':
        voiceResult = await generateElevenLabsVoice(enhancedText, voice, {
          style, speed, pitch, emotion, quality, language
        });
        break;
      case 'openai':
        voiceResult = await generateOpenAIVoice(enhancedText, voice, {
          style, speed, outputFormat, quality
        });
        break;
      case 'azure':
        voiceResult = await generateAzureVoice(enhancedText, voice, {
          style, speed, pitch, emotion, language, quality
        });
        break;
      case 'murf':
        voiceResult = await generateMurfVoice(enhancedText, voice, {
          style, speed, pitch, emotion, quality
        });
        break;
      default:
        voiceResult = await generateOpenAIVoice(enhancedText, 'alloy', {
          style, speed, outputFormat, quality
        });
    }
    
    // Add background music if requested
    let finalResult: any = { ...voiceResult };
    if (backgroundMusic?.enabled) {
      finalResult.backgroundMusic = await addBackgroundMusic(
        voiceResult.url,
        backgroundMusic.type,
        backgroundMusic.volume
      );
    }
    
    // Apply audio effects if requested
    if (effects) {
      finalResult = await applyAudioEffects(finalResult, effects);
    }
    
    const processingTime = (Date.now() - startTime) / 1000;
    const duration = estimateAudioDuration(text, speed);
    
    const response = {
      id: `voice_${Date.now()}`,
      type: 'audio',
      subtype: 'voiceover',
      url: voiceResult.url,
      downloadUrl: voiceResult.downloadUrl,
      text: enhancedText,
      originalText: text,
      voice: voiceInfo.name,
      language,
      style,
      emotion,
      duration: duration,
      generatedAt: new Date().toISOString(),
      metadata: {
        provider: voiceInfo.provider,
        voiceModel: voice,
        processingTime,
        cost: calculateVoiceCost(voiceInfo.provider, text.length, quality),
        brandEnhanced: !!brandGuidelines,
        quality,
        outputFormat,
        speed,
        pitch,
        backgroundMusic: backgroundMusic?.enabled || false,
        effects: effects || {},
        fileSize: `${Math.round(duration * 0.5)}MB`, // Estimate based on quality
        wordCount: text.split(' ').length,
        characterCount: text.length
      },
      voiceInfo: {
        ...voiceInfo.details,
        provider: voiceInfo.provider
      },
      backgroundMusic: finalResult.backgroundMusic,
      waveform: finalResult.waveform // Waveform visualization data
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Voice generation failed:', error);
    return NextResponse.json(
      { error: 'Voice generation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function getVoiceInfo(voiceId: string) {
  // Check each provider for the voice
  for (const [provider, voices] of Object.entries(VOICE_MODELS)) {
    const voiceList = voices as Record<string, any>;
    if (voiceList[voiceId]) {
      return {
        provider,
        name: voiceList[voiceId].name,
        details: voiceList[voiceId]
      };
    }
  }
  
  // Default to OpenAI if voice not found
  return {
    provider: 'openai',
    name: 'Alloy',
    details: VOICE_MODELS.openai.alloy
  };
}

async function generateElevenLabsVoice(text: string, voice: string, options: any) {
  // Simulate ElevenLabs API processing
  const processingTime = Math.max(2000, text.length * 100); // Realistic processing time
  await new Promise(resolve => setTimeout(resolve, processingTime));
  
  return {
    url: `/api/mock-audio/elevenlabs_${Date.now()}.mp3`,
    downloadUrl: `/api/mock-audio/download/elevenlabs_${Date.now()}.mp3`,
    provider: 'ElevenLabs',
    model: 'Eleven Multilingual v2',
    quality: options.quality,
    waveform: generateMockWaveform(text.length)
  };
}

async function generateOpenAIVoice(text: string, voice: string, options: any) {
  // Simulate OpenAI TTS API processing
  const processingTime = Math.max(1500, text.length * 80);
  await new Promise(resolve => setTimeout(resolve, processingTime));
  
  return {
    url: `/api/mock-audio/openai_${Date.now()}.${options.outputFormat}`,
    downloadUrl: `/api/mock-audio/download/openai_${Date.now()}.${options.outputFormat}`,
    provider: 'OpenAI',
    model: 'TTS-1-HD',
    quality: options.quality,
    waveform: generateMockWaveform(text.length)
  };
}

async function generateAzureVoice(text: string, voice: string, options: any) {
  // Simulate Azure Cognitive Services Speech
  const processingTime = Math.max(1800, text.length * 90);
  await new Promise(resolve => setTimeout(resolve, processingTime));
  
  return {
    url: `/api/mock-audio/azure_${Date.now()}.mp3`,
    downloadUrl: `/api/mock-audio/download/azure_${Date.now()}.mp3`,
    provider: 'Microsoft Azure',
    model: 'Neural Voice',
    quality: options.quality,
    waveform: generateMockWaveform(text.length)
  };
}

async function generateMurfVoice(text: string, voice: string, options: any) {
  // Simulate Murf AI processing
  const processingTime = Math.max(2200, text.length * 110);
  await new Promise(resolve => setTimeout(resolve, processingTime));
  
  return {
    url: `/api/mock-audio/murf_${Date.now()}.mp3`,
    downloadUrl: `/api/mock-audio/download/murf_${Date.now()}.mp3`,
    provider: 'Murf AI',
    model: 'Studio Quality',
    quality: options.quality,
    waveform: generateMockWaveform(text.length)
  };
}

async function addBackgroundMusic(audioUrl: string, musicType: string, volume: number) {
  // Simulate background music mixing
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    enabled: true,
    type: musicType,
    volume,
    url: `/api/mock-audio/background_${musicType}_${Date.now()}.mp3`,
    mixedUrl: `/api/mock-audio/mixed_${Date.now()}.mp3`
  };
}

async function applyAudioEffects(voiceResult: any, effects: any) {
  // Simulate audio effects processing
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const processedResult = { ...voiceResult };
  processedResult.url = `/api/mock-audio/processed_${Date.now()}.mp3`;
  processedResult.effects = effects;
  
  return processedResult;
}

function generateMockWaveform(textLength: number): number[] {
  // Generate a mock waveform visualization
  const points = Math.min(100, Math.max(20, textLength / 10));
  const waveform = [];
  
  for (let i = 0; i < points; i++) {
    waveform.push(Math.random() * 0.8 + 0.1); // Values between 0.1 and 0.9
  }
  
  return waveform;
}

function estimateAudioDuration(text: string, speed: number): number {
  // Estimate audio duration based on text length and speaking speed
  const wordsPerMinute = 150 * speed; // Average speaking rate adjusted for speed
  const words = text.split(' ').length;
  return (words / wordsPerMinute) * 60; // Duration in seconds
}

function calculateVoiceCost(provider: string, textLength: number, quality: string): number {
  const baseCosts: Record<string, number> = {
    'elevenlabs': 0.30, // Per 1000 characters
    'openai': 0.015,    // Per 1000 characters
    'azure': 0.004,     // Per 1000 characters
    'murf': 0.20        // Per 1000 characters
  };
  
  const qualityMultipliers: Record<string, number> = {
    'standard': 1.0,
    'premium': 1.5,
    'studio': 2.0
  };
  
  const costPer1000 = baseCosts[provider] || 0.015;
  const qualityMultiplier = qualityMultipliers[quality] || 1.0;
  
  return (textLength / 1000) * costPer1000 * qualityMultiplier;
}

// Export voice models for use in the frontend
export async function GET() {
  return NextResponse.json({
    models: VOICE_MODELS,
    languages: [
      'en-US', 'en-GB', 'en-AU', 'en-CA',
      'es-ES', 'es-MX', 'fr-FR', 'fr-CA',
      'de-DE', 'it-IT', 'pt-BR', 'pt-PT',
      'ja-JP', 'ko-KR', 'zh-CN', 'zh-TW',
      'hi-IN', 'ar-SA', 'ru-RU', 'nl-NL'
    ],
    styles: ['natural', 'professional', 'conversational', 'energetic', 'calm', 'authoritative'],
    emotions: ['neutral', 'happy', 'sad', 'excited', 'confident', 'friendly'],
    formats: ['mp3', 'wav', 'ogg'],
    qualities: ['standard', 'premium', 'studio']
  });
}
