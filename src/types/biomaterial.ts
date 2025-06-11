export interface Biomaterial {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  properties: {
    biodegradable: boolean;
    biocompatible: boolean;
    tensileStrength?: number; // MPa
    elasticModulus?: number; // GPa
    degradationTime?: string; // e.g., "3-6 months"
    temperature?: {
      min: number;
      max: number;
    }; // °C
  };
  applications: string[];
  suppliers: string[];
  certification: string[];
  imageUrl?: string;
  dataSheet?: string;
  price?: {
    amount: number;
    unit: string; // e.g., "per kg", "per gram"
    currency: string;
  };
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchFilters {
  category?: string;
  subcategory?: string;
  biodegradable?: boolean;
  biocompatible?: boolean;
  inStock?: boolean;
  priceRange?: {
    min: number;
    max: number;
  };
  applications?: string[];
}

export interface SearchResult {
  materials: Biomaterial[];
  totalCount: number;
  filters: {
    categories: string[];
    subcategories: string[];
    applications: string[];
  };
} 