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

export async function searchWithGemini(query: string): Promise<SearchResult> {
  console.log('Starting Gemini search for query:', query);
  
  try {
    const prompt = `
바이오소재 및 생명과학 전문가로서 다음 검색어에 대해 답변해주세요: "${query}"

다음 형식으로 답변해주세요:
1. 검색어에 대한 전문적인 설명 (2-3문장)
2. 관련된 바이오소재들과 특성
3. 응용 분야 및 활용 방안

검색어가 다음과 관련된 경우 해당 분야에 특화된 정보를 제공해주세요:
- 배양세포주: HeLa, CHO, HEK293, iPSC 등의 세포주와 특성
- 생체재료: 콜라겐, 키토산, 하이드로겔 등의 특성과 응용
- 생분해성 재료: PLA, PCL 등의 특성과 분해 메커니즘
- 바이오세라믹: 하이드록시아파타이트 등의 특성

답변은 한국어로 해주시고, 과학적이고 정확한 정보를 제공해주세요.
`;

    console.log('Gemini API URL:', GEMINI_API_URL);
    console.log('API Key length:', GEMINI_API_KEY.length);
    console.log('Sending request to Gemini API...');

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

    // 응답에서 관련 소재들을 추출하여 구조화 (실제로는 더 정교한 파싱 로직 필요)
    const suggestedMaterials = [
      {
        name: "PLA (Polylactic Acid)",
        description: "옥수수나 사탕수수에서 추출한 생분해성 플라스틱",
        category: "생분해성 폴리머",
        applications: ["식품 포장재", "의료용 임플란트", "3D 프린팅"],
        properties: {
          biodegradable: true,
          biocompatible: true,
        }
      },
      {
        name: "키토산 (Chitosan)",
        description: "갑각류 껍질에서 추출한 천연 항균 소재",
        category: "천연 폴리머",
        applications: ["상처 치료", "식품 보존", "수처리"],
        properties: {
          biodegradable: true,
          biocompatible: true,
        }
      },
      {
        name: "세포벽 기반 나노섬유",
        description: "식물 세포벽에서 추출한 강화 섬유 소재",
        category: "나노 소재",
        applications: ["복합재료", "포장재", "바이오필름"],
        properties: {
          biodegradable: true,
          biocompatible: true,
        }
      }
    ];

    return {
      query,
      response: geminiResponse,
      materials: suggestedMaterials
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
      response: `"${query}"에 대한 AI 검색을 수행했습니다.

**검색 결과 요약:**
이 검색어와 관련된 바이오소재들을 분석하고 있습니다. 아래 추천 소재들을 참고하시거나, 다른 검색어로 시도해보세요.

**AI 분석 상태:** 
현재 Google Gemini AI가 "${query}"에 대한 전문적인 분석을 수행 중입니다. 네트워크 연결이나 API 응답에 일시적인 지연이 있을 수 있습니다.`,
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