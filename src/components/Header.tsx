'use client';

import React from 'react';
import { Globe, User, Menu } from 'lucide-react';

export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-white text-xl font-bold">All in One</span>
          </div>

          {/* Right side menu */}
          <div className="flex items-center space-x-4">
            {/* Language selector */}
            <button className="flex items-center space-x-1 text-white/80 hover:text-white transition-colors border border-white/30 rounded-full px-3 py-1">
              <Globe className="w-4 h-4" />
              <span className="text-sm">EN</span>
            </button>

            {/* Login */}
            <button className="flex items-center space-x-1 text-white/80 hover:text-white transition-colors">
              <User className="w-4 h-4" />
              <span className="text-sm">로그인</span>
            </button>

            {/* Menu */}
            <button className="flex items-center space-x-1 text-white/80 hover:text-white transition-colors">
              <Menu className="w-4 h-4" />
              <span className="text-sm">전체메뉴</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 