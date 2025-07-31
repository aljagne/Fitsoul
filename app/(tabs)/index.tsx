import { ScrollView, StyleSheet, Text, View, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@/components/Card";
import { colors } from "@/constants/colors";
import { Activity, Flame, Users, Dumbbell, UtensilsCrossed, Trophy, ArrowRight } from "lucide-react-native";
import { router, Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useOnboardingStore } from "@/hooks/use-onboarding-store";
import { currentUser } from "@/mocks/user";
import { challenges } from "@/mocks/challenges";
import { workouts } from "@/mocks/workouts";
import { recipes } from "@/mocks/recipes";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay
} from "react-native-reanimated";
import { useEffect } from "react";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedText = Animated.createAnimatedComponent(Text);

export default function HomeScreen() {
  const { fitnessGoals } = useOnboardingStore();
  
  // Get the most recent workout and recipe
  const recentWorkout = currentUser.workoutHistory[0];
  const recentRecipe = currentUser.nutritionHistory[0];
  
  // Get active challenges
  const activeChallenges = challenges.filter(challenge => challenge.status === "active");
  
  // Get recommended workouts based on user's fitness goals
  const recommendedWorkouts = workouts.filter(workout => {
    if (fitnessGoals.includes("weight_loss") && workout.category === "cardio") return true;
    if (fitnessGoals.includes("muscle_gain") && workout.category === "strength") return true;
    if (fitnessGoals.includes("flexibility") && workout.category === "yoga") return true;
    return false;
  }).slice(0, 2);
  
  // Get recommended recipes
  const recommendedRecipes = recipes.slice(0, 2);

  // Animation values
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-20);
  const statsOpacity = useSharedValue(0);
  const statsScale = useSharedValue(0.95);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);
  
  // Entrance animations
  useEffect(() => {
    // Header animation
    headerOpacity.value = withTiming(1, { duration: 600 });
    headerTranslateY.value = withTiming(0, { duration: 600 });
    
    // Stats animation
    statsOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));
    statsScale.value = withDelay(300, withTiming(1, { duration: 600 }));
    
    // Content animation
    contentOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
    contentTranslateY.value = withDelay(600, withTiming(0, { duration: 600 }));
  }, []);
  
  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
      transform: [{ translateY: headerTranslateY.value }],
    };
  });
  
  const statsAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: statsOpacity.value,
      transform: [{ scale: statsScale.value }],
    };
  });
  
  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
      transform: [{ translateY: contentTranslateY.value }],
    };
  });

  const handleQuickAction = (action: string) => {
    switch(action) {
      case 'workouts':
        try {
          router.push("/workouts");
        } catch (error) {
          console.error("Navigation error:", error);
        }
        break;
      case 'recipes':
        try {
          router.push("/recipes");
        } catch (error) {
          console.error("Navigation error:", error);
        }
        break;
      case 'challenges':
        try {
          router.push("/challenges");
        } catch (error) {
          console.error("Navigation error:", error);
        }
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <AnimatedView style={[styles.header, headerAnimatedStyle]}>
            <View>
              <Text style={styles.greeting}>Welcome back, {currentUser.name.split(' ')[0]}!</Text>
              <Text style={styles.subtitle}>Ready for today's workout?</Text>
            </View>
            <Pressable 
              onPress={() => {
                try {
                  router.push("/profile");
                } catch (error) {
                  console.error("Navigation error:", error);
                }
              }}
            >
              <Image source={{ uri: currentUser.avatarUrl }} style={styles.avatar} />
            </Pressable>
          </AnimatedView>

          {/* Quick Actions */}
          <AnimatedView style={[styles.quickActions, headerAnimatedStyle]}>
            <AnimatedPressable 
              style={styles.quickAction}
              onPress={() => handleQuickAction('workouts')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.primary + '15' }]}>
                <Dumbbell size={24} color={colors.primary} />
              </View>
              <Text style={styles.quickActionText}>Workouts</Text>
            </AnimatedPressable>
            
            <AnimatedPressable 
              style={styles.quickAction}
              onPress={() => handleQuickAction('recipes')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.secondary + '15' }]}>
                <UtensilsCrossed size={24} color={colors.secondary} />
              </View>
              <Text style={styles.quickActionText}>Recipes</Text>
            </AnimatedPressable>
            
            <AnimatedPressable 
              style={styles.quickAction}
              onPress={() => handleQuickAction('challenges')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.success + '15' }]}>
                <Trophy size={24} color={colors.success} />
              </View>
              <Text style={styles.quickActionText}>Challenges</Text>
            </AnimatedPressable>
          </AnimatedView>

          {/* Today's Stats */}
          <AnimatedView style={statsAnimatedStyle}>
            <Card style={styles.statsCard}>
              <Text style={styles.cardTitle}>Today's Stats</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Activity size={24} color={colors.primary} />
                  <Text style={styles.statValue}>{currentUser.weeklyStats.workoutsCompleted}/5</Text>
                  <Text style={styles.statLabel}>Workouts</Text>
                </View>
                <View style={styles.statItem}>
                  <Flame size={24} color={colors.secondary} />
                  <Text style={styles.statValue}>{currentUser.weeklyStats.caloriesBurned}</Text>
                  <Text style={styles.statLabel}>Calories</Text>
                </View>
                <View style={styles.statItem}>
                  <Users size={24} color={colors.success} />
                  <Text style={styles.statValue}>{currentUser.friends.length}</Text>
                  <Text style={styles.statLabel}>Friends</Text>
                </View>
              </View>
            </Card>
          </AnimatedView>

          <AnimatedView style={contentAnimatedStyle}>
            {/* Active Challenges */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Active Challenges</Text>
              <Pressable 
                style={styles.seeAllButton} 
                onPress={() => {
                  try {
                    router.push("/challenges");
                  } catch (error) {
                    console.error("Navigation error:", error);
                  }
                }}
              >
                <Text style={styles.seeAllText}>See All</Text>
                <ArrowRight size={16} color={colors.primary} />
              </Pressable>
            </View>
            
            {activeChallenges.length > 0 ? (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.challengesScroll}
              >
                {activeChallenges.map(challenge => (
                  <Pressable 
                    key={challenge.id} 
                    style={styles.challengeCard}
                    onPress={() => {
                      try {
                        router.push(`/challenge/${challenge.id}`);
                      } catch (error) {
                        console.error("Navigation error:", error);
                      }
                    }}
                  >
                    <Image source={{ uri: challenge.imageUrl }} style={styles.challengeImage} />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.7)']}
                      style={styles.challengeGradient}
                    >
                      <Text style={styles.challengeTitle}>{challenge.title}</Text>
                      <View style={styles.challengeProgress}>
                        <View style={styles.progressBar}>
                          <View 
                            style={[
                              styles.progressFill, 
                              { width: `${(challenge.progress.current / challenge.progress.target) * 100}%` }
                            ]} 
                          />
                        </View>
                        <Text style={styles.progressText}>
                          {challenge.progress.current}/{challenge.progress.target} {challenge.progress.unit}
                        </Text>
                      </View>
                    </LinearGradient>
                  </Pressable>
                ))}
              </ScrollView>
            ) : (
              <Card style={styles.emptyCard}>
                <Text style={styles.emptyText}>No active challenges</Text>
                <Pressable 
                  style={styles.emptyButton}
                  onPress={() => {
                    try {
                      router.push("/challenges");
                    } catch (error) {
                      console.error("Navigation error:", error);
                    }
                  }}
                >
                  <Text style={styles.emptyButtonText}>Find Challenges</Text>
                </Pressable>
              </Card>
            )}

            {/* Recommended Workouts */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recommended Workouts</Text>
              <Pressable 
                style={styles.seeAllButton} 
                onPress={() => {
                  try {
                    router.push("/workouts");
                  } catch (error) {
                    console.error("Navigation error:", error);
                  }
                }}
              >
                <Text style={styles.seeAllText}>See All</Text>
                <ArrowRight size={16} color={colors.primary} />
              </Pressable>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.workoutsScroll}
            >
              {recommendedWorkouts.map(workout => (
                <Pressable 
                  key={workout.id} 
                  style={styles.workoutCard}
                  onPress={() => {
                    try {
                      router.push(`/workout/${workout.id}`);
                    } catch (error) {
                      console.error("Navigation error:", error);
                    }
                  }}
                >
                  <Image source={{ uri: workout.imageUrl }} style={styles.workoutImage} />
                  <View style={styles.workoutContent}>
                    <Text style={styles.workoutTitle}>{workout.title}</Text>
                    <View style={styles.workoutStats}>
                      <View style={styles.workoutStat}>
                        <Dumbbell size={14} color={colors.textLight} />
                        <Text style={styles.workoutStatText}>{workout.exercises.length} exercises</Text>
                      </View>
                      <View style={styles.workoutStat}>
                        <Flame size={14} color={colors.textLight} />
                        <Text style={styles.workoutStatText}>{workout.calories} cal</Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))}
            </ScrollView>

            {/* Recommended Recipes */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recommended Recipes</Text>
              <Pressable 
                style={styles.seeAllButton} 
                onPress={() => {
                  try {
                    router.push("/recipes");
                  } catch (error) {
                    console.error("Navigation error:", error);
                  }
                }}
              >
                <Text style={styles.seeAllText}>See All</Text>
                <ArrowRight size={16} color={colors.primary} />
              </Pressable>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recipesScroll}
            >
              {recommendedRecipes.map(recipe => (
                <Pressable 
                  key={recipe.id} 
                  style={styles.recipeCard}
                  onPress={() => {
                    try {
                      router.push(`/recipe/${recipe.id}`);
                    } catch (error) {
                      console.error("Navigation error:", error);
                    }
                  }}
                >
                  <Image source={{ uri: recipe.imageUrl }} style={styles.recipeImage} />
                  <View style={styles.recipeContent}>
                    <Text style={styles.recipeTitle}>{recipe.title}</Text>
                    <View style={styles.recipeTags}>
                      {recipe.dietTypes.slice(0, 2).map(diet => (
                        <View key={diet} style={styles.recipeTag}>
                          <Text style={styles.recipeTagText}>
                            {diet.charAt(0).toUpperCase() + diet.slice(1)}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </Pressable>
              ))}
            </ScrollView>

            {/* Recent Activity */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
            </View>
            
            <Card style={styles.activityCard}>
              {recentWorkout ? (
                <View style={styles.activityItem}>
                  <View style={[styles.activityIcon, { backgroundColor: colors.primary + '15' }]}>
                    <Dumbbell size={20} color={colors.primary} />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{recentWorkout.workoutName}</Text>
                    <Text style={styles.activitySubtitle}>
                      {new Date(recentWorkout.date).toLocaleDateString()} • {recentWorkout.duration} min • {recentWorkout.caloriesBurned} cal
                    </Text>
                  </View>
                </View>
              ) : null}
              
              {recentRecipe ? (
                <View style={styles.activityItem}>
                  <View style={[styles.activityIcon, { backgroundColor: colors.secondary + '15' }]}>
                    <UtensilsCrossed size={20} color={colors.secondary} />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{recentRecipe.recipeName || "Meal logged"}</Text>
                    <Text style={styles.activitySubtitle}>
                      {new Date(recentRecipe.date).toLocaleDateString()} • {recentRecipe.mealType} • {recentRecipe.calories} cal
                    </Text>
                  </View>
                </View>
              ) : null}
              
              {!recentWorkout && !recentRecipe && (
                <Text style={styles.emptyText}>No recent activity</Text>
              )}
            </Card>
          </AnimatedView>
          
          {/* Extra padding at the bottom to account for the tab bar */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 100, // Extra padding for the tab bar
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 4,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  quickAction: {
    alignItems: "center",
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
  },
  statsCard: {
    marginHorizontal: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },
  challengesScroll: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  challengeCard: {
    width: 280,
    height: 160,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  challengeImage: {
    width: "100%",
    height: "100%",
  },
  challengeGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginBottom: 8,
  },
  challengeProgress: {
    marginTop: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "white",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: "white",
  },
  workoutsScroll: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  workoutCard: {
    width: 200,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: colors.card,
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  workoutImage: {
    width: "100%",
    height: 120,
  },
  workoutContent: {
    padding: 12,
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  workoutStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  workoutStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  workoutStatText: {
    fontSize: 12,
    color: colors.textLight,
  },
  recipesScroll: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  recipeCard: {
    width: 200,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: colors.card,
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  recipeImage: {
    width: "100%",
    height: 120,
  },
  recipeContent: {
    padding: 12,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  recipeTags: {
    flexDirection: "row",
    gap: 8,
  },
  recipeTag: {
    backgroundColor: colors.primary + "10",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recipeTagText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "500",
  },
  activityCard: {
    marginHorizontal: 16,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
  },
  activitySubtitle: {
    fontSize: 14,
    color: colors.textLight,
  },
  emptyCard: {
    marginHorizontal: 16,
    padding: 16,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: "center",
  },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: "center",
    marginTop: 16,
  },
  emptyButtonText: {
    color: colors.background,
    fontWeight: "500",
    fontSize: 16,
  },
  bottomPadding: {
    height: 80,
  },
});