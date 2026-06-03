import { create } from 'zustand';

export interface FilterState {
  searchQuery: string;
  selectedCategory: string | null;
  priceRange: [number, number];
  minRating: number;
  sortBy: 'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest';
  
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setPriceRange: (range: [number, number]) => void;
  setMinRating: (rating: number) => void;
  setSortBy: (sortBy: 'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest') => void;
  resetFilters: () => void;
}

const initialState = {
  searchQuery: '',
  selectedCategory: null,
  priceRange: [0, 50000] as [number, number],
  minRating: 0,
  sortBy: 'relevance' as const,
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initialState,
  
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setSelectedCategory: (category: string | null) => set({ selectedCategory: category }),
  setPriceRange: (range: [number, number]) => set({ priceRange: range }),
  setMinRating: (rating: number) => set({ minRating: rating }),
  setSortBy: (sortBy) => set({ sortBy }),
  resetFilters: () => set(initialState),
}));