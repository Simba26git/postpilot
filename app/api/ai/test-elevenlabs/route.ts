import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Test ElevenLabs API key by fetching available voices
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.ELEVENLABS_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(`ElevenLabs API Error: ${error.message || response.statusText}`);
    }

    const voices = await response.json();

    return NextResponse.json({
      success: true,
      message: "ElevenLabs API connection successful",
      voiceCount: voices.voices?.length || 0,
      availableVoices: voices.voices?.slice(0, 5).map((voice: any) => ({
        id: voice.voice_id,
        name: voice.name,
        category: voice.category
      })) || [],
      timestamp: new Date().toISOString(),
      apiKey: process.env.ELEVENLABS_API_KEY ? `${process.env.ELEVENLABS_API_KEY.substring(0, 20)}...` : 'Not found'
    });

  } catch (error: any) {
    console.error('ElevenLabs API Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
      apiKey: process.env.ELEVENLABS_API_KEY ? `${process.env.ELEVENLABS_API_KEY.substring(0, 20)}...` : 'Not found'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text, voice_id = "21m00Tcm4TlvDq8ikWAM" } = await request.json();

    if (!text) {
      return NextResponse.json({
        success: false,
        error: "Text is required"
      }, { status: 400 });
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ELEVENLABS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Voice generation failed' }));
      throw new Error(`ElevenLabs API Error: ${error.message || response.statusText}`);
    }

    // For demo purposes, we'll return success without the actual audio file
    return NextResponse.json({
      success: true,
      message: "Voice generation successful",
      audioUrl: "/demo-audio.mp3", // This would be the actual audio URL in production
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('ElevenLabs Voice Generation Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
