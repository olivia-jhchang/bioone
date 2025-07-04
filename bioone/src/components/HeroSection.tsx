'use client';

import React, { useState } from 'react';
import { Search, Bot, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  onSearch: (query: string) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const searchSuggestions = [
    '접일 예시',
    '유전자 편집이 위한 배양배로수',
    '고온에서 견디는 인체에 무해한 플라스틱'
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        {/* Top left sphere */}
        <div className="absolute top-20 left-20 w-80 h-80 rounded-full bg-gradient-to-br from-purple-400/30 to-purple-600/30 blur-sm"></div>
        
        {/* Bottom right molecular structure */}
        <div className="absolute bottom-0 right-0 w-96 h-96 opacity-30">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            <defs>
              <pattern id="molecule" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="3" fill="rgba(255,255,255,0.3)"/>
              </pattern>
            </defs>
            <rect width="400" height="400" fill="url(#molecule)"/>
            {/* Molecular connections */}
            <g stroke="rgba(255,255,255,0.2)" strokeWidth="1">
              <line x1="50" y1="50" x2="150" y2="100"/>
              <line x1="150" y1="100" x2="250" y2="80"/>
              <line x1="250" y1="80" x2="350" y2="150"/>
              <line x1="100" y1="200" x2="200" y2="250"/>
              <line x1="200" y1="250" x2="300" y2="200"/>
            </g>
          </svg>
        </div>

        {/* Bottom left organic structure */}
        <div className="absolute bottom-0 left-0 w-80 h-80 opacity-20">
          <div className="w-full h-full bg-gradient-to-t from-purple-400/40 to-transparent rounded-t-full transform rotate-12"></div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center text-white">
        {/* Logo and title */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-4 backdrop-blur-sm">
              <span className="text-white font-bold text-2xl">B</span>
            </div>
            <h1 className="text-5xl font-bold">BioOne</h1>
          </div>
          <h2 className="text-3xl font-medium mb-4">바이오소재 정보 AI 통합플랫폼</h2>
        </div>

        {/* Search section */}
        <div className="w-full max-w-4xl mb-8">
          <form onSubmit={handleSubmit} className="relative mb-6">
            <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="어떤 소재를 찾고 계신가요?"
                className="w-full px-6 py-4 pr-20 text-gray-800 text-lg bg-transparent rounded-2xl outline-none placeholder-gray-500"
              />
              <div className="absolute right-2 top-2 flex space-x-2">
                <button
                  type="submit"
                  className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center transition-colors"
                >
                  <Search className="w-5 h-5 text-white" />
                </button>
                <button
                  type="button"
                  className="w-12 h-12 bg-cyan-500 hover:bg-cyan-600 rounded-xl flex items-center justify-center transition-colors"
                >
                  <Bot className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="absolute right-20 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                AI Search
              </div>
            </div>
          </form>

          {/* Search suggestions carousel */}
          <div className="relative">
            <div className="flex items-center justify-center space-x-4">
              <button className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              
              <div className="flex space-x-3">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(suggestion)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      index === 0 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              <button className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Information box */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-3xl">
          <p className="text-white/90 text-sm leading-relaxed">
            ● 현재 합성생물학, 배양육, 천연물, 미생물, 모델물품, 촉매, 추출, 제형화, 식품첨가, 
            등 플라스틱이 언제까지 하닙니다.
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