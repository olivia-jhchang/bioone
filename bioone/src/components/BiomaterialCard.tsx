'use client';

import React from 'react';
import { Biomaterial } from '@/types/biomaterial';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  Thermometer, 
  Zap, 
  Clock,
  Package,
  DollarSign,
  Building2
} from 'lucide-react';

interface BiomaterialCardProps {
  material: Biomaterial;
  onClick?: () => void;
}

export default function BiomaterialCard({ material, onClick }: BiomaterialCardProps) {
  const formatPrice = (price: typeof material.price) => {
    if (!price) return '문의';
    return `${price.amount.toLocaleString()}원 ${price.unit}`;
  };

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold text-gray-900 leading-tight">
            {material.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            {material.inStock ? (
              <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                <Package className="h-3 w-3 mr-1" />
                재고있음
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
                <Package className="h-3 w-3 mr-1" />
                품절
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs">
            {material.category}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {material.subcategory}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {material.description}
        </p>
        
        {/* 주요 특성 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            {material.properties.biodegradable ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm text-gray-700">생분해성</span>
          </div>
          
          <div className="flex items-center gap-2">
            {material.properties.biocompatible ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm text-gray-700">생체적합성</span>
          </div>
        </div>

        {/* 물성 정보 */}
        <div className="grid grid-cols-1 gap-2 text-sm">
          {material.properties.tensileStrength && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-gray-600">
                <Zap className="h-3 w-3" />
                인장강도
              </span>
              <span className="font-medium">{material.properties.tensileStrength} MPa</span>
            </div>
          )}
          
          {material.properties.degradationTime && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-gray-600">
                <Clock className="h-3 w-3" />
                분해시간
              </span>
              <span className="font-medium">{material.properties.degradationTime}</span>
            </div>
          )}
          
          {material.properties.temperature && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-gray-600">
                <Thermometer className="h-3 w-3" />
                사용온도
              </span>
              <span className="font-medium">
                {material.properties.temperature.min}°C ~ {material.properties.temperature.max}°C
              </span>
            </div>
          )}
        </div>

        {/* 용도 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">주요 용도</h4>
          <div className="flex flex-wrap gap-1">
            {material.applications.slice(0, 3).map((app) => (
              <Badge key={app} variant="secondary" className="text-xs">
                {app}
              </Badge>
            ))}
            {material.applications.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{material.applications.length - 3}개
              </Badge>
            )}
          </div>
        </div>

        {/* 가격 및 공급업체 */}
        <div className="flex justify-between items-end pt-2 border-t">
          <div>
            <p className="text-xs text-gray-500 mb-1">주요 공급업체</p>
            <div className="flex items-center gap-1">
              <Building2 className="h-3 w-3 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                {material.suppliers[0]}
                {material.suppliers.length > 1 && ` 외 ${material.suppliers.length - 1}곳`}
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">가격</p>
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-gray-400" />
              <span className="text-sm font-bold text-gray-900">
                {formatPrice(material.price)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 