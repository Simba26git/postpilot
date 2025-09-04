import { NextRequest, NextResponse } from 'next/server';

async function getTrainingData() {
  try {
    const response = await fetch('http://localhost:3000/api/ai/training-data');
    const data = await response.json();
    return data.brandGuidelines;
  } catch (error) {
    console.error('Failed to fetch training data:', error);
    return null;
  }
}

function enhanceVideoPromptWithTraining(originalPrompt: string, brandGuidelines: any, platform: string) {
  if (!brandGuidelines) return originalPrompt;
  
  let enhancedPrompt = originalPrompt;
  
  // Add brand voice and tone for video content
  if (brandGuidelines.brandVoice) {
    enhancedPrompt += ` Video style: ${brandGuidelines.brandVoice}`;
  }
  
  // Add tone characteristics
  if (brandGuidelines.toneCharacteristics?.length > 0) {
    const tones = brandGuidelines.toneCharacteristics.slice(0, 2).join(', ');
    enhancedPrompt += `. Video tone: ${tones}`;
  }
  
  // Add key topics for context
  if (brandGuidelines.keyTopics?.length > 0) {
    const topics = brandGuidelines.keyTopics.slice(0, 3).join(', ');
    enhancedPrompt += `. Key themes: ${topics}`;
  }
  
  // Add platform-specific video optimization
  switch (platform) {
    case 'TikTok':
      enhancedPrompt += '. TikTok style: vertical, engaging, trend-aware, quick cuts, eye-catching';
      break;
    case 'Instagram':
      enhancedPrompt += '. Instagram video: stories/reels format, visually appealing, mobile-optimized';
      break;
    case 'YouTube':
      enhancedPrompt += '. YouTube content: professional, informative, audience-engaging, high production value';
      break;
    case 'LinkedIn':
      enhancedPrompt += '. LinkedIn video: professional, business-focused, thought-leadership style';
      break;
    case 'Facebook':
      enhancedPrompt += '. Facebook video: social, shareable, community-focused, accessible';
      break;
  }
  
  return enhancedPrompt;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, duration, aspect_ratio, model, platform } = body;
    
    // Get brand training data
    const brandGuidelines = await getTrainingData();
    
    // Enhance prompt with brand training
    const enhancedPrompt = enhanceVideoPromptWithTraining(prompt, brandGuidelines, platform);
    
    console.log('Original video prompt:', prompt);
    console.log('Enhanced video prompt with brand training:', enhancedPrompt);

    // For demo purposes, simulate video generation
    const demoVideos = [
      '/woman-portrait.png', // Using images as video placeholders for demo
      '/woman-with-camera.png',
      '/thoughtful-man.png'
    ];

    // Simulate longer processing time for videos
    await new Promise(resolve => setTimeout(resolve, 8000));

    const randomVideo = demoVideos[Math.floor(Math.random() * demoVideos.length)];
    
    return NextResponse.json({
      id: `vid_${Date.now()}`,
      type: 'video',
      url: randomVideo,
      prompt: enhancedPrompt, // Use enhanced prompt
      originalPrompt: prompt, // Keep original for reference
      platform,
      generatedAt: new Date().toISOString(),
      brandGuidelines: brandGuidelines ? {
        applied: true,
        voice: brandGuidelines.brandVoice,
        tones: brandGuidelines.toneCharacteristics?.slice(0, 2),
        keyTopics: brandGuidelines.keyTopics?.slice(0, 3)
      } : { applied: false },
      metadata: {
        model: 'gen3a_turbo_demo',
        processingTime: duration * 2000,
        cost: duration * 0.05
      }
    });

    /*
    // Real RunwayML implementation (uncomment when you have API key):
    const response = await fetch('https://api.runwayml.com/v1/generate/video', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RUNWAY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'gen3a_turbo',
        prompt: `Create a ${duration}s ${platform} video: ${prompt}. Professional, engaging, high-quality content.`,
        duration: duration || 10,
        aspect_ratio: aspect_ratio || '16:9',
        watermark: false,
        enhance_prompt: true
      })
    });

    if (!response.ok) {
      throw new Error(`RunwayML API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Poll for completion (RunwayML is async)
    let videoResult = data;
    while (videoResult.status === 'processing') {
      await new Promise(resolve => setTimeout(resolve, 5000));
      const statusResponse = await fetch(`https://api.runwayml.com/v1/tasks/${data.id}`, {
        headers: {
          'Authorization': `Bearer ${process.env.RUNWAY_API_KEY}`,
        }
      });
      videoResult = await statusResponse.json();
    }
    
    return NextResponse.json({
      id: `vid_${Date.now()}`,
      type: 'video',
      url: videoResult.output?.url || videoResult.video_url,
      prompt,
      platform,
      generatedAt: new Date().toISOString(),
      metadata: {
        model: model || 'gen3a_turbo',
        processingTime: duration * 2000,
        cost: duration * 0.05
      }
    });
    */

  } catch (error) {
    console.error('Video generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    );
  }
}
