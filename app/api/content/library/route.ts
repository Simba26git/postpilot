import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const platform = searchParams.get('platform');
    const status = searchParams.get('status');

    // Mock content library data
    let mockContent = [
      {
        id: 'content_1',
        name: 'Product Launch Announcement',
        type: 'image',
        url: '/woman-portrait.png',
        thumbnail: '/woman-portrait.png',
        createdAt: '2024-08-28T10:00:00Z',
        platform: 'Instagram',
        prompt: 'Professional product launch announcement with modern design',
        tags: ['product', 'launch', 'announcement', 'professional'],
        status: 'published',
        aiGenerated: true,
        metadata: {
          dimensions: '1080x1080',
          fileSize: 256000,
          format: 'image/png'
        },
        usage: {
          downloads: 15,
          shares: 8,
          lastUsed: '2024-08-28T14:30:00Z'
        }
      },
      {
        id: 'content_2',
        name: 'Behind the Scenes Video',
        type: 'video',
        url: '/woman-2.png',
        thumbnail: '/woman-2.png',
        createdAt: '2024-08-26T14:30:00Z',
        platform: 'TikTok',
        prompt: 'Behind the scenes creative process video',
        tags: ['behind-scenes', 'creative', 'video', 'process'],
        status: 'approved',
        aiGenerated: true,
        metadata: {
          dimensions: '1080x1920',
          duration: 15,
          fileSize: 5120000,
          format: 'video/mp4'
        },
        usage: {
          downloads: 23,
          shares: 12,
          lastUsed: '2024-08-27T09:15:00Z'
        }
      },
      {
        id: 'content_3',
        name: 'Summer Collection Flyer',
        type: 'flyer',
        url: '/woman-sunglasses.png',
        thumbnail: '/woman-sunglasses.png',
        createdAt: '2024-08-24T09:15:00Z',
        platform: 'Facebook',
        prompt: 'Summer collection promotional flyer with bright colors',
        tags: ['summer', 'collection', 'flyer', 'promotion'],
        status: 'draft',
        aiGenerated: true,
        metadata: {
          dimensions: '1080x1350',
          fileSize: 512000,
          format: 'image/png'
        },
        usage: {
          downloads: 5,
          shares: 2
        }
      },
      {
        id: 'content_4',
        name: 'Team Spotlight',
        type: 'image',
        url: '/woman-3.png',
        thumbnail: '/woman-3.png',
        createdAt: '2024-08-23T16:45:00Z',
        platform: 'LinkedIn',
        tags: ['team', 'spotlight', 'professional', 'employee'],
        status: 'published',
        aiGenerated: false,
        metadata: {
          dimensions: '1200x630',
          fileSize: 384000,
          format: 'image/png'
        },
        usage: {
          downloads: 18,
          shares: 10,
          lastUsed: '2024-08-25T11:20:00Z'
        }
      },
      {
        id: 'content_5',
        name: 'Tutorial Carousel',
        type: 'carousel',
        url: '/woman-glasses.png',
        thumbnail: '/woman-glasses.png',
        createdAt: '2024-08-22T11:20:00Z',
        platform: 'Instagram',
        prompt: 'Educational tutorial carousel with step-by-step guide',
        tags: ['tutorial', 'education', 'carousel', 'how-to'],
        status: 'approved',
        aiGenerated: true,
        metadata: {
          dimensions: '1080x1080',
          fileSize: 768000,
          format: 'image/png'
        },
        usage: {
          downloads: 31,
          shares: 18,
          lastUsed: '2024-08-24T08:45:00Z'
        }
      },
      {
        id: 'content_6',
        name: 'Customer Testimonial',
        type: 'image',
        url: '/woman-with-camera.png',
        thumbnail: '/woman-with-camera.png',
        createdAt: '2024-08-21T08:45:00Z',
        platform: 'Instagram',
        tags: ['testimonial', 'customer', 'review', 'social-proof'],
        status: 'archived',
        aiGenerated: false,
        metadata: {
          dimensions: '1080x1080',
          fileSize: 445000,
          format: 'image/png'
        },
        usage: {
          downloads: 12,
          shares: 6,
          lastUsed: '2024-08-22T15:30:00Z'
        }
      }
    ];

    // Apply filters
    if (type && type !== 'all') {
      mockContent = mockContent.filter(item => item.type === type);
    }
    if (platform && platform !== 'all') {
      mockContent = mockContent.filter(item => item.platform === platform);
    }
    if (status && status !== 'all') {
      mockContent = mockContent.filter(item => item.status === status);
    }

    return NextResponse.json(mockContent);

  } catch (error) {
    console.error('Failed to fetch content library:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content library' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content, metadata } = await request.json();

    // Simulate saving content to library
    const libraryItem = {
      id: `content_${Date.now()}`,
      name: metadata.name || 'Generated Content',
      type: content.type,
      url: content.url,
      thumbnail: content.url,
      createdAt: new Date().toISOString(),
      platform: metadata.platform || 'General',
      prompt: content.prompt,
      tags: metadata.tags || [],
      status: 'draft',
      aiGenerated: true,
      metadata: {
        dimensions: metadata.dimensions || '1080x1080',
        duration: metadata.duration,
        fileSize: metadata.fileSize || 256000,
        format: metadata.format || 'image/png'
      },
      usage: {
        downloads: 0,
        shares: 0
      }
    };

    return NextResponse.json(libraryItem);

  } catch (error) {
    console.error('Failed to save content:', error);
    return NextResponse.json(
      { error: 'Failed to save content' },
      { status: 500 }
    );
  }
}
