import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = 'AIzaSyD2PnT_SKHNti1weewk8iF7Z_vf330B_b8';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export async function POST(request: NextRequest) {
  try {
    const { query = 'PLA' } = await request.json();
    
    console.log('Testing Gemini API with query:', query);
    
    const prompt = `간단히 "${query}"에 대해 설명해주세요.`;
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 512,
        }
      })
    });

    console.log('Gemini API Response Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      return NextResponse.json({
        success: false,
        error: errorText,
        status: response.status
      }, { status: response.status });
    }

    const data = await response.json();
    console.log('Gemini API Success:', data);
    
    return NextResponse.json({
      success: true,
      query,
      response: data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response text',
      rawData: data
    });

  } catch (error) {
    console.error('Test API Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Gemini API 테스트 엔드포인트입니다. POST 요청을 보내주세요.',
    usage: 'POST /api/test-gemini with { "query": "your search term" }'
  });
} 