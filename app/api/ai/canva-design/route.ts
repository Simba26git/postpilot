import { NextRequest, NextResponse } from 'next/server';

interface CanvaDesignRequest {
  type: 'social-post' | 'story' | 'flyer' | 'logo' | 'banner' | 'presentation' | 'poster' | 'brochure';
  platform: string;
  prompt: string;
  dimensions?: string;
  style: 'professional' | 'creative' | 'minimalist' | 'bold' | 'elegant' | 'playful';
  colorScheme?: string[];
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
  template?: string;
  animation?: boolean;
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

function enhanceCanvaPromptWithBranding(
  originalPrompt: string,
  brandGuidelines: any,
  platform: string,
  type: string,
  style: string
) {
  if (!brandGuidelines) return originalPrompt;
  
  let enhancedPrompt = `${originalPrompt}`;
  
  // Add brand voice for design aesthetics
  if (brandGuidelines.brandVoice) {
    enhancedPrompt += ` Design style: ${brandGuidelines.brandVoice}`;
  }
  
  // Add brand colors
  if (brandGuidelines.colorPalette?.length > 0) {
    const colors = brandGuidelines.colorPalette.join(', ');
    enhancedPrompt += `. Brand colors: ${colors}`;
  }
  
  // Add typography preferences
  if (brandGuidelines.typography) {
    enhancedPrompt += `. Typography: ${brandGuidelines.typography}`;
  }
  
  // Add design principles
  if (brandGuidelines.designPrinciples?.length > 0) {
    const principles = brandGuidelines.designPrinciples.join(', ');
    enhancedPrompt += `. Design principles: ${principles}`;
  }
  
  // Platform-specific design optimization
  switch (platform) {
    case 'Instagram':
      enhancedPrompt += '. Instagram optimized: square/portrait format, mobile-friendly text size, vibrant visuals';
      break;
    case 'Facebook':
      enhancedPrompt += '. Facebook optimized: landscape/square format, clear readable text, engaging visuals';
      break;
    case 'LinkedIn':
      enhancedPrompt += '. LinkedIn optimized: professional layout, corporate colors, business-appropriate imagery';
      break;
    case 'TikTok':
      enhancedPrompt += '. TikTok optimized: vertical format, bold text, eye-catching elements';
      break;
    case 'YouTube':
      enhancedPrompt += '. YouTube optimized: thumbnail style, 16:9 format, compelling visual hierarchy';
      break;
    case 'Twitter':
      enhancedPrompt += '. Twitter optimized: horizontal format, concise messaging, high contrast';
      break;
  }
  
  // Type-specific enhancements
  switch (type) {
    case 'social-post':
      enhancedPrompt += '. Social media post: engaging visuals, clear message hierarchy, action-oriented design';
      break;
    case 'story':
      enhancedPrompt += '. Story design: vertical format, full-screen impact, swipe-friendly layout';
      break;
    case 'flyer':
      enhancedPrompt += '. Flyer design: information hierarchy, promotional focus, clear call-to-action';
      break;
    case 'logo':
      enhancedPrompt += '. Logo design: scalable, memorable, brand-representative, versatile across mediums';
      break;
    case 'banner':
      enhancedPrompt += '. Banner design: attention-grabbing, clear messaging, appropriate aspect ratio';
      break;
  }
  
  return enhancedPrompt;
}

export async function POST(request: NextRequest) {
  try {
    const body: CanvaDesignRequest = await request.json();
    const { type, platform, prompt, dimensions, style, colorScheme, elements, template, animation } = body;
    
    // Get brand training data
    const brandGuidelines = await getTrainingData();
    const enhancedPrompt = enhanceCanvaPromptWithBranding(prompt, brandGuidelines, platform, type, style);
    
    const startTime = Date.now();
    
    // Generate design based on type
    const designResult = await generateCanvaDesign({
      type,
      platform,
      prompt: enhancedPrompt,
      originalPrompt: prompt,
      dimensions,
      style,
      colorScheme: colorScheme || brandGuidelines?.colorPalette || ['#FF6B35', '#1A1A1A'],
      elements,
      template,
      animation,
      brandGuidelines
    });
    
    const processingTime = (Date.now() - startTime) / 1000;
    
    const response = {
      id: `canva_${Date.now()}`,
      type: 'design',
      subtype: type,
      url: designResult.url,
      downloadUrl: designResult.downloadUrl,
      thumbnail: designResult.thumbnail,
      prompt: enhancedPrompt,
      originalPrompt: prompt,
      platform,
      style,
      dimensions: designResult.dimensions,
      generatedAt: new Date().toISOString(),
      metadata: {
        service: 'Canva API',
        processingTime,
        cost: calculateCanvaCost(type, animation || false),
        brandEnhanced: !!brandGuidelines,
        template: designResult.template,
        colorScheme: designResult.colorScheme,
        elements: designResult.elements,
        editable: true,
        formats: ['PNG', 'JPG', 'PDF', 'MP4'], // Available export formats
        animation: animation || false
      },
      editUrl: `https://www.canva.com/design/${designResult.canvaId}/edit`,
      variants: designResult.variants || [] // Alternative design versions
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Canva design generation failed:', error);
    return NextResponse.json(
      { error: 'Design generation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function generateCanvaDesign(options: any) {
  const { type, platform, prompt, dimensions, style, colorScheme, elements, animation, brandGuidelines } = options;
  
  // Simulate Canva API processing time based on complexity
  const baseTime = type === 'logo' ? 4000 : type === 'presentation' ? 6000 : 2500;
  const animationTime = animation ? 2000 : 0;
  await new Promise(resolve => setTimeout(resolve, baseTime + animationTime));
  
  // Determine optimal dimensions
  const finalDimensions = getDimensionsForType(type, platform, dimensions);
  
  // Generate mock Canva design
  const canvaId = `DAF${Math.random().toString(36).substr(2, 9)}`;
  
  const result = {
    url: `/api/mock-designs/canva_${Date.now()}.${animation ? 'mp4' : 'png'}`,
    downloadUrl: `/api/mock-designs/download/canva_${Date.now()}`,
    thumbnail: `/api/mock-designs/thumb_${Date.now()}.jpg`,
    canvaId,
    dimensions: finalDimensions,
    template: getTemplateForType(type, style),
    colorScheme,
    elements: {
      text: elements?.text || generateDefaultText(type, prompt),
      images: elements?.images || [],
      brandElements: brandGuidelines ? {
        logo: brandGuidelines.logo || null,
        colors: brandGuidelines.colorPalette || [],
        fonts: brandGuidelines.typography || 'Professional'
      } : null
    },
    variants: await generateDesignVariants(type, style, colorScheme)
  };
  
  return result;
}

function getDimensionsForType(type: string, platform: string, customDimensions?: string): string {
  if (customDimensions) return customDimensions;
  
  const platformDimensions: Record<string, Record<string, string>> = {
    'Instagram': {
      'social-post': '1080x1080',
      'story': '1080x1920',
      'reel': '1080x1920',
      'carousel': '1080x1080'
    },
    'Facebook': {
      'social-post': '1200x630',
      'story': '1080x1920',
      'cover': '1640x859',
      'ad': '1200x628'
    },
    'LinkedIn': {
      'social-post': '1200x627',
      'story': '1080x1920',
      'banner': '1584x396',
      'article': '1200x627'
    },
    'TikTok': {
      'social-post': '1080x1920',
      'story': '1080x1920'
    },
    'YouTube': {
      'thumbnail': '1280x720',
      'banner': '2560x1440',
      'story': '1080x1920'
    },
    'Twitter': {
      'social-post': '1200x675',
      'header': '1500x500'
    }
  };
  
  // Default dimensions by type
  const defaultDimensions: Record<string, string> = {
    'social-post': '1080x1080',
    'story': '1080x1920',
    'flyer': '8.5x11in',
    'logo': '500x500',
    'banner': '1200x300',
    'presentation': '1920x1080',
    'poster': '18x24in',
    'brochure': '8.5x11in'
  };
  
  return platformDimensions[platform]?.[type] || defaultDimensions[type] || '1080x1080';
}

function getTemplateForType(type: string, style: string): string {
  const templates: Record<string, Record<string, string[]>> = {
    'social-post': {
      'professional': ['Business Promo', 'Corporate Announcement', 'Product Showcase'],
      'creative': ['Artistic Layout', 'Creative Collage', 'Vibrant Design'],
      'minimalist': ['Clean Layout', 'Simple Text', 'Minimal Elements'],
      'bold': ['Impact Design', 'Bold Typography', 'Strong Colors'],
      'elegant': ['Luxury Layout', 'Sophisticated Design', 'Premium Look'],
      'playful': ['Fun Design', 'Colorful Layout', 'Energetic Style']
    },
    'flyer': {
      'professional': ['Business Flyer', 'Corporate Event', 'Service Promotion'],
      'creative': ['Creative Event', 'Artistic Promotion', 'Design Showcase'],
      'minimalist': ['Clean Flyer', 'Simple Promotion', 'Minimal Event'],
      'bold': ['Impact Flyer', 'Bold Event', 'Strong Promotion'],
      'elegant': ['Luxury Event', 'Premium Service', 'Sophisticated Promo'],
      'playful': ['Fun Event', 'Colorful Promotion', 'Party Flyer']
    },
    'logo': {
      'professional': ['Corporate Logo', 'Business Mark', 'Professional Emblem'],
      'creative': ['Artistic Logo', 'Creative Mark', 'Design Symbol'],
      'minimalist': ['Simple Logo', 'Clean Mark', 'Minimal Symbol'],
      'bold': ['Strong Logo', 'Bold Mark', 'Impact Symbol'],
      'elegant': ['Luxury Logo', 'Premium Mark', 'Sophisticated Symbol'],
      'playful': ['Fun Logo', 'Colorful Mark', 'Playful Symbol']
    }
  };
  
  const typeTemplates = templates[type] || templates['social-post'];
  const styleTemplates = typeTemplates[style] || typeTemplates['professional'];
  return styleTemplates[Math.floor(Math.random() * styleTemplates.length)];
}

function generateDefaultText(type: string, prompt: string) {
  const words = prompt.split(' ').slice(0, 3).join(' ');
  
  switch (type) {
    case 'social-post':
      return {
        headline: words.charAt(0).toUpperCase() + words.slice(1),
        subtext: 'Discover more about our amazing offer',
        callToAction: 'Learn More'
      };
    case 'flyer':
      return {
        headline: words.toUpperCase(),
        subtext: 'Join us for an amazing experience',
        callToAction: 'Get Started Today'
      };
    case 'logo':
      return {
        headline: words.charAt(0).toUpperCase() + words.slice(1),
        subtext: 'Your trusted partner'
      };
    default:
      return {
        headline: words.charAt(0).toUpperCase() + words.slice(1),
        subtext: 'Powered by AI',
        callToAction: 'Explore'
      };
  }
}

async function generateDesignVariants(type: string, style: string, colorScheme: string[]) {
  // Simulate generating 3 design variants
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const variants = [];
  const styles = ['professional', 'creative', 'minimalist'];
  
  for (let i = 0; i < 3; i++) {
    variants.push({
      id: `variant_${i + 1}`,
      style: styles[i] || style,
      url: `/api/mock-designs/variant_${Date.now()}_${i}.png`,
      thumbnail: `/api/mock-designs/variant_thumb_${Date.now()}_${i}.jpg`,
      description: `${styles[i] || style} variation of the ${type}`
    });
  }
  
  return variants;
}

function calculateCanvaCost(type: string, animation: boolean): number {
  const baseCosts: Record<string, number> = {
    'social-post': 0.02,
    'story': 0.02,
    'flyer': 0.05,
    'logo': 0.15,
    'banner': 0.03,
    'presentation': 0.10,
    'poster': 0.08,
    'brochure': 0.07
  };
  
  const animationMultiplier = animation ? 2.0 : 1.0;
  return (baseCosts[type] || 0.03) * animationMultiplier;
}
