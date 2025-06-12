'use client';

import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

// 돋보기 아이콘 컴포넌트
function MagnifyingGlassIcon() {
  return (
    <div className="relative w-full h-full">
      <svg
        className="block w-full h-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 32 32"
      >
        <path
          d="M26 13C26 15.8688 25.0688 18.5188 23.5 20.6688L31.4125 28.5875C32.1938 29.3687 32.1938 30.6375 31.4125 31.4188C30.6313 32.2 29.3625 32.2 28.5812 31.4188L20.6688 23.5C18.5188 25.075 15.8688 26 13 26C5.81875 26 0 20.1813 0 13C0 5.81875 5.81875 0 13 0C20.1813 0 26 5.81875 26 13ZM13 22C14.1819 22 15.3522 21.7672 16.4442 21.3149C17.5361 20.8626 18.5282 20.1997 19.364 19.364C20.1997 18.5282 20.8626 17.5361 21.3149 16.4442C21.7672 15.3522 22 14.1819 22 13C22 11.8181 21.7672 10.6478 21.3149 9.55585C20.8626 8.46392 20.1997 7.47177 19.364 6.63604C18.5282 5.80031 17.5361 5.13738 16.4442 4.68508C15.3522 4.23279 14.1819 4 13 4C11.8181 4 10.6478 4.23279 9.55585 4.68508C8.46392 5.13738 7.47177 5.80031 6.63604 6.63604C5.80031 7.47177 5.13738 8.46392 4.68508 9.55585C4.23279 10.6478 4 11.8181 4 13C4 14.1819 4.23279 15.3522 4.68508 16.4442C5.13738 17.5361 5.80031 18.5282 6.63604 19.364C7.47177 20.1997 8.46392 20.8626 9.55585 21.3149C10.6478 21.7672 11.8181 22 13 22Z"
          fill="white"
        />
      </svg>
    </div>
  );
}

// 폰트 검색 아이콘 컴포넌트
function FontSearchIcon() {
  return (
    <div className="relative w-full h-full">
      <svg
        className="block w-full h-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 31 31"
      >
        <g>
          <path
            d="M14.75 27.5C21.7916 27.5 27.5 21.7916 27.5 14.75C27.5 7.70837 21.7916 2 14.75 2C7.70837 2 2 7.70837 2 14.75C2 21.7916 7.70837 27.5 14.75 27.5Z"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
          />
          <path
            d="M23.8745 23.8745L28.3745 28.3745"
            stroke="white"
            strokeLinecap="round"
            strokeWidth="4"
          />
          <path
            d="M14.8745 10.3745V20.8745M11.1245 10.3745H18.6245"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
          />
        </g>
      </svg>
    </div>
  );
}

export default function SearchBar({ 
  onSearch, 
  placeholder = "어떤 소재를 찾고 계신가요?",
  className = ""
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholder);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleSearchClick = () => {
    onSearch(query);
  };

  const handleFilterClick = () => {
    // 필터 기능 구현 (추후)
    console.log('Filter clicked');
  };

  const handleFocus = () => {
    setIsFocused(true);
    setCurrentPlaceholder('');
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (query === '') {
      setCurrentPlaceholder(placeholder);
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="flex flex-row gap-[30px] items-center justify-start w-full">
        {/* 메인 검색 입력 필드 */}
        <div className="flex-1 bg-white h-20 relative rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] rounded-br-[40px]">
          {/* 외부 테두리 효과 */}
          <div className="absolute border-[10px] border-white/20 border-solid inset-[-10px] pointer-events-none rounded-tl-[20px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[50px]" />
          
          {/* 입력 필드 컨테이너 */}
          <div className="absolute h-[30px] left-[15px] top-[25px] w-[490px]">
            <div className="flex flex-col justify-center overflow-hidden relative w-full h-full">
              <div className="flex flex-col gap-2.5 h-[30px] items-start justify-center px-2.5 py-0 relative w-[490px]">
                <form onSubmit={handleSubmit} className="w-full">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={currentPlaceholder}
                    className="w-full bg-transparent border-none outline-none text-[#333333] text-[22px] font-bold placeholder-[#333333] leading-normal"
                    style={{ fontFamily: 'Pretendard, sans-serif' }}
                  />
                </form>
              </div>
            </div>
          </div>
          
          {/* AI Search 라벨 */}
          <div className="absolute flex flex-col justify-center leading-[0] left-[666px] top-[38.5px] transform -translate-x-full -translate-y-1/2 text-[14px] font-semibold text-right whitespace-nowrap">
            <p className="leading-normal whitespace-pre" style={{ fontFamily: 'Pretendard, sans-serif' }}>
              <span className="font-bold text-[#072a64]">AI</span>
              <span className="text-[#a1aec4]"> </span>
              <span className="font-normal text-[#a1aec4]">Search</span>
            </p>
          </div>
        </div>
        
        {/* 검색 버튼 */}
        <button
          onClick={handleSearchClick}
          className="bg-[#072a64] hover:bg-[#0a3574] transition-colors relative rounded-full w-20 h-20 flex-shrink-0"
          type="button"
        >
          <div className="overflow-hidden relative w-20 h-20">
            <div className="absolute left-6 w-8 h-8 top-6">
              <MagnifyingGlassIcon />
            </div>
          </div>
          {/* 외부 테두리 효과 */}
          <div className="absolute border-[10px] border-white/20 border-solid inset-[-10px] pointer-events-none rounded-full" />
        </button>
        
        {/* 필터 검색 버튼 */}
        <button
          onClick={handleFilterClick}
          className="bg-[#06a0af] hover:bg-[#058a97] transition-colors relative rounded-full w-20 h-20 flex-shrink-0"
          type="button"
        >
          <div className="flex flex-col items-center justify-center overflow-hidden relative w-full h-full">
            <div className="flex flex-col gap-2.5 items-center justify-center p-[10px] relative w-20 h-20">
              <div className="relative w-9 h-9 flex-shrink-0">
                <FontSearchIcon />
              </div>
            </div>
          </div>
          {/* 외부 테두리 효과 */}
          <div className="absolute border-[10px] border-white/20 border-solid inset-[-10px] pointer-events-none rounded-full" />
        </button>
      </div>
    </div>
  );
} 