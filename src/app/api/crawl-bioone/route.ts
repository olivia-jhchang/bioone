import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { BioOneSearchResponse, BioOneResult } from '@/lib/bioone-crawler';

const BIOONE_BASE_URL = 'https://www.bioone.re.kr';

export async function POST(request: NextRequest) {
  try {
    const { query, page = 1, limit = 20 } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: '검색어가 필요합니다.' },
        { status: 400 }
      );
    }

    // BioOne 검색 URL 구성
    const searchUrl = `${BIOONE_BASE_URL}/search`;
    const searchParams = new URLSearchParams({
      searchTerm: query,
      searchField: 'ALL',
      page: page.toString(),
      rowsPerPage: limit.toString()
    });

    const fullUrl = `${searchUrl}?${searchParams}`;
    
    console.log('BioOne 크롤링 시작:', fullUrl);

    // BioOne 웹사이트에 요청
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
    });

    if (!response.ok) {
      throw new Error(`BioOne 요청 실패: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // 검색 결과 파싱
    const results: BioOneResult[] = [];
    
    // BioOne 검색 결과 구조에 맞게 파싱 (실제 구조를 확인 후 수정 필요)
    $('.search-result-item, .result-item, .material-item').each((index, element) => {
      const $element = $(element);
      
      try {
        const name = $element.find('.title, .name, h3, h4').first().text().trim();
        const description = $element.find('.description, .summary, p').first().text().trim();
        const category = $element.find('.category, .type').first().text().trim() || '기타';
        const cluster = $element.find('.cluster').first().text().trim() || '일반';
        const resourceType = $element.find('.resource-type, .material-type').first().text().trim() || '기타';
        
        if (name) {
          const result: BioOneResult = {
            id: `bioone-${Date.now()}-${index}`,
            name,
            description: description || name,
            category: category || '바이오소재',
            cluster,
            resourceType,
            applications: [category, cluster].filter(Boolean),
            properties: {
              biodegradable: description.includes('생분해') || description.includes('biodegradable'),
              biocompatible: description.includes('생체적합') || description.includes('biocompatible'),
              distributionAvailable: true, // 기본값
              exportAvailable: false // 기본값
            },
            source: 'BioOne',
            url: $element.find('a').first().attr('href') || undefined
          };
          
          results.push(result);
        }
      } catch (error) {
        console.error('검색 결과 파싱 오류:', error);
      }
    });

    // 결과가 없는 경우 대체 파싱 시도
    if (results.length === 0) {
      // 다른 선택자로 시도
      $('.list-item, .data-row, tr').each((index, element) => {
        const $element = $(element);
        const text = $element.text().trim();
        
        if (text && text.length > 10 && text.toLowerCase().includes(query.toLowerCase())) {
          const result: BioOneResult = {
            id: `bioone-alt-${Date.now()}-${index}`,
            name: text.substring(0, 100),
            description: text,
            category: '검색결과',
            cluster: '일반',
            resourceType: '데이터',
            applications: ['검색결과'],
            properties: {
              biodegradable: text.includes('생분해'),
              biocompatible: text.includes('생체적합'),
              distributionAvailable: true,
              exportAvailable: false
            },
            source: 'BioOne'
          };
          
          results.push(result);
        }
      });
    }

    // 실제 총 개수 파싱 (페이지네이션 정보에서)
    const totalText = $('.total-count, .result-count').first().text();
    const totalMatch = totalText.match(/(\d+)/);
    const total = totalMatch ? parseInt(totalMatch[1]) : results.length;

    const response_data: BioOneSearchResponse = {
      success: true,
      data: results.slice(0, limit),
      total,
      page
    };

    console.log(`BioOne 크롤링 완료: ${results.length}개 결과 찾음`);

    return NextResponse.json(response_data);

  } catch (error) {
    console.error('BioOne 크롤링 오류:', error);
    
    return NextResponse.json(
      {
        success: false,
        data: [],
        total: 0,
        page: 1,
        error: '크롤링 중 오류가 발생했습니다.'
      },
      { status: 500 }
    );
  }
} 