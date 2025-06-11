'use client';

import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FilterPanel from '@/components/FilterPanel';
import BiomaterialCard from '@/components/BiomaterialCard';
import { SearchFilters, Biomaterial } from '@/types/biomaterial';
import { sampleBiomaterials } from '@/data/biomaterials';
import { Search, Beaker, Shield, Recycle, ArrowRight, TrendingUp, Users, Database } from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const filteredMaterials = useMemo(() => {
    let results = sampleBiomaterials;

    // 검색어 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(material =>
        material.name.toLowerCase().includes(query) ||
        material.description.toLowerCase().includes(query) ||
        material.category.toLowerCase().includes(query) ||
        material.applications.some(app => app.toLowerCase().includes(query))
      );
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
  }, [searchQuery, filters]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowSearchResults(true);
  };

  if (!showSearchResults) {
    return (
      <div className="min-h-screen">
        <Header />
        <HeroSection onSearch={handleSearch} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Search Results Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 pt-20 pb-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setShowSearchResults(false)}
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>홈으로 돌아가기</span>
            </button>
            
            <div className="flex items-center space-x-6 text-white">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <span className="text-sm">{filteredMaterials.length}개 결과</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm">최신순</span>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">
            검색 결과
          </h1>
          {searchQuery && (
            <p className="text-purple-200">
              &quot;{searchQuery}&quot;에 대한 {filteredMaterials.length}개의 결과를 찾았습니다.
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
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
              
              {/* Statistics Card */}
              <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">플랫폼 통계</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Beaker className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-gray-600">총 소재</span>
                    </div>
                    <span className="font-semibold text-gray-900">{sampleBiomaterials.length}개</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600">생체적합성</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {sampleBiomaterials.filter(m => m.properties.biocompatible).length}개
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Recycle className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-600">생분해성</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {sampleBiomaterials.filter(m => m.properties.biodegradable).length}개
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-orange-600" />
                      <span className="text-sm text-gray-600">활성 사용자</span>
                    </div>
                    <span className="font-semibold text-gray-900">1,234명</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 메인 콘텐츠 - 검색 결과 */}
          <div className="flex-1">
            {/* 검색 결과가 없을 때 */}
            {filteredMaterials.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  검색 결과가 없습니다
                </h3>
                <p className="text-gray-500 mb-6">
                  다른 검색어를 시도하거나 필터를 조정해보세요.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({});
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
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
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <span className="text-xl font-bold">BioOne</span>
              </div>
              <p className="text-gray-400 text-sm">
                바이오소재 분야의 혁신을 이끌어가는 AI 통합 플랫폼입니다.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">주요 카테고리</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>생분해성 플라스틱</li>
                <li>천연 생체재료</li>
                <li>하이드로겔</li>
                <li>바이오세라믹</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">서비스</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>AI 소재 검색</li>
                <li>물성 분석</li>
                <li>공급업체 연결</li>
                <li>시장 동향</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">문의</h3>
              <p className="text-gray-400 text-sm">
                더 많은 정보가 필요하시면 언제든 연락주세요.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2024 BioOne. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
