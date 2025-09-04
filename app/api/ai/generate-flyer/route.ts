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

function enhanceFlyerPromptWithTraining(originalPrompt: string, brandGuidelines: any, platform: string) {
  if (!brandGuidelines) return originalPrompt;
  
  let enhancedPrompt = originalPrompt;
  
  // Add brand voice and messaging
  if (brandGuidelines.brandVoice) {
    enhancedPrompt += ` Brand voice: ${brandGuidelines.brandVoice}`;
  }
  
  // Add design principles for flyers
  if (brandGuidelines.designPrinciples?.length > 0) {
    const principles = brandGuidelines.designPrinciples.slice(0, 3).join(', ');
    enhancedPrompt += `. Design style: ${principles}`;
  }
  
  // Add color palette
  if (brandGuidelines.colorPalette?.length > 0) {
    const colors = brandGuidelines.colorPalette.slice(0, 4).join(', ');
    enhancedPrompt += `. Brand colors: ${colors}`;
  }
  
  // Add key messaging topics
  if (brandGuidelines.keyTopics?.length > 0) {
    const topics = brandGuidelines.keyTopics.slice(0, 3).join(', ');
    enhancedPrompt += `. Key messages: ${topics}`;
  }
  
  // Add company info if available
  if (brandGuidelines.companyInfo?.name && brandGuidelines.companyInfo.name !== "Your Company") {
    enhancedPrompt += `. Company: ${brandGuidelines.companyInfo.name}`;
  }
  
  // Platform-specific design optimization
  switch (platform) {
    case 'Instagram':
      enhancedPrompt += '. Instagram flyer: mobile-first, visually striking, story-ready format';
      break;
    case 'Facebook':
      enhancedPrompt += '. Facebook flyer: social sharing optimized, eye-catching, community-focused';
      break;
    case 'LinkedIn':
      enhancedPrompt += '. LinkedIn flyer: professional business design, corporate aesthetic, networking-focused';
      break;
    case 'Print':
      enhancedPrompt += '. Print flyer: high-resolution, traditional layout, clear hierarchy';
      break;
  }
  
  return enhancedPrompt;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { template_type, text_content, brand_colors, platform, dimensions, prompt } = body;
    
    // Get brand training data
    const brandGuidelines = await getTrainingData();
    
    // Enhance prompt with brand training
    const originalPrompt = prompt || text_content || 'Create a professional flyer';
    const enhancedPrompt = enhanceFlyerPromptWithTraining(originalPrompt, brandGuidelines, platform);
    
    console.log('Original flyer prompt:', originalPrompt);
    console.log('Enhanced flyer prompt with brand training:', enhancedPrompt);

    // For demo purposes, simulate flyer generation
    if (!process.env.CANVA_API_KEY) {
      const demoFlyers = [
        '/woman-sunglasses.png',
        '/woman-2.png', 
        '/woman-3.png',
        '/blonde-woman.png'
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 4000));

      const randomFlyer = demoFlyers[Math.floor(Math.random() * demoFlyers.length)];
      
      return NextResponse.json({
        id: `flyer_${Date.now()}`,
        type: 'flyer',
        url: randomFlyer,
        prompt: enhancedPrompt, // Use enhanced prompt
        originalPrompt: originalPrompt, // Keep original for reference
        platform,
        generatedAt: new Date().toISOString(),
        brandGuidelines: brandGuidelines ? {
          applied: true,
          voice: brandGuidelines.brandVoice,
          designPrinciples: brandGuidelines.designPrinciples?.slice(0, 3),
          colors: brandGuidelines.colorPalette?.slice(0, 4),
          keyTopics: brandGuidelines.keyTopics?.slice(0, 3)
        } : { applied: false },
        metadata: {
          model: 'canva-api-demo',
          processingTime: 4000,
          cost: 0.02
        }
      });
    }

    // Canva API integration for flyer generation
    const response = await fetch('https://api.canva.com/rest/v1/designs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CANVA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        design_type: template_type || 'business_flyer',
        title: `${platform} Flyer - ${Date.now()}`,
        width: parseInt(dimensions?.split('x')[0] || '1080'),
        height: parseInt(dimensions?.split('x')[1] || '1080'),
        elements: [
          {
            type: 'text',
            content: text_content,
            font_family: 'Arial',
            font_size: 24,
            color: brand_colors?.[0] || '#000000',
            position: { x: 50, y: 50 }
          },
          {
            type: 'background',
            color: brand_colors?.[1] || '#FFFFFF'
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Canva API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Export the design
    const exportResponse = await fetch(`https://api.canva.com/rest/v1/designs/${data.design.id}/export`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CANVA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        format: 'png',
        quality: 'high'
      })
    });

    const exportData = await exportResponse.json();
    
    return NextResponse.json({
      id: `flyer_${Date.now()}`,
      type: 'flyer',
      url: exportData.export_url,
      prompt: text_content,
      platform,
      generatedAt: new Date().toISOString(),
      metadata: {
        model: 'canva-api',
        processingTime: 8000,
        cost: 0.10
      }
    });

  } catch (error) {
    console.error('Flyer generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate flyer' },
      { status: 500 }
    );
  }
}
