// Demo content data for AI Studio, Content Library, and Brand Assets
// This provides realistic mock data for all three systems

export const demoContent = {
  // AI Studio Generated Content
  aiGenerated: [
    {
      id: 'ai_001',
      type: 'image',
      url: '/woman-portrait.png',
      prompt: 'Professional headshot for LinkedIn with modern lighting',
      platform: 'LinkedIn',
      generatedAt: '2024-08-30T10:15:00Z',
      metadata: {
        model: 'dall-e-3',
        processingTime: 2100,
        cost: 0.04
      }
    },
    {
      id: 'ai_002',
      type: 'flyer',
      url: '/woman-sunglasses.png',
      prompt: 'Summer collection promotional flyer with vibrant colors',
      platform: 'Instagram',
      generatedAt: '2024-08-30T09:30:00Z',
      metadata: {
        model: 'canva-api',
        processingTime: 4200,
        cost: 0.02
      }
    }
  ],

  // Content Library Items
  library: [
    {
      id: 'content_001',
      name: 'Brand Launch Announcement',
      type: 'image',
      url: '/woman-with-camera.png',
      platform: 'Instagram',
      status: 'published',
      tags: ['launch', 'brand', 'announcement'],
      usage: { downloads: 23, shares: 12 }
    },
    {
      id: 'content_002',
      name: 'Product Demo Video',
      type: 'video',
      url: '/thoughtful-man.png',
      platform: 'TikTok',
      status: 'approved',
      tags: ['demo', 'product', 'tutorial'],
      usage: { downloads: 45, shares: 28 }
    }
  ],

  // Brand Assets
  assets: [
    {
      id: 'asset_001',
      name: 'Primary Logo',
      type: 'logo',
      url: '/placeholder-logo.png',
      category: 'Branding',
      tags: ['logo', 'primary', 'brand'],
      description: 'Main brand logo for all marketing materials'
    },
    {
      id: 'asset_002',
      name: 'Brand Guidelines PDF',
      type: 'document',
      url: '/brand-guidelines.pdf',
      category: 'Guidelines',
      tags: ['guidelines', 'brand', 'standards'],
      description: 'Complete brand guidelines and usage standards'
    }
  ],

  // AI Training Documents
  training: [
    {
      id: 'train_001',
      name: 'Brand Voice Guide',
      type: 'voice-tone',
      status: 'completed',
      insights: {
        brandVoice: 'Professional yet approachable, with a focus on innovation and customer success',
        keyTopics: ['innovation', 'customer-success', 'technology', 'growth'],
        toneCharacteristics: ['professional', 'friendly', 'confident', 'helpful']
      }
    },
    {
      id: 'train_002',
      name: 'Product Information Sheet',
      type: 'product-info',
      status: 'processing',
      processingProgress: 75,
      insights: {
        keyTopics: ['features', 'benefits', 'pricing', 'testimonials'],
        brandVoice: 'Technical but accessible',
        toneCharacteristics: ['informative', 'precise', 'trustworthy']
      }
    }
  ]
};

export default demoContent;
