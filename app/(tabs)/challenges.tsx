import { useState } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { challenges } from "@/mocks/challenges";
import { ChallengeCard } from "@/components/ChallengeCard";
import { Search, Filter, X, Plus } from "lucide-react-native";
import type { ChallengeType, ChallengeStatus } from "@/types/challenge";

const categories: { id: ChallengeType; label: string }[] = [
  { id: "workout", label: "Workout" },
  { id: "nutrition", label: "Nutrition" },
  { id: "combined", label: "Combined" },
  { id: "steps", label: "Steps" },
  { id: "meditation", label: "Meditation" },
];

const statuses: { id: ChallengeStatus; label: string }[] = [
  { id: "active", label: "Active" },
  { id: "upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed" },
  { id: "failed", label: "Failed" },
];

export default function ChallengesScreen() {
  const [selectedCategory, setSelectedCategory] = useState<ChallengeType | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ChallengeStatus | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filteredChallenges = challenges.filter((challenge) => {
    // Filter by search query
    const matchesSearch = searchQuery === "" || 
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategory === null || 
      challenge.type === selectedCategory;
    
    // Filter by status
    const matchesStatus = selectedStatus === null || 
      challenge.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedStatus(null);
    setSearchQuery("");
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Challenges</Text>
          <Text style={styles.subtitle}>Push your limits, earn rewards</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search challenges..."
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
              <Text style={styles.filterTitle}>Status</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesScroll}
              >
                <Pressable
                  style={[
                    styles.categoryButton,
                    !selectedStatus && styles.categoryButtonActive,
                  ]}
                  onPress={() => setSelectedStatus(null)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      !selectedStatus && styles.categoryTextActive,
                    ]}
                  >
                    All
                  </Text>
                </Pressable>
                {statuses.map((status) => (
                  <Pressable
                    key={status.id}
                    style={[
                      styles.categoryButton,
                      selectedStatus === status.id && styles.categoryButtonActive,
                    ]}
                    onPress={() => setSelectedStatus(status.id)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        selectedStatus === status.id && styles.categoryTextActive,
                      ]}
                    >
                      {status.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {(selectedCategory || selectedStatus || searchQuery) && (
              <Pressable style={styles.clearButton} onPress={clearFilters}>
                <Text style={styles.clearButtonText}>Clear Filters</Text>
              </Pressable>
            )}
          </View>
        )}

        {/* Results */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            {filteredChallenges.length} {filteredChallenges.length === 1 ? 'challenge' : 'challenges'} found
          </Text>
        </View>

        <View style={styles.challenges}>
          {filteredChallenges.length > 0 ? (
            filteredChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No challenges found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        <Pressable style={styles.fab}>
          <Plus size={24} color={colors.background} />
        </Pressable>
      </View>
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
  challenges: {
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
  fabContainer: {
    position: "absolute",
    right: 24,
    bottom: 24,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});