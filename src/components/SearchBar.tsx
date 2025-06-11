'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ 
  onSearch, 
  placeholder = "어떤 소재를 찾고 계신가요?",
  className = ""
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      {/* 메인 검색 박스 */}
      <div className="relative bg-white rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] rounded-br-[40px] shadow-lg">
        {/* 외부 테두리 효과 */}
        <div className="absolute inset-[-10px] border-[10px] border-white/20 rounded-tl-[20px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[50px] pointer-events-none" />
        
        {/* 검색 입력 필드 */}
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full px-[15px] py-[25px] text-[22px] font-bold text-[#333333] bg-transparent rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] rounded-br-[40px] outline-none placeholder-[#333333]/60"
            style={{ fontFamily: 'Pretendard, sans-serif' }}
          />
          
          {/* AI Search 라벨 */}
          <div className="absolute right-[20px] top-1/2 -translate-y-1/2 flex items-center">
            <span className="text-[14px] font-semibold mr-3" style={{ fontFamily: 'Pretendard, sans-serif' }}>
              <span className="text-[#072a64] font-bold">AI</span>
              <span className="text-[#a1aec4] font-normal"> Search</span>
            </span>
            <button
              type="submit"
              className="w-[40px] h-[40px] bg-[#072a64] hover:bg-[#0a3574] rounded-full flex items-center justify-center transition-colors"
            >
              <Search className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
} 