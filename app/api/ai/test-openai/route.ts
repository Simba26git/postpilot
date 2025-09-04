import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Test the OpenAI API key with a simple completion using fetch
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant for testing API connectivity."
          },
          {
            role: "user",
            content: "Say 'OpenAI API is working correctly!' if you can read this message."
          }
        ],
        max_tokens: 50,
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API Error: ${error.error?.message || 'Unknown error'}`);
    }

    const completion = await response.json();
    const aiResponse = completion.choices[0]?.message?.content || 'No response';

    return NextResponse.json({
      success: true,
      message: "OpenAI API connection successful",
      response: aiResponse,
      model: completion.model,
      usage: completion.usage,
      timestamp: new Date().toISOString(),
      apiKey: process.env.OPENAI_API_KEY ? `${process.env.OPENAI_API_KEY.substring(0, 20)}...` : 'Not found'
    });

  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
      apiKey: process.env.OPENAI_API_KEY ? `${process.env.OPENAI_API_KEY.substring(0, 20)}...` : 'Not found'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, model = "gpt-3.5-turbo", max_tokens = 150 } = await request.json();

    if (!prompt) {
      return NextResponse.json({
        success: false,
        error: "Prompt is required"
      }, { status: 400 });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant for social media content creation."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: max_tokens,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API Error: ${error.error?.message || 'Unknown error'}`);
    }

    const completion = await response.json();
    const aiResponse = completion.choices[0]?.message?.content || 'No response';

    return NextResponse.json({
      success: true,
      response: aiResponse,
      model: completion.model,
      usage: completion.usage,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
