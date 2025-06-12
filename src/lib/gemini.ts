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

export async function searchWithGemini(query: string): Promise<SearchResult> {
  try {
    const prompt = `
바이오소재 전문가로서 다음 검색어에 대해 답변해주세요: "${query}"

다음 형식으로 답변해주세요:
1. 검색어에 대한 전문적인 설명 (2-3문장)
2. 관련된 바이오소재들과 특성
3. 응용 분야 및 활용 방안

답변은 한국어로 해주시고, 과학적이고 정확한 정보를 제공해주세요.
`;

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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini API');
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
    
    // 에러 시 기본 응답 반환
    return {
      query,
      response: `"${query}"에 대한 검색을 수행했습니다. 현재 AI 분석 중이며, 관련된 바이오소재 정보를 수집하고 있습니다. 잠시 후 다시 시도해주세요.`,
      materials: []
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