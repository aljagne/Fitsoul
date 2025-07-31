import { useState } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { workouts } from "@/mocks/workouts";
import { WorkoutCard } from "@/components/WorkoutCard";
import { Search, Filter, X } from "lucide-react-native";
import type { WorkoutCategory } from "@/types/workout";

const categories: { id: WorkoutCategory; label: string }[] = [
  { id: "strength", label: "Strength" },
  { id: "cardio", label: "Cardio" },
  { id: "hiit", label: "HIIT" },
  { id: "yoga", label: "Yoga" },
  { id: "stretching", label: "Stretching" },
];

const difficulties = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

export default function WorkoutsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<WorkoutCategory | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filteredWorkouts = workouts.filter((workout) => {
    // Filter by search query
    const matchesSearch = searchQuery === "" || 
      workout.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workout.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategory === null || 
      workout.category === selectedCategory;
    
    // Filter by difficulty
    const matchesDifficulty = selectedDifficulty === null || 
      workout.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedDifficulty(null);
    setSearchQuery("");
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Workouts</Text>
          <Text style={styles.subtitle}>Find your perfect training</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search workouts..."
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
              <Text style={styles.filterTitle}>Difficulty</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesScroll}
              >
                <Pressable
                  style={[
                    styles.categoryButton,
                    !selectedDifficulty && styles.categoryButtonActive,
                  ]}
                  onPress={() => setSelectedDifficulty(null)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      !selectedDifficulty && styles.categoryTextActive,
                    ]}
                  >
                    All
                  </Text>
                </Pressable>
                {difficulties.map((difficulty) => (
                  <Pressable
                    key={difficulty.id}
                    style={[
                      styles.categoryButton,
                      selectedDifficulty === difficulty.id && styles.categoryButtonActive,
                    ]}
                    onPress={() => setSelectedDifficulty(difficulty.id)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        selectedDifficulty === difficulty.id && styles.categoryTextActive,
                      ]}
                    >
                      {difficulty.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {(selectedCategory || selectedDifficulty || searchQuery) && (
              <Pressable style={styles.clearButton} onPress={clearFilters}>
                <Text style={styles.clearButtonText}>Clear Filters</Text>
              </Pressable>
            )}
          </View>
        )}

        {/* Results */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            {filteredWorkouts.length} {filteredWorkouts.length === 1 ? 'workout' : 'workouts'} found
          </Text>
        </View>

        <View style={styles.workouts}>
          {filteredWorkouts.length > 0 ? (
            filteredWorkouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No workouts found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
            </View>
          )}
        </View>
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
  resultsContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  resultsText: {
    fontSize: 14,
    color: colors.textLight,
  },
  workouts: {
    paddingVertical: 8,
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
  },
});