import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Test Runway API key by checking account status
    const response = await fetch('https://api.runwayml.com/v1/account', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.RUNWAY_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(`Runway API Error: ${error.message || response.statusText}`);
    }

    const account = await response.json();

    return NextResponse.json({
      success: true,
      message: "Runway API connection successful",
      account: {
        id: account.id || 'N/A',
        credits: account.credits || 'N/A',
        plan: account.plan || 'N/A'
      },
      timestamp: new Date().toISOString(),
      apiKey: process.env.RUNWAY_API_KEY ? `${process.env.RUNWAY_API_KEY.substring(0, 20)}...` : 'Not found'
    });

  } catch (error: any) {
    console.error('Runway API Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
      apiKey: process.env.RUNWAY_API_KEY ? `${process.env.RUNWAY_API_KEY.substring(0, 20)}...` : 'Not found'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, duration = 4 } = await request.json();

    if (!prompt) {
      return NextResponse.json({
        success: false,
        error: "Prompt is required"
      }, { status: 400 });
    }

    // Test video generation (this is a simplified example)
    const response = await fetch('https://api.runwayml.com/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RUNWAY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        duration: duration,
        model: "gen3",
        resolution: "1280x720"
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Video generation failed' }));
      throw new Error(`Runway API Error: ${error.message || response.statusText}`);
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: "Video generation initiated",
      taskId: result.id || 'demo-task-id',
      status: result.status || 'processing',
      estimatedTime: '30-60 seconds',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Runway Video Generation Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
