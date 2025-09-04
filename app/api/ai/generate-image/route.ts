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

function enhancePromptWithTraining(originalPrompt: string, brandGuidelines: any, platform: string) {
  if (!brandGuidelines) return originalPrompt;
  
  // Build enhanced prompt with brand context
  let enhancedPrompt = originalPrompt;
  
  // Add brand voice and tone
  if (brandGuidelines.brandVoice) {
    enhancedPrompt += ` Style: ${brandGuidelines.brandVoice}`;
  }
  
  // Add tone characteristics
  if (brandGuidelines.toneCharacteristics?.length > 0) {
    const tones = brandGuidelines.toneCharacteristics.slice(0, 3).join(', ');
    enhancedPrompt += `. Tone: ${tones}`;
  }
  
  // Add color palette if available
  if (brandGuidelines.colorPalette?.length > 0) {
    const colors = brandGuidelines.colorPalette.slice(0, 3).join(', ');
    enhancedPrompt += `. Colors: ${colors}`;
  }
  
  // Add design principles
  if (brandGuidelines.designPrinciples?.length > 0) {
    const principles = brandGuidelines.designPrinciples.slice(0, 2).join(', ');
    enhancedPrompt += `. Design: ${principles}`;
  }
  
  // Add platform-specific optimization
  switch (platform) {
    case 'Instagram':
      enhancedPrompt += '. Optimized for Instagram: visually striking, mobile-friendly, square format';
      break;
    case 'LinkedIn':
      enhancedPrompt += '. Professional LinkedIn style: clean, corporate, business-focused';
      break;
    case 'Facebook':
      enhancedPrompt += '. Facebook optimized: engaging, social, community-focused';
      break;
    case 'Twitter':
      enhancedPrompt += '. Twitter style: concise, impactful, conversation-starting';
      break;
  }
  
  return enhancedPrompt;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, size, style, quality, platform } = body;
    
    // Get brand training data
    const brandGuidelines = await getTrainingData();
    
    // Enhance prompt with brand training
    const enhancedPrompt = enhancePromptWithTraining(prompt, brandGuidelines, platform);
    
    console.log('Original prompt:', prompt);
    console.log('Enhanced prompt with brand training:', enhancedPrompt);

    // For demo purposes, simulate AI generation with existing images
    const demoImages = {
      image: [
        '/woman-portrait.png',
        '/woman-glasses.png',
        '/woman-with-camera.png',
        '/thoughtful-man.png'
      ],
      flyer: [
        '/woman-sunglasses.png',
        '/woman-2.png',
        '/woman-3.png'
      ],
      carousel: [
        '/woman-portrait-2.png',
        '/diverse-woman-portrait.png',
        '/blonde-woman.png'
      ],
      story: [
        '/woman-phone.png',
        '/woman-portrait.png'
      ]
    };

    // Select appropriate image based on content type
    const contentType = body.type || 'image';
    const imagePool = demoImages[contentType as keyof typeof demoImages] || demoImages.image;
    const randomImage = imagePool[Math.floor(Math.random() * imagePool.length)];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    return NextResponse.json({
      id: `img_${Date.now()}`,
      type: 'image',
      url: randomImage,
      prompt: enhancedPrompt, // Use enhanced prompt
      originalPrompt: prompt, // Keep original for reference
      platform,
      generatedAt: new Date().toISOString(),
      brandGuidelines: brandGuidelines ? {
        applied: true,
        voice: brandGuidelines.brandVoice,
        tones: brandGuidelines.toneCharacteristics?.slice(0, 3),
        colors: brandGuidelines.colorPalette?.slice(0, 3)
      } : { applied: false },
      metadata: {
        model: 'dall-e-3-demo',
        processingTime: 15000,
        cost: 0.04
      }
    });

    /* 
    // Real DALL-E 3 implementation (uncomment when you have API key):
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: `Create a professional ${platform} post: ${prompt}. High quality, engaging, brand-focused design.`,
        size: size || '1024x1024',
        style: style || 'vivid',
        quality: quality || 'hd',
        n: 1
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      id: `img_${Date.now()}`,
      type: 'image',
      url: data.data[0].url,
      prompt,
      platform,
      generatedAt: new Date().toISOString(),
      metadata: {
        model: 'dall-e-3',
        processingTime: 15000,
        cost: 0.04
      }
    });
    */

  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}
