import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe, RecipeCategory, DietType } from '@/types/recipe';
import { recipes as initialRecipes } from '@/mocks/recipes';

interface RecipeState {
  recipes: Recipe[];
  favoriteRecipeIds: string[];
  recentlyViewedIds: string[];
  searchQuery: string;
  selectedCategory: RecipeCategory | null;
  selectedDietType: DietType;
  
  // Actions
  toggleFavorite: (recipeId: string) => void;
  addToRecentlyViewed: (recipeId: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: RecipeCategory | null) => void;
  setSelectedDietType: (dietType: DietType) => void;
  
  // Selectors
  isFavorite: (recipeId: string) => boolean;
  getFavoriteRecipes: () => Recipe[];
  getRecentlyViewedRecipes: () => Recipe[];
  getFilteredRecipes: () => Recipe[];
}

export const useRecipeStore = create<RecipeState>()(
  persist(
    (set, get) => ({
      recipes: initialRecipes,
      favoriteRecipeIds: [],
      recentlyViewedIds: [],
      searchQuery: '',
      selectedCategory: null,
      selectedDietType: 'all',
      
      toggleFavorite: (recipeId: string) => {
        set((state) => {
          const isFavorited = state.favoriteRecipeIds.includes(recipeId);
          return {
            favoriteRecipeIds: isFavorited
              ? state.favoriteRecipeIds.filter(id => id !== recipeId)
              : [...state.favoriteRecipeIds, recipeId]
          };
        });
      },
      
      addToRecentlyViewed: (recipeId: string) => {
        set((state) => {
          // Remove if already exists to avoid duplicates
          const filteredIds = state.recentlyViewedIds.filter(id => id !== recipeId);
          // Add to front of array, limit to 10 items
          return {
            recentlyViewedIds: [recipeId, ...filteredIds].slice(0, 10)
          };
        });
      },
      
      setSearchQuery: (query: string) => set({ searchQuery: query }),
      setSelectedCategory: (category: RecipeCategory | null) => set({ selectedCategory: category }),
      setSelectedDietType: (dietType: DietType) => set({ selectedDietType: dietType }),
      
      isFavorite: (recipeId: string) => {
        return get().favoriteRecipeIds.includes(recipeId);
      },
      
      getFavoriteRecipes: () => {
        const { recipes, favoriteRecipeIds } = get();
        return recipes.filter(recipe => favoriteRecipeIds.includes(recipe.id));
      },
      
      getRecentlyViewedRecipes: () => {
        const { recipes, recentlyViewedIds } = get();
        // Preserve the order of recently viewed
        return recentlyViewedIds
          .map(id => recipes.find(recipe => recipe.id === id))
          .filter(recipe => recipe !== undefined) as Recipe[];
      },
      
      getFilteredRecipes: () => {
        const { 
          recipes, 
          searchQuery, 
          selectedCategory, 
          selectedDietType 
        } = get();
        
        return recipes.filter(recipe => {
          // Filter by search query
          const matchesSearch = searchQuery === '' || 
            recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
          
          // Filter by category
          const matchesCategory = selectedCategory === null || 
            recipe.category === selectedCategory;
          
          // Filter by diet type
          const matchesDietType = selectedDietType === 'all' || 
            recipe.dietTypes.includes(selectedDietType);
          
          return matchesSearch && matchesCategory && matchesDietType;
        });
      }
    }),
    {
      name: 'recipe-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist these fields
      partialize: (state) => ({
        favoriteRecipeIds: state.favoriteRecipeIds,
        recentlyViewedIds: state.recentlyViewedIds,
      }),
    }
  )
);