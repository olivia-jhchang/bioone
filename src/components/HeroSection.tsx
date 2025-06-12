'use client';

import React, { useState } from 'react';
import SearchBar from './SearchBar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  onSearch: (query: string) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const [currentSuggestion, setCurrentSuggestion] = useState(0);
  
  const suggestions = [
    "접일 예시",
    "유전자 편집이 위 한 배양배로수",
    "고온에서 견디는 인체에 무해한 플라스틱"
  ];

  const nextSuggestion = () => {
    setCurrentSuggestion((prev) => (prev + 1) % suggestions.length);
  };

  const prevSuggestion = () => {
    setCurrentSuggestion((prev) => (prev - 1 + suggestions.length) % suggestions.length);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image with Animation */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-zoom-in"
        style={{
          backgroundImage: 'url(/main-visual-2.jpg)',
          transformOrigin: 'center center'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-purple-800/40"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center text-white">
        {/* Logo and title */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-4 backdrop-blur-sm">
              <span className="text-white font-bold text-2xl">A</span>
            </div>
            <h1 className="text-5xl font-bold">All in One</h1>
          </div>
          <h2 className="text-3xl font-medium mb-4">바이오소재 정보 AI 통합플랫폼</h2>
        </div>

        {/* Search section */}
        <div className="w-full max-w-4xl mb-8">
          <SearchBar 
            onSearch={onSearch}
            className="mb-6"
          />
          
          {/* Search suggestions carousel */}
          <div className="relative">
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={prevSuggestion}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              
              <div className="flex space-x-3">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => onSearch(suggestion)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors backdrop-blur-sm ${
                      index === currentSuggestion
                        ? 'bg-purple-600/80 text-white'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              
              <button
                onClick={nextSuggestion}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Information box */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-3xl">
          <p className="text-white/90 text-sm leading-relaxed">
            ● 현재 합성생물학, 배양육, 천연물, 미생물, 모델물품, 촉매, 추출, 제형화, 식품첨가 등 플라스틱이 언제까지 하닙니다.
            <br />
            앞으로 지속적으로 업데이트하며 더원한 정보를 제공 예정입니다.
          </p>
        </div>

        {/* Bottom right search indicators */}
        <div className="absolute bottom-8 right-8 flex flex-col space-y-2">
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-white">
            SEARCH
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-white">
            NEW
          </div>
        </div>
      </div>
    </div>
  );
} 