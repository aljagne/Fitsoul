import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Clock, Heart, Utensils, Users } from "lucide-react-native";
import { colors } from "@/constants/colors";
import type { Recipe } from "@/types/recipe";
import { router } from "expo-router";
import { useRecipeStore } from "@/hooks/use-recipe-store";

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const { isFavorite, toggleFavorite, addToRecentlyViewed } = useRecipeStore();
  const favorited = isFavorite(recipe.id);

  const handlePress = () => {
    addToRecentlyViewed(recipe.id);
    router.push(`/recipe/${recipe.id}`);
  };

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    toggleFavorite(recipe.id);
  };

  return (
    <Pressable 
      style={styles.card}
      onPress={handlePress}
    >
      <Image 
        source={{ uri: recipe.imageUrl }} 
        style={styles.image}
      />
      
      <Pressable 
        style={styles.favoriteButton}
        onPress={handleFavoritePress}
        hitSlop={8}
      >
        <Heart 
          size={20} 
          color={favorited ? colors.error : colors.background}
          fill={favorited ? colors.error : 'transparent'}
        />
      </Pressable>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{recipe.title}</Text>
          <View style={[styles.badge, styles[`badge_${recipe.difficulty}`]]}>
            <Text style={styles.badgeText}>
              {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
            </Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {recipe.description}
        </Text>

        <View style={styles.dietTypes}>
          {recipe.dietTypes.map((diet) => (
            <View key={diet} style={styles.dietBadge}>
              <Text style={styles.dietText}>
                {diet.charAt(0).toUpperCase() + diet.slice(1)}
              </Text>
            </View>
          ))}
        </View>
        
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Clock size={16} color={colors.textLight} />
            <Text style={styles.statText}>
              {recipe.prepTime + recipe.cookTime} min
            </Text>
          </View>
          <View style={styles.stat}>
            <Users size={16} color={colors.textLight} />
            <Text style={styles.statText}>
              Serves {recipe.servings}
            </Text>
          </View>
          <View style={styles.stat}>
            <Utensils size={16} color={colors.textLight} />
            <Text style={styles.statText}>
              {recipe.ingredients.length} ingredients
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  image: {
    width: "100%",
    height: 200,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  badge_easy: {
    backgroundColor: colors.success + "20",
  },
  badge_medium: {
    backgroundColor: colors.primary + "20",
  },
  badge_hard: {
    backgroundColor: colors.error + "20",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  description: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 12,
  },
  dietTypes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  dietBadge: {
    backgroundColor: colors.primary + "10",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dietText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "500",
  },
  stats: {
    flexDirection: "row",
    gap: 16,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: colors.textLight,
  },
});