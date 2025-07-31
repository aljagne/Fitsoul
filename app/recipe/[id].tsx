import { useState, useRef, useEffect } from "react";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, View, Pressable, Modal, Alert, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Clock, Heart, Share2, Users, Utensils, ChevronDown, ChevronUp, ShoppingCart, Play, ArrowLeft, X, Check, Pause } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { recipes } from "@/mocks/recipes";
import { useRecipeStore } from "@/hooks/use-recipe-store";
import { BackButton } from "@/components/BackButton";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing
} from "react-native-reanimated";

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipe = recipes.find((r) => r.id === id);
  const { isFavorite, toggleFavorite, addToRecentlyViewed } = useRecipeStore();
  const [showIngredients, setShowIngredients] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showNutrition, setShowNutrition] = useState(true);
  const [cookingMode, setCookingMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [servings, setServings] = useState(recipe?.servings || 2);

  // Animation values
  const fadeAnim = useSharedValue(0);
  const translateY = useSharedValue(20);

  // Add to recently viewed when the screen loads
  useEffect(() => {
    if (recipe) {
      addToRecentlyViewed(recipe.id);
    }

    // Start entrance animation
    fadeAnim.value = withTiming(1, { duration: 600 });
    translateY.value = withTiming(0, { duration: 600 });
  }, [recipe, addToRecentlyViewed]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  if (!recipe) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ 
          title: "Recipe not found",
          headerLeft: () => <BackButton />
        }} />
        <View style={styles.content}>
          <Text style={styles.title}>Recipe not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleShare = async () => {
    if (Platform.OS !== 'web') {
      try {
        // This would use the Share API on native platforms
        Alert.alert("Share", `Sharing recipe: ${recipe.title}`);
      } catch (error) {
        console.error("Error sharing recipe:", error);
      }
    } else {
      // Web fallback
      Alert.alert("Share", "Sharing not available on web");
    }
  };

  const handleStartCooking = () => {
    setCookingMode(true);
    setCurrentStep(0);
  };

  const handleAddToCart = () => {
    // In a real app, this would add ingredients to a shopping cart
    Alert.alert("Shopping Cart", `Added ingredients for ${recipe.title} to your shopping cart`);
  };

  const handleNextStep = () => {
    if (currentStep < recipe.instructions.length - 1) {
      setCurrentStep(currentStep + 1);
      // Reset timer when moving to next step
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setTimer(0);
      setTimerActive(false);
    } else {
      // Cooking complete
      Alert.alert("Cooking Complete", "Congratulations! You've completed the recipe.", [
        { text: "OK", onPress: () => setCookingMode(false) }
      ]);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Reset timer when moving to previous step
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setTimer(0);
      setTimerActive(false);
    }
  };

  const toggleTimer = () => {
    if (timerActive) {
      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setTimerActive(false);
    } else {
      // Start timer
      setTimerActive(true);
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleCloseCookingMode = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setCookingMode(false);
    setCurrentStep(0);
    setTimer(0);
    setTimerActive(false);
  };

  const adjustServings = (increment: boolean) => {
    if (increment) {
      setServings(prev => Math.min(prev + 1, 10));
    } else {
      setServings(prev => Math.max(prev - 1, 1));
    }
  };

  // Calculate adjusted ingredient amounts based on servings
  const getAdjustedAmount = (originalAmount: number) => {
    const ratio = servings / recipe.servings;
    return (originalAmount * ratio).toFixed(1).replace(/\.0$/, '');
  };

  // Animated styles
  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ translateY: translateY.value }]
    };
  });

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen 
        options={{ 
          title: recipe.title,
          headerLeft: () => <BackButton />,
          headerRight: () => (
            <View style={styles.headerButtons}>
              <Pressable 
                style={styles.headerButton}
                onPress={() => toggleFavorite(recipe.id)}
                hitSlop={8}
              >
                <Heart 
                  size={24} 
                  color={isFavorite(recipe.id) ? colors.error : colors.text}
                  fill={isFavorite(recipe.id) ? colors.error : 'transparent'}
                />
              </Pressable>
              <Pressable 
                style={styles.headerButton}
                onPress={handleShare}
                hitSlop={8}
              >
                <Share2 size={24} color={colors.text} />
              </Pressable>
            </View>
          )
        }} 
      />
      <ScrollView>
        <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
        
        <Animated.View style={[styles.content, contentAnimatedStyle]}>
          <View style={styles.header}>
            <Text style={styles.title}>{recipe.title}</Text>
            <View style={[styles.badge, styles[`badge_${recipe.difficulty}`]]}>
              <Text style={styles.badgeText}>
                {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
              </Text>
            </View>
          </View>

          <Text style={styles.description}>{recipe.description}</Text>

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
              <Clock size={20} color={colors.textLight} />
              <Text style={styles.statText}>
                {recipe.prepTime + recipe.cookTime} min
              </Text>
            </View>
            <View style={styles.stat}>
              <Users size={20} color={colors.textLight} />
              <Text style={styles.statText}>
                Serves {recipe.servings}
              </Text>
            </View>
            <View style={styles.stat}>
              <Utensils size={20} color={colors.textLight} />
              <Text style={styles.statText}>
                {recipe.ingredients.length} ingredients
              </Text>
            </View>
          </View>

          {/* Collapsible Nutrition Section */}
          <Pressable 
            style={styles.sectionHeader}
            onPress={() => setShowNutrition(!showNutrition)}
          >
            <Text style={styles.sectionTitle}>Nutrition Facts</Text>
            {showNutrition ? (
              <ChevronUp size={20} color={colors.textLight} />
            ) : (
              <ChevronDown size={20} color={colors.textLight} />
            )}
          </Pressable>
          
          {showNutrition && (
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{recipe.nutrition.calories}</Text>
                <Text style={styles.nutritionLabel}>Calories</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{recipe.nutrition.protein}g</Text>
                <Text style={styles.nutritionLabel}>Protein</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{recipe.nutrition.carbs}g</Text>
                <Text style={styles.nutritionLabel}>Carbs</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{recipe.nutrition.fat}g</Text>
                <Text style={styles.nutritionLabel}>Fat</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{recipe.nutrition.fiber}g</Text>
                <Text style={styles.nutritionLabel}>Fiber</Text>
              </View>
            </View>
          )}

          {/* Collapsible Ingredients Section */}
          <Pressable 
            style={styles.sectionHeader}
            onPress={() => setShowIngredients(!showIngredients)}
          >
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {showIngredients ? (
              <ChevronUp size={20} color={colors.textLight} />
            ) : (
              <ChevronDown size={20} color={colors.textLight} />
            )}
          </Pressable>
          
          {showIngredients && (
            <View style={styles.ingredientsList}>
              <View style={styles.servingAdjuster}>
                <Text style={styles.servingTitle}>Adjust Servings</Text>
                <View style={styles.servingControls}>
                  <Pressable 
                    style={[styles.servingButton, servings <= 1 && styles.servingButtonDisabled]} 
                    onPress={() => adjustServings(false)}
                    disabled={servings <= 1}
                  >
                    <Text style={styles.servingButtonText}>-</Text>
                  </Pressable>
                  <Text style={styles.servingCount}>{servings}</Text>
                  <Pressable 
                    style={[styles.servingButton, servings >= 10 && styles.servingButtonDisabled]} 
                    onPress={() => adjustServings(true)}
                    disabled={servings >= 10}
                  >
                    <Text style={styles.servingButtonText}>+</Text>
                  </Pressable>
                </View>
              </View>
              
              {recipe.ingredients.map((ingredient) => (
                <View key={ingredient.id} style={styles.ingredient}>
                  <Text style={styles.ingredientText}>
                    • {getAdjustedAmount(ingredient.amount)} {ingredient.unit} {ingredient.name}
                  </Text>
                </View>
              ))}
              <Pressable 
                style={styles.addToCartButton}
                onPress={handleAddToCart}
              >
                <ShoppingCart size={18} color={colors.primary} />
                <Text style={styles.addToCartText}>Add Ingredients to Cart</Text>
              </Pressable>
            </View>
          )}

          {/* Collapsible Instructions Section */}
          <Pressable 
            style={styles.sectionHeader}
            onPress={() => setShowInstructions(!showInstructions)}
          >
            <Text style={styles.sectionTitle}>Instructions</Text>
            {showInstructions ? (
              <ChevronUp size={20} color={colors.textLight} />
            ) : (
              <ChevronDown size={20} color={colors.textLight} />
            )}
          </Pressable>
          
          {showInstructions && (
            <View style={styles.instructionsList}>
              {recipe.instructions.map((instruction, index) => (
                <View key={index} style={styles.instruction}>
                  <Text style={styles.instructionNumber}>{index + 1}</Text>
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Start Cooking Button */}
          <Pressable 
            style={styles.startCookingButton}
            onPress={handleStartCooking}
          >
            <Play size={20} color={colors.background} />
            <Text style={styles.startCookingText}>Start Cooking</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>

      {/* Cooking Mode Modal */}
      <Modal
        visible={cookingMode}
        animationType="slide"
        transparent={false}
        onRequestClose={handleCloseCookingMode}
      >
        <SafeAreaView style={styles.cookingModeContainer}>
          <View style={styles.cookingModeHeader}>
            <Pressable onPress={handleCloseCookingMode} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </Pressable>
            <Text style={styles.cookingModeTitle}>{recipe.title}</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.cookingModeContent}>
            <View style={styles.stepProgress}>
              <Text style={styles.stepProgressText}>
                Step {currentStep + 1} of {recipe.instructions.length}
              </Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${((currentStep + 1) / recipe.instructions.length) * 100}%` }
                  ]} 
                />
              </View>
            </View>

            <View style={styles.currentStepContainer}>
              <Text style={styles.currentStepText}>{recipe.instructions[currentStep]}</Text>
              
              <View style={styles.timerContainer}>
                <Text style={styles.timerText}>{formatTime(timer)}</Text>
                <Pressable 
                  style={styles.timerButton}
                  onPress={toggleTimer}
                >
                  {timerActive ? (
                    <Pause size={24} color={colors.primary} />
                  ) : (
                    <Play size={24} color={colors.primary} />
                  )}
                </Pressable>
              </View>

              <View style={styles.stepNavigation}>
                {currentStep > 0 && (
                  <Pressable 
                    style={[styles.navButton, styles.prevButton]}
                    onPress={handlePrevStep}
                  >
                    <Text style={styles.prevButtonText}>Previous</Text>
                  </Pressable>
                )}
                
                <Pressable 
                  style={[styles.navButton, styles.nextButton]}
                  onPress={handleNextStep}
                >
                  <Text style={styles.nextButtonText}>
                    {currentStep < recipe.instructions.length - 1 ? 'Next Step' : 'Finish'}
                  </Text>
                  {currentStep < recipe.instructions.length - 1 ? (
                    <ArrowLeft size={16} color={colors.background} />
                  ) : (
                    <Check size={16} color={colors.background} />
                  )}
                </Pressable>
              </View>
            </View>

            <View style={styles.cookingIngredients}>
              <Text style={styles.cookingIngredientsTitle}>Ingredients</Text>
              <ScrollView style={styles.cookingIngredientsScroll}>
                {recipe.ingredients.map((ingredient) => (
                  <View key={ingredient.id} style={styles.cookingIngredient}>
                    <Text style={styles.cookingIngredientText}>
                      • {getAdjustedAmount(ingredient.amount)} {ingredient.unit} {ingredient.name}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    marginLeft: 8,
  },
  headerButtons: {
    flexDirection: 'row',
    marginRight: 8,
  },
  headerButton: {
    marginHorizontal: 8,
  },
  image: {
    width: "100%",
    height: 300,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
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
    fontSize: 14,
    fontWeight: "500",
  },
  description: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 16,
    lineHeight: 24,
  },
  dietTypes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
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
    justifyContent: "space-around",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  stat: {
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 16,
    color: colors.textLight,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
  },
  nutritionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  nutritionItem: {
    width: "18%",
    alignItems: "center",
    marginBottom: 8,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  nutritionLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
  },
  ingredientsList: {
    marginBottom: 24,
  },
  servingAdjuster: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  servingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  servingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  servingButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  servingButtonDisabled: {
    opacity: 0.5,
  },
  servingButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.background,
  },
  servingCount: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  ingredient: {
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 16,
    color: colors.text,
  },
  addToCartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 16,
    gap: 8,
  },
  addToCartText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary,
  },
  instructionsList: {
    marginBottom: 24,
  },
  instruction: {
    flexDirection: "row",
    marginBottom: 16,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    backgroundColor: colors.primary,
    borderRadius: 12,
    color: colors.background,
    textAlign: "center",
    lineHeight: 24,
    marginRight: 12,
    fontSize: 14,
    fontWeight: "500",
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  startCookingButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  startCookingText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.background,
  },
  cookingModeContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  cookingModeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: 4,
  },
  cookingModeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  cookingModeContent: {
    flex: 1,
    padding: 16,
  },
  stepProgress: {
    marginBottom: 24,
  },
  stepProgressText: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  currentStepContainer: {
    flex: 1,
    marginBottom: 24,
  },
  currentStepText: {
    fontSize: 18,
    color: colors.text,
    lineHeight: 28,
    marginBottom: 24,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 16,
  },
  timerText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
  },
  timerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevButton: {
    backgroundColor: colors.card,
    flex: 1,
  },
  prevButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  nextButton: {
    backgroundColor: colors.primary,
    flex: 2,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
  cookingIngredients: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  cookingIngredientsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 12,
  },
  cookingIngredientsScroll: {
    maxHeight: 120,
  },
  cookingIngredient: {
    marginBottom: 8,
  },
  cookingIngredientText: {
    fontSize: 14,
    color: colors.text,
  },
});