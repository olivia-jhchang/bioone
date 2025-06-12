import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { BioOneSearchResponse, BioOneResult } from '@/lib/bioone-crawler';

const BIOONE_BASE_URL = 'https://www.bioone.re.kr';

// 웹페이지 크롤링 (API가 없는 경우)
export async function POST(request: NextRequest) {
  try {
    const { query, page = 1, limit = 20 } = await request.json();

    if (!query) {
      return NextResponse.json({ error: '검색어가 필요합니다.' }, { status: 400 });
    }

    // BioOne 검색 URL 구성 (실제 사이트의 URL 구조 반영)
    const searchUrl = `${BIOONE_BASE_URL}/search`;
    const searchParams = new URLSearchParams({
      searchQuery: query,
      searchField: 'ALL',
      pageIndex: page.toString(),
      searchAll: 'Y'
    });
    const fullUrl = `${searchUrl}?${searchParams}`;
    
    console.log('BioOne 크롤링 시작:', fullUrl);

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
      },
    });

    if (!response.ok) {
      throw new Error(`BioOne 요청 실패: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const results: BioOneResult[] = [];
    
    // 실제 BioOne 검색 결과 구조에 맞춘 선택자 (중요 업데이트)
    $('ul.search_list > li').each((index, element) => {
      const $element = $(element);
      try {
        const name = $element.find('div.cont_box > a.go_view').text().trim();
        const detailLink = $element.find('div.cont_box > a.go_view').attr('href');
        
        const details: { [key: string]: string } = {};
        $element.find('ul.info_list > li').each((i, li) => {
          const $li = $(li);
          const key = $li.find('span.tit').text().trim();
          const value = $li.find('span.dat').text().trim();
          if (key && value) {
            details[key] = value;
          }
        });
        
        const description = Object.entries(details).map(([k, v]) => `${k}: ${v}`).join(', ');
        const cluster = details['소재클러스터'] || '정보 없음';
        const resourceType = details['자원종류'] || '정보 없음';
        
        if (name) {
          results.push({
            id: `bioone-${cluster}-${index}`,
            name,
            description: description || '자세한 정보는 링크를 확인하세요.',
            category: cluster,
            cluster: cluster,
            resourceType: resourceType,
            applications: [cluster, resourceType].filter(Boolean),
            properties: {
              biodegradable: description.includes('생분해'),
              biocompatible: description.includes('생체적합'),
              distributionAvailable: description.includes('분양가능'),
              exportAvailable: description.includes('국외반출가능'),
            },
            source: 'BioOne',
            url: detailLink ? `${BIOONE_BASE_URL}${detailLink}` : fullUrl,
          });
        }
      } catch (e) {
        console.error('개별 항목 파싱 중 오류 발생:', e);
      }
    });

    const totalText = $('div.search_result_box > p.total > span').text();
    const total = parseInt(totalText.replace(/,/g, ''), 10) || results.length;

    const response_data: BioOneSearchResponse = {
      success: true,
      data: results.slice(0, limit),
      total,
      page,
    };

    console.log(`BioOne 크롤링 완료: 총 ${total}개 중 ${results.length}개 결과 파싱 성공`);
    return NextResponse.json(response_data);

  } catch (error) {
    console.error('BioOne 크롤링 API 전체 오류:', error);
    return NextResponse.json(
      { success: false, data: [], total: 0, page: 1, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 