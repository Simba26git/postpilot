import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Test Canva API key by fetching user profile
    const response = await fetch('https://api.canva.com/rest/v1/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.CANVA_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(`Canva API Error: ${error.message || response.statusText}`);
    }

    const profile = await response.json();

    return NextResponse.json({
      success: true,
      message: "Canva API connection successful",
      profile: {
        id: profile.id || 'N/A',
        name: profile.display_name || 'N/A',
        email: profile.email || 'N/A'
      },
      timestamp: new Date().toISOString(),
      apiKey: process.env.CANVA_API_KEY ? `${process.env.CANVA_API_KEY.substring(0, 20)}...` : 'Not found'
    });

  } catch (error: any) {
    console.error('Canva API Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
      apiKey: process.env.CANVA_API_KEY ? `${process.env.CANVA_API_KEY.substring(0, 20)}...` : 'Not found'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, template_id } = await request.json();

    if (!title) {
      return NextResponse.json({
        success: false,
        error: "Title is required"
      }, { status: 400 });
    }

    // Test design creation
    const response = await fetch('https://api.canva.com/rest/v1/designs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CANVA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        design_type: "InstagramPost",
        asset_id: template_id || "BAEoeK2kkIA", // Default template
        title: title,
        description: description || "Created via API"
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Design creation failed' }));
      throw new Error(`Canva API Error: ${error.message || response.statusText}`);
    }

    const design = await response.json();

    return NextResponse.json({
      success: true,
      message: "Design creation successful",
      design: {
        id: design.id || 'demo-design-id',
        title: design.title || title,
        urls: design.urls || { view: 'https://canva.com/demo-design' }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Canva Design Creation Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
