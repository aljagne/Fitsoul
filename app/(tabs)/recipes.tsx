import { useState } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { Search, Filter, ChevronDown, ChevronUp, X } from "lucide-react-native";
import { FilteredRecipeList, FavoriteRecipeList, RecentlyViewedRecipeList } from "@/components/RecipeList";
import { useRecipeStore } from "@/hooks/use-recipe-store";
import { RecipeCategory, DietType } from "@/types/recipe";

const categories: { id: RecipeCategory; label: string }[] = [
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
  { id: "snacks", label: "Snacks" },
  { id: "desserts", label: "Desserts" },
];

const dietTypes: { id: DietType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "keto", label: "Keto" },
  { id: "paleo", label: "Paleo" },
  { id: "gluten-free", label: "Gluten-Free" },
];

export default function RecipesScreen() {
  const [showFavorites, setShowFavorites] = useState(true);
  const [showRecent, setShowRecent] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const { 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory, 
    selectedDietType, 
    setSelectedDietType 
  } = useRecipeStore();

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedDietType("all");
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Recipes</Text>
          <Text style={styles.subtitle}>Discover healthy and delicious meals</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search recipes..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery("")}>
              <X size={20} color={colors.textLight} />
            </Pressable>
          ) : (
            <Pressable onPress={() => setShowFilters(!showFilters)}>
              <Filter size={20} color={colors.primary} />
            </Pressable>
          )}
        </View>

        {/* Filters */}
        {showFilters && (
          <View style={styles.filtersContainer}>
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Categories</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesScroll}
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
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Diet Type</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesScroll}
              >
                {dietTypes.map((diet) => (
                  <Pressable
                    key={diet.id}
                    style={[
                      styles.categoryButton,
                      selectedDietType === diet.id && styles.categoryButtonActive,
                    ]}
                    onPress={() => setSelectedDietType(diet.id)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        selectedDietType === diet.id && styles.categoryTextActive,
                      ]}
                    >
                      {diet.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {(selectedCategory || selectedDietType !== "all" || searchQuery) && (
              <Pressable style={styles.clearButton} onPress={clearFilters}>
                <Text style={styles.clearButtonText}>Clear Filters</Text>
              </Pressable>
            )}
          </View>
        )}

        {/* Collapsible Favorites Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Favorites</Text>
          <Pressable 
            onPress={() => setShowFavorites(!showFavorites)}
            hitSlop={8}
          >
            {showFavorites ? (
              <ChevronUp size={20} color={colors.textLight} />
            ) : (
              <ChevronDown size={20} color={colors.textLight} />
            )}
          </Pressable>
        </View>
        {showFavorites && <FavoriteRecipeList />}

        {/* Collapsible Recently Viewed Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recently Viewed</Text>
          <Pressable 
            onPress={() => setShowRecent(!showRecent)}
            hitSlop={8}
          >
            {showRecent ? (
              <ChevronUp size={20} color={colors.textLight} />
            ) : (
              <ChevronDown size={20} color={colors.textLight} />
            )}
          </Pressable>
        </View>
        {showRecent && <RecentlyViewedRecipeList />}

        {/* All Recipes (Filtered) */}
        <Text style={styles.allRecipesTitle}>All Recipes</Text>
        <FilteredRecipeList />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
    marginRight: 8,
  },
  filtersContainer: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 12,
  },
  categoriesScroll: {
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    marginRight: 8,
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
    fontWeight: "500",
  },
  clearButton: {
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  clearButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  allRecipesTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
});