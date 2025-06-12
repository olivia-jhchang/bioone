// Google Gemini API 서비스
const GEMINI_API_KEY = 'AIzaSyD2PnT_SKHNti1weewk8iF7Z_vf330B_b8';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export interface SearchResult {
  query: string;
  response: string;
  materials: Array<{
    name: string;
    description: string;
    category: string;
    applications: string[];
    properties: {
      biodegradable: boolean;
      biocompatible: boolean;
    };
  }>;
}

// 검색어에 따른 관련 대체 소재 제공
function getRelevantFallbackMaterials(query: string) {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('배양세포주') || lowerQuery.includes('세포주') || lowerQuery.includes('세포')) {
    return [
      {
        name: "HeLa 세포주",
        description: "자궁경부암에서 유래한 인간 불멸화 세포주",
        category: "배양세포주",
        applications: ["암 연구", "세포생물학", "바이러스 연구"],
        properties: { biodegradable: false, biocompatible: true }
      },
      {
        name: "CHO 세포주",
        description: "중국 햄스터 난소 세포에서 유래한 세포주",
        category: "배양세포주", 
        applications: ["단백질 생산", "바이오의약품 제조"],
        properties: { biodegradable: false, biocompatible: true }
      }
    ];
  }
  
  if (lowerQuery.includes('줄기세포')) {
    return [
      {
        name: "iPSC (유도만능줄기세포)",
        description: "성체 세포를 역분화시켜 만든 유도만능줄기세포",
        category: "배양세포주",
        applications: ["재생의학", "질병 모델링", "약물 스크리닝"],
        properties: { biodegradable: false, biocompatible: true }
      }
    ];
  }
  
  // 기본 소재
  return [
    {
      name: "PLA (Polylactic Acid)",
      description: "옥수수나 사탕수수에서 추출한 생분해성 플라스틱",
      category: "생분해성 폴리머",
      applications: ["식품 포장재", "의료용 임플란트", "3D 프린팅"],
      properties: { biodegradable: true, biocompatible: true }
    }
  ];
}

export async function searchWithGemini(query: string, crawledContext: string): Promise<SearchResult> {
  console.log('Starting RAG-based Gemini search for query:', query);
  
  try {
    const prompt = `
당신은 바이오소재 및 생명과학 분야의 전문 AI 어시스턴트입니다.
사용자가 "${query}"(으)로 검색하여 얻은 실시간 검색 결과를 아래 [크롤링된 컨텍스트]에 제공합니다.
이 컨텍스트만을 기반으로 답변을 생성해주세요.

[크롤링된 컨텍스트]
${crawledContext}
[크롤링된 컨텍스트 끝]

다음 작업들을 수행해주세요:
1.  **핵심 요약**: 제공된 컨텍스트를 바탕으로 "${query}"에 대한 핵심 내용을 2~3문장으로 요약해주세요.
2.  **주요 소재 식별**: 컨텍스트에서 언급된 주요 바이오소재를 최대 3개까지 식별하고, 각 소재의 이름과 설명을 목록으로 만들어주세요.
3.  **주요 응용 분야**: 컨텍스트에서 찾아낸 가장 중요한 응용 분야들을 나열해주세요.

만약 컨텍스트가 비어 있거나 관련 정보가 없다면, "제공된 정보 내에서 '${query}'에 대한 유의미한 결과를 찾을 수 없었습니다."라고 답변해주세요.
모든 답변은 반드시 한국어로 작성해야 합니다.
`;

    console.log('Sending RAG prompt to Gemini API...');

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
          temperature: 0.5,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API HTTP Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Gemini API HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data: GeminiResponse = await response.json();
    console.log('Gemini API Response:', JSON.stringify(data, null, 2));
    
    if (!data.candidates || data.candidates.length === 0) {
      console.error('No candidates in Gemini response:', data);
      throw new Error('No response from Gemini API - no candidates found');
    }

    if (!data.candidates[0].content || !data.candidates[0].content.parts || data.candidates[0].content.parts.length === 0) {
      console.error('Invalid content structure:', data.candidates[0]);
      throw new Error('Invalid response structure from Gemini API');
    }

    const geminiResponse = data.candidates[0].content.parts[0].text;

    // AI 응답을 기반으로 추천 소재 목록을 생성해야 하지만, 
    // 여기서는 AI가 생성한 텍스트 응답을 그대로 사용하고, 추천 소재는 fallback으로 처리합니다.
    return {
      query,
      response: geminiResponse,
      materials: getRelevantFallbackMaterials(query) // AI 응답 파싱이 복잡하므로 fallback 유지
    };
  
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // 더 자세한 에러 로깅
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // 에러 시 기본 응답 반환
    return {
      query,
      response: `"${query}"에 대한 AI 요약을 생성하는 중 오류가 발생했습니다.

**AI 분석 상태:** 
현재 Google Gemini AI가 제공된 정보를 분석하는 데 일시적인 지연이 있습니다. 아래의 원본 검색 결과를 참고해주세요.`,
      materials: getRelevantFallbackMaterials(query)
    };
  }
}

export async function getRelatedMaterials(query: string) {
  const prompt = `
바이오소재 데이터베이스에서 "${query}"와 관련된 소재들을 JSON 형식으로 제공해주세요.

다음 형식으로 답변해주세요:
{
  "materials": [
    {
      "name": "소재명",
      "description": "소재 설명",
      "category": "카테고리",
      "applications": ["응용1", "응용2"],
      "properties": {
        "biodegradable": true/false,
        "biocompatible": true/false
      }
    }
  ]
}
`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048,
        }
      })
    });

    const data: GeminiResponse = await response.json();
    return data.candidates[0].content.parts[0].text;
    
  } catch (error) {
    console.error('Error getting related materials:', error);
    return null;
  }
} 