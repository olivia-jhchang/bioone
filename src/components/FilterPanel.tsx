'use client';

import React from 'react';
import { SearchFilters } from '@/types/biomaterial';
import { biomaterialCategories, biomaterialApplications } from '@/data/biomaterials';
import { Filter, X } from 'lucide-react';

interface FilterPanelProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function FilterPanel({ filters, onFilterChange, isOpen, onToggle }: FilterPanelProps) {
  const updateFilter = (key: keyof SearchFilters, value: string | boolean | string[] | undefined) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        <Filter className="h-4 w-4" />
        필터
      </button>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">필터</h3>
        <div className="flex gap-2">
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            초기화
          </button>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          카테고리
        </label>
        <select
          value={filters.category || ''}
          onChange={(e) => updateFilter('category', e.target.value || undefined)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">전체</option>
          {biomaterialCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* 용도 필터 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          주요 용도
        </label>
        <div className="max-h-40 overflow-y-auto space-y-2">
          {biomaterialApplications.map((application) => (
            <label key={application} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.applications?.includes(application) || false}
                onChange={(e) => {
                  const current = filters.applications || [];
                  if (e.target.checked) {
                    updateFilter('applications', [...current, application]);
                  } else {
                    updateFilter('applications', current.filter(a => a !== application));
                  }
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{application}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 생분해성 필터 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          생분해성
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="biodegradable"
              checked={filters.biodegradable === undefined}
              onChange={() => updateFilter('biodegradable', undefined)}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">전체</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="biodegradable"
              checked={filters.biodegradable === true}
              onChange={() => updateFilter('biodegradable', true)}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">생분해성</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="biodegradable"
              checked={filters.biodegradable === false}
              onChange={() => updateFilter('biodegradable', false)}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">비생분해성</span>
          </label>
        </div>
      </div>

      {/* 생체적합성 필터 */}
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.biocompatible || false}
            onChange={(e) => updateFilter('biocompatible', e.target.checked ? true : undefined)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700 font-medium">생체적합성 보장</span>
        </label>
      </div>

      {/* 재고 필터 */}
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.inStock || false}
            onChange={(e) => updateFilter('inStock', e.target.checked ? true : undefined)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700 font-medium">재고 있음</span>
        </label>
      </div>
    </div>
  );
} 