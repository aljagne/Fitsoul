import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';
import { RecipeCard } from './RecipeCard';
import { useRecipeStore } from '@/hooks/use-recipe-store';
import { Recipe } from '@/types/recipe';
import { useMemo } from 'react';

interface RecipeListProps {
  title?: string;
  recipes: Recipe[];
  emptyMessage?: string;
}

export function RecipeList({ title, recipes, emptyMessage = 'No recipes found' }: RecipeListProps) {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      
      {recipes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        </View>
      ) : (
        <View>
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </View>
      )}
    </View>
  );
}

export function FilteredRecipeList() {
  const getFilteredRecipes = useRecipeStore(state => state.getFilteredRecipes);
  const searchQuery = useRecipeStore(state => state.searchQuery);
  const selectedCategory = useRecipeStore(state => state.selectedCategory);
  const selectedDietType = useRecipeStore(state => state.selectedDietType);
  
  // Only recalculate when these dependencies change
  const filteredRecipes = useMemo(() => {
    return getFilteredRecipes();
  }, [getFilteredRecipes, searchQuery, selectedCategory, selectedDietType]);
  
  return (
    <RecipeList 
      recipes={filteredRecipes} 
      emptyMessage="No recipes match your search criteria"
    />
  );
}

export function FavoriteRecipeList() {
  const getFavoriteRecipes = useRecipeStore(state => state.getFavoriteRecipes);
  const favoriteRecipeIds = useRecipeStore(state => state.favoriteRecipeIds);
  
  // Only recalculate when favoriteRecipeIds changes
  const favoriteRecipes = useMemo(() => {
    return getFavoriteRecipes();
  }, [getFavoriteRecipes, favoriteRecipeIds]);
  
  return (
    <RecipeList 
      recipes={favoriteRecipes} 
      emptyMessage="You haven't saved any favorites yet"
    />
  );
}

export function RecentlyViewedRecipeList() {
  const getRecentlyViewedRecipes = useRecipeStore(state => state.getRecentlyViewedRecipes);
  const recentlyViewedIds = useRecipeStore(state => state.recentlyViewedIds);
  
  // Only recalculate when recentlyViewedIds changes
  const recentRecipes = useMemo(() => {
    return getRecentlyViewedRecipes();
  }, [getRecentlyViewedRecipes, recentlyViewedIds]);
  
  if (recentRecipes.length === 0) return null;
  
  return (
    <RecipeList 
      recipes={recentRecipes}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
});