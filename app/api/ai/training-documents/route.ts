import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock training documents data
    const mockTrainingDocs = [
      {
        id: 'training_1',
        name: 'Brand Guidelines Complete.pdf',
        type: 'brand_guidelines',
        url: '/training-docs/brand-guidelines.pdf',
        uploadedAt: '2024-08-25T10:00:00Z',
        size: 2048000,
        format: 'application/pdf',
        processed: true,
        extractedText: 'Our brand voice is professional yet approachable. We communicate with confidence while remaining humble and helpful. Key values: Innovation, Trust, Simplicity.',
        aiInsights: {
          brandVoice: 'Professional yet approachable',
          keyThemes: ['Innovation', 'Trust', 'Simplicity', 'User-focused'],
          writingStyle: 'Confident but humble',
          dosDonts: [
            'DO: Use confident language',
            'DO: Be helpful and supportive',
            'DON\'T: Use technical jargon',
            'DON\'T: Sound overly corporate'
          ]
        }
      },
      {
        id: 'training_2',
        name: 'Voice and Tone Guide.pdf',
        type: 'voice_tone',
        url: '/training-docs/voice-tone.pdf',
        uploadedAt: '2024-08-24T14:30:00Z',
        size: 512000,
        format: 'application/pdf',
        processed: true,
        extractedText: 'Use conversational tone. Avoid jargon. Be encouraging and supportive. Always end with a call-to-action.',
        aiInsights: {
          brandVoice: 'Conversational and encouraging',
          keyThemes: ['Support', 'Guidance', 'Action'],
          writingStyle: 'Casual yet informative',
          dosDonts: [
            'DO: Use conversational tone',
            'DO: Include call-to-actions',
            'DON\'T: Use complex terms',
            'DON\'T: Be passive'
          ]
        }
      },
      {
        id: 'training_3',
        name: 'Content Examples Library.docx',
        type: 'examples',
        url: '/training-docs/content-examples.docx',
        uploadedAt: '2024-08-23T09:15:00Z',
        size: 256000,
        format: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        processed: true,
        extractedText: 'Example post: "🚀 Excited to share our latest feature! It makes social media management 10x easier. Try it now!"',
        aiInsights: {
          brandVoice: 'Excited and enthusiastic',
          keyThemes: ['Innovation', 'Ease of use', 'Benefits'],
          writingStyle: 'Emoji-friendly, action-oriented',
          dosDonts: [
            'DO: Use emojis strategically',
            'DO: Highlight benefits',
            'DON\'T: Oversell',
            'DON\'T: Use too many exclamations'
          ]
        }
      },
      {
        id: 'training_4',
        name: 'Industry Regulations.pdf',
        type: 'regulations',
        url: '/training-docs/regulations.pdf',
        uploadedAt: '2024-08-22T16:45:00Z',
        size: 1024000,
        format: 'application/pdf',
        processed: false
      }
    ];

    return NextResponse.json(mockTrainingDocs);

  } catch (error) {
    console.error('Failed to fetch training documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch training documents' },
      { status: 500 }
    );
  }
}
