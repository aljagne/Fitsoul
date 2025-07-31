import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { colors } from '@/constants/colors';
import { useRecipeStore } from '@/hooks/use-recipe-store';
import type { RecipeCategory, DietType } from '@/types/recipe';

const categories: { id: RecipeCategory; label: string }[] = [
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'snacks', label: 'Snacks' },
  { id: 'desserts', label: 'Desserts' },
];

const dietTypes: { id: DietType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'keto', label: 'Keto' },
  { id: 'paleo', label: 'Paleo' },
  { id: 'gluten-free', label: 'Gluten-Free' },
];

export function RecipeFilters() {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    selectedDietType, 
    setSelectedDietType 
  } = useRecipeStore();

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categories}
      >
        <Pressable
          style={[
            styles.categoryButton,
            !selectedCategory && styles.categoryButtonActive,
          ]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text
            style={[
              styles.categoryText,
              !selectedCategory && styles.categoryTextActive,
            ]}
          >
            All
          </Text>
        </Pressable>
        {categories.map((category) => (
          <Pressable
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive,
              ]}
            >
              {category.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dietTypes}
      >
        {dietTypes.map((diet) => (
          <Pressable
            key={diet.id}
            style={[
              styles.dietButton,
              selectedDietType === diet.id && styles.dietButtonActive,
            ]}
            onPress={() => setSelectedDietType(diet.id)}
          >
            <Text
              style={[
                styles.dietText,
                selectedDietType === diet.id && styles.dietTextActive,
              ]}
            >
              {diet.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  categories: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: colors.text,
  },
  categoryTextActive: {
    color: colors.background,
    fontWeight: '500',
  },
  dietTypes: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  dietButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.card,
  },
  dietButtonActive: {
    backgroundColor: colors.secondary,
  },
  dietText: {
    fontSize: 12,
    color: colors.text,
  },
  dietTextActive: {
    color: colors.background,
    fontWeight: '500',
  },
});