import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Simulate text extraction and AI analysis
    const simulateTextExtraction = () => {
      const sampleTexts = {
        'brand_guidelines': 'Our brand voice is professional yet approachable. We communicate with confidence while remaining humble and helpful. Key values: Innovation, Trust, Simplicity.',
        'voice_tone': 'Use conversational tone. Avoid jargon. Be encouraging and supportive. Always end with a call-to-action.',
        'style_guide': 'Preferred writing style: Active voice, short sentences, bullet points for lists. Tone: Friendly, professional, informative.',
        'examples': 'Example post: "🚀 Excited to share our latest feature! It makes social media management 10x easier. Try it now!"',
        'regulations': 'Always include disclaimers for promotional content. Use #ad for sponsored posts. Respect user privacy.'
      };
      
      return sampleTexts[type as keyof typeof sampleTexts] || 'Document content extracted successfully.';
    };

    const extractedText = simulateTextExtraction();

    // Simulate AI insights generation
    const generateAIInsights = () => {
      const insights = {
        'brand_guidelines': {
          brandVoice: 'Professional yet approachable',
          keyThemes: ['Innovation', 'Trust', 'Simplicity', 'User-focused'],
          writingStyle: 'Confident but humble',
          dosDonts: [
            'DO: Use confident language',
            'DO: Be helpful and supportive',
            'DON\'T: Use technical jargon',
            'DON\'T: Sound overly corporate'
          ]
        },
        'voice_tone': {
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
      };

      return insights[type as keyof typeof insights] || {
        brandVoice: 'Extracted from document',
        keyThemes: ['Quality', 'Innovation', 'Customer-first'],
        writingStyle: 'Professional and clear',
        dosDonts: ['DO: Follow brand guidelines', 'DON\'T: Deviate from voice']
      };
    };

    const aiInsights = generateAIInsights();

    const trainingDocument = {
      id: `training_${Date.now()}`,
      name: file.name,
      type,
      url: `/training-docs/${Date.now()}_${file.name}`,
      uploadedAt: new Date().toISOString(),
      size: file.size,
      format: file.type,
      processed: true,
      extractedText,
      aiInsights
    };

    return NextResponse.json(trainingDocument);

  } catch (error) {
    console.error('Training document upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload training document' },
      { status: 500 }
    );
  }
}
