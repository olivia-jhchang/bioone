'use client';

import React, { useState, useMemo } from 'react';
import FilterPanel from '@/components/FilterPanel';
import BiomaterialCard from '@/components/BiomaterialCard';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AISearchResults from '@/components/AISearchResults';
import { SearchFilters, Biomaterial } from '@/types/biomaterial';
import { sampleBiomaterials } from '@/data/biomaterials';
import { searchWithGemini, SearchResult } from '@/lib/gemini';
import { searchBioOne, convertBioOneTobiomaterial } from '@/lib/bioone-crawler';
import { Search, Beaker, Shield, Recycle } from 'lucide-react';

// 키워드 매칭 함수
function checkKeywordMatches(query: string, material: Biomaterial): boolean {
  const lowerQuery = query.toLowerCase();
  
  const keywordMappings: { [key: string]: string[] } = {
    'bacillus': ['bacillus', '바실러스'],
    '배양세포주': ['hela', 'cho', 'hek293', 'ipsc', '세포주', '세포', '배양', '줄기세포'],
    '세포': ['hela', 'cho', 'hek293', 'ipsc', '세포주', '배양세포주', '줄기세포'],
    '줄기세포': ['ipsc', '유도만능줄기세포', '줄기세포', '재생의학'],
    '플라스틱': ['pla', 'pcl', '폴리락트산', '폴리카프로락톤', '생분해성'],
    '콜라겐': ['콜라겐', '상처치료', '피부재생', '단백질'],
    '키토산': ['키토산', '항균', '갑각류', '다당류'],
    '하이드로겔': ['하이드로겔', 'peg', '수분', '조직공학'],
    '바이오세라믹': ['하이드록시아파타이트', '세라믹', '임플란트', '정형외과']
  };

  for (const [keyword, relatedTerms] of Object.entries(keywordMappings)) {
    if (lowerQuery.includes(keyword)) {
      return relatedTerms.some(term => 
        material.name.toLowerCase().includes(term) ||
        material.description.toLowerCase().includes(term) ||
        material.category.toLowerCase().includes(term) ||
        material.subcategory?.toLowerCase().includes(term)
      );
    }
  }
  
  return false;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [aiResult, setAiResult] = useState<SearchResult | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [bioOneMaterials, setBioOneMaterials] = useState<Biomaterial[]>([]);
  const [isLoadingBioOne, setIsLoadingBioOne] = useState(false);

  const filteredMaterials = useMemo(() => {
    // 샘플 데이터와 BioOne 데이터 합치기
    let results = [...sampleBiomaterials, ...bioOneMaterials];

    // 검색어 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(material => {
        const nameMatch = material.name.toLowerCase().includes(query);
        const descriptionMatch = material.description.toLowerCase().includes(query);
        const categoryMatch = material.category.toLowerCase().includes(query);
        const subcategoryMatch = material.subcategory?.toLowerCase().includes(query);
        const applicationMatch = material.applications.some((app: string) => 
          app.toLowerCase().includes(query)
        );
        
        // 더 정확한 매칭을 위한 키워드 매핑
        const keywordMatches = checkKeywordMatches(query, material);
        
        return nameMatch || descriptionMatch || categoryMatch || subcategoryMatch || applicationMatch || keywordMatches;
      });
    }

    // 카테고리 필터링
    if (filters.category) {
      results = results.filter(material => material.category === filters.category);
    }

    // 생분해성 필터링
    if (filters.biodegradable !== undefined) {
      results = results.filter(material => material.properties.biodegradable === filters.biodegradable);
    }

    // 생체적합성 필터링
    if (filters.biocompatible) {
      results = results.filter(material => material.properties.biocompatible === true);
    }

    // 재고 필터링
    if (filters.inStock) {
      results = results.filter(material => material.inStock === true);
    }

    // 용도 필터링
    if (filters.applications && filters.applications.length > 0) {
      results = results.filter(material =>
        filters.applications!.some(app => material.applications.includes(app))
      );
    }

    return results;
  }, [searchQuery, filters, bioOneMaterials]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setShowResults(true);
    setBioOneMaterials([]);
    setAiResult(null);

    if (query.trim()) {
      setIsLoadingBioOne(true);
      setIsAiLoading(true);

      try {
        console.log('1. Starting BioOne crawling for:', query);
        const bioOneResult = await searchBioOne(query);

        let convertedMaterials: Biomaterial[] = [];
        if (bioOneResult.success && bioOneResult.data.length > 0) {
          convertedMaterials = bioOneResult.data.map(convertBioOneTobiomaterial);
          setBioOneMaterials(convertedMaterials);
          console.log(`2. BioOne crawling successful: ${convertedMaterials.length} items found.`);
        } else {
          setBioOneMaterials([]);
          console.log('2. BioOne crawling returned no results.');
        }
        setIsLoadingBioOne(false);

        const contextForAI = JSON.stringify(bioOneResult.data, null, 2);
        console.log('3. Sending crawled context to Gemini AI.');
        const aiSummaryResult = await searchWithGemini(query, contextForAI);

        setAiResult(aiSummaryResult);
        console.log('4. AI summary generation successful.');

      } catch (error) {
        console.error('Search pipeline failed:', error);
        setAiResult({
          query,
          response: `"${query}"에 대한 검색 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.`,
          materials: []
        });
        setBioOneMaterials([]);
      } finally {
        setIsLoadingBioOne(false);
        setIsAiLoading(false);
        console.log('5. Search pipeline finished.');
      }
    } else {
      setAiResult(null);
      setBioOneMaterials([]);
    }
  };

  // 초기 상태 (검색 전)에는 히어로 섹션만 표시
  if (!showResults) {
    return (
      <div>
        <Header />
        <HeroSection onSearch={handleSearch} />
      </div>
    );
  }

  // 검색 후 결과 페이지
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      
      {/* 검색 결과 헤더 */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">검색 결과</h1>
              <p className="text-purple-100">
                {searchQuery ? `"${searchQuery}"에 대한 ${filteredMaterials.length}개의 결과` : `총 ${filteredMaterials.length}개의 소재`}
              </p>
            </div>
            <button
              onClick={() => setShowResults(false)}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-colors"
            >
              새로운 검색
            </button>
          </div>
          
          {/* 통계 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Beaker className="h-8 w-8 mx-auto mb-2 text-purple-200" />
              <div className="text-2xl font-bold">{filteredMaterials.length}</div>
              <div className="text-purple-200">검색된 소재</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Shield className="h-8 w-8 mx-auto mb-2 text-purple-200" />
              <div className="text-2xl font-bold">
                {filteredMaterials.filter(m => m.properties.biocompatible).length}
              </div>
              <div className="text-purple-200">생체적합성 소재</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Recycle className="h-8 w-8 mx-auto mb-2 text-purple-200" />
              <div className="text-2xl font-bold">
                {filteredMaterials.filter(m => m.properties.biodegradable).length}
              </div>
              <div className="text-purple-200">생분해성 소재</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 사이드바 - 필터 */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-4">
              <FilterPanel
                filters={filters}
                onFilterChange={setFilters}
                isOpen={showFilters}
                onToggle={() => setShowFilters(!showFilters)}
              />
            </div>
          </div>

          {/* 메인 콘텐츠 - 검색 결과 */}
          <div className="flex-1">
            {/* AI 검색 결과 */}
            <AISearchResults result={aiResult} isLoading={isAiLoading} />
            
            {/* 검색 결과 헤더 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-gray-400" />
                <span className="text-lg font-semibold text-gray-900">
                  검색 결과 ({filteredMaterials.length}개)
                </span>
                {searchQuery && (
                  <span className="text-gray-500">
                    &quot;{searchQuery}&quot;에 대한 결과
                  </span>
                )}
                {isLoadingBioOne && (
                  <div className="flex items-center text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    <span className="text-sm">BioOne 검색 중...</span>
                  </div>
                )}
              </div>
            </div>

            {/* 검색 결과가 없을 때 */}
            {filteredMaterials.length === 0 ? (
              <div className="text-center py-16">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  검색 결과가 없습니다
                </h3>
                <p className="text-gray-500 mb-4">
                  다른 검색어를 시도하거나 필터를 조정해보세요.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({});
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  모든 소재 보기
                </button>
              </div>
            ) : (
              /* 검색 결과 그리드 */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMaterials.map((material) => (
                  <BiomaterialCard
                    key={material.id}
                    material={material}
                    onClick={() => {
                      // 상세 페이지로 이동하는 로직을 여기에 추가할 수 있습니다
                      console.log('Material clicked:', material.id);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">All in One</h3>
              <p className="text-gray-300">
                바이오소재 정보를 한 곳에서 찾을 수 있는 AI 통합플랫폼
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">서비스</h3>
              <ul className="space-y-2 text-gray-300">
                <li>바이오소재 검색</li>
                <li>AI 추천 시스템</li>
                <li>속성별 필터링</li>
                <li>상세 정보 제공</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">지원</h3>
              <ul className="space-y-2 text-gray-300">
                <li>문의하기</li>
                <li>사용 가이드</li>
                <li>FAQ</li>
                <li>개발자 문서</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 All in One. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
