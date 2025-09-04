import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock brand assets data
    const mockAssets = [
      {
        id: 'asset_1',
        name: 'Brand Logo Primary.png',
        type: 'logo',
        url: '/placeholder-logo.png',
        thumbnail: '/placeholder-logo.png',
        category: 'Branding',
        tags: ['logo', 'primary', 'brand'],
        uploadedAt: '2024-08-25T10:00:00Z',
        fileSize: 45600,
        format: 'image/png',
        description: 'Primary brand logo for all marketing materials',
        metadata: {
          dimensions: '512x512',
          colors: ['#FF6B35', '#1A1A1A'],
          usage: 'Use this logo for all official brand communications'
        }
      },
      {
        id: 'asset_2',
        name: 'Brand Colors.pdf',
        type: 'color-palette',
        url: '/brand-colors.pdf',
        thumbnail: '/brand-colors.pdf',
        category: 'Guidelines',
        tags: ['colors', 'palette', 'guidelines'],
        uploadedAt: '2024-08-24T14:30:00Z',
        fileSize: 128000,
        format: 'application/pdf',
        description: 'Official brand color palette and usage guidelines',
        metadata: {
          colors: ['#FF6B35', '#1A1A1A', '#FFFFFF', '#F5F5F5'],
          usage: 'Use these colors consistently across all brand materials'
        }
      },
      {
        id: 'asset_3',
        name: 'Typography Guide.pdf',
        type: 'font',
        url: '/typography.pdf',
        thumbnail: '/typography.pdf',
        category: 'Guidelines',
        tags: ['typography', 'fonts', 'guidelines'],
        uploadedAt: '2024-08-23T09:15:00Z',
        fileSize: 256000,
        format: 'application/pdf',
        description: 'Brand typography guidelines and font usage',
        metadata: {
          fonts: ['Inter', 'Roboto', 'Arial'],
          usage: 'Follow these typography guidelines for consistent brand communication'
        }
      },
      {
        id: 'asset_4',
        name: 'Brand Guidelines v2.pdf',
        type: 'document',
        url: '/brand-guidelines.pdf',
        thumbnail: '/brand-guidelines.pdf',
        category: 'Guidelines',
        tags: ['guidelines', 'brand', 'standards'],
        uploadedAt: '2024-08-22T16:45:00Z',
        fileSize: 1024000,
        format: 'application/pdf',
        description: 'Complete brand guidelines document with usage standards',
        metadata: {
          pages: 24,
          usage: 'Reference document for all brand-related decisions and implementations'
        }
      },
      {
        id: 'asset_5',
        name: 'Product Photos.zip',
        type: 'image',
        url: '/woman-portrait.png',
        thumbnail: '/woman-portrait.png',
        category: 'Product',
        tags: ['product', 'photos', 'marketing'],
        uploadedAt: '2024-08-21T11:20:00Z',
        fileSize: 2048000,
        format: 'application/zip',
        description: 'High-resolution product photography for marketing use',
        metadata: {
          images: 15,
          resolution: '4K',
          usage: 'Use for website, social media, and print materials'
        }
      }
    ];

    return NextResponse.json(mockAssets);

  } catch (error) {
    console.error('Failed to fetch brand assets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brand assets' },
      { status: 500 }
    );
  }
}
