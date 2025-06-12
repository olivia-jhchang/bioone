'use client';

import React from 'react';
import { SearchResult } from '@/lib/gemini';
import { Bot, Sparkles, CheckCircle } from 'lucide-react';

interface AISearchResultsProps {
  result: SearchResult | null;
  isLoading: boolean;
}

export default function AISearchResults({ result, isLoading }: AISearchResultsProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mr-3"></div>
          <div className="flex items-center">
            <Bot className="h-6 w-6 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">AI가 분석 중입니다...</h3>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      {/* AI 응답 헤더 */}
      <div className="flex items-center mb-4">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-full p-2 mr-3">
          <Bot className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            AI 분석 결과
            <Sparkles className="h-4 w-4 text-yellow-500 ml-2" />
          </h3>
          <p className="text-sm text-gray-500">&quot;{result.query}&quot;에 대한 전문가 분석</p>
        </div>
      </div>

      {/* AI 응답 내용 */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-6">
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-800 leading-relaxed whitespace-pre-line">
            {result.response}
          </p>
        </div>
      </div>

      {/* 추천 소재들 */}
      {result.materials && result.materials.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
            <Sparkles className="h-5 w-5 text-purple-600 mr-2" />
            추천 바이오소재
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.materials.map((material, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-purple-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-semibold text-gray-900 text-sm">{material.name}</h5>
                  <div className="flex space-x-1">
                    {material.properties.biodegradable && (
                      <div title="생분해성">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                    )}
                    {material.properties.biocompatible && (
                      <div title="생체적합성">
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-xs text-gray-600 mb-2">{material.description}</p>
                
                <div className="mb-2">
                  <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                    {material.category}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-700">주요 응용:</p>
                  <div className="flex flex-wrap gap-1">
                    {material.applications.slice(0, 3).map((app, appIndex) => (
                      <span
                        key={appIndex}
                        className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded"
                      >
                        {app}
                      </span>
                    ))}
                    {material.applications.length > 3 && (
                      <span className="text-xs text-gray-500">+{material.applications.length - 3}개</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 속성 범례 */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4 text-xs text-gray-600">
          <div className="flex items-center">
            <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
            <span>생분해성</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-3 w-3 text-blue-500 mr-1" />
            <span>생체적합성</span>
          </div>
        </div>
      </div>
    </div>
  );
} 