// BioOne 웹사이트 크롤링 서비스
import { Biomaterial } from '@/types/biomaterial';

const BIOONE_BASE_URL = 'https://www.bioone.re.kr';
const BIOONE_API_URL = `${BIOONE_BASE_URL}/api`;

export interface BioOneSearchResponse {
  success: boolean;
  data: BioOneResult[];
  total: number;
  page: number;
}

export interface BioOneResult {
  id: string;
  name: string;
  description: string;
  category: string;
  cluster: string;
  resourceType: string;
  applications: string[];
  properties: {
    biodegradable: boolean;
    biocompatible: boolean;
    distributionAvailable: boolean;
    exportAvailable: boolean;
  };
  source: string;
  url?: string;
}

// BioOne 검색 API 호출
export async function searchBioOne(query: string, page: number = 1, limit: number = 20): Promise<BioOneSearchResponse> {
  try {
    // BioOne 통합검색 API 호출 (실제 API 엔드포인트 추정)
    const searchParams = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
      type: 'all' // 통합검색
    });

    const response = await fetch(`${BIOONE_API_URL}/search?${searchParams}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'BioOne-Integration-Platform',
      },
    });

    if (!response.ok) {
      // API가 없는 경우 웹 페이지 크롤링 시도
      return await crawlBioOneWebsite(query, page, limit);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('BioOne API search failed:', error);
    // API 실패 시 웹 크롤링으로 폴백
    return await crawlBioOneWebsite(query, page, limit);
  }
}

// 웹페이지 크롤링 (API가 없는 경우)
async function crawlBioOneWebsite(query: string, page: number, limit: number): Promise<BioOneSearchResponse> {
  try {
    // Next.js API 라우트를 통해 서버사이드에서 크롤링
    const response = await fetch('/api/crawl-bioone', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        page,
        limit
      }),
    });

    if (!response.ok) {
      throw new Error(`크롤링 실패: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('BioOne 웹사이트 크롤링 실패:', error);
    
    // 크롤링 실패 시 기본 응답
    return {
      success: false,
      data: [],
      total: 0,
      page: 1
    };
  }
}

// BioOne 결과를 우리 앱의 Biomaterial 형식으로 변환
export function convertBioOneTobiomaterial(bioOneResult: BioOneResult): Biomaterial {
  const currentDate = new Date();
  
  return {
    id: bioOneResult.id,
    name: bioOneResult.name,
    description: bioOneResult.description,
    category: bioOneResult.category,
    subcategory: bioOneResult.resourceType,
    applications: bioOneResult.applications,
    properties: {
      biodegradable: bioOneResult.properties.biodegradable,
      biocompatible: bioOneResult.properties.biocompatible,
    },
    inStock: bioOneResult.properties.distributionAvailable,
    suppliers: ['BioOne 연계기관'],
    certification: [],
    imageUrl: '/images/biomaterial-placeholder.jpg',
    price: {
      amount: 0,
      unit: 'per sample',
      currency: 'KRW'
    },
    createdAt: currentDate,
    updatedAt: currentDate
  };
}

// 인기 검색어 가져오기
export async function getPopularKeywords(): Promise<string[]> {
  try {
    const response = await fetch('/api/bioone-popular-keywords');
    if (!response.ok) {
      throw new Error('인기 검색어 가져오기 실패');
    }
    const data = await response.json();
    return data.keywords || [];
  } catch (error) {
    console.error('인기 검색어 가져오기 실패:', error);
    // 기본 인기 검색어
    return [
      'bacillus subtilis',
      'Cancer',
      'Bacillus',
      'Covid',
      'bifidobacterium',
      '사과',
      'CAR-NK'
    ];
  }
}

// 클러스터별 검색
export async function searchByCluster(cluster: string): Promise<BioOneSearchResponse> {
  const clusterMap: { [key: string]: string } = {
    '인체유래물': 'human-derived',
    '줄기세포': 'stem-cell',
    '병원체': 'pathogen',
    '배양세포': 'cell-culture',
    '모델동물': 'model-animal',
    '뇌': 'brain',
    '미생물': 'microorganism',
    '천연물': 'natural-product',
    '합성화합물': 'synthetic-compound',
    '축산': 'livestock',
    '종자': 'seed',
    '해양생물': 'marine-life',
    '수산생물': 'aquatic-life',
    '야생생물': 'wildlife'
  };

  const clusterKey = clusterMap[cluster] || cluster;
  return await searchBioOne(`cluster:${clusterKey}`);
} 