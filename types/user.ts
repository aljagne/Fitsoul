export type FitnessGoal = 
  | "weight_loss"
  | "muscle_gain"
  | "endurance"
  | "flexibility"
  | "general_fitness";

export type DietaryPreference = 
  | "vegetarian"
  | "vegan"
  | "keto"
  | "paleo"
  | "gluten_free"
  | "no_restrictions";

export type ActivityLevel = 
  | "sedentary"
  | "lightly_active"
  | "moderately_active"
  | "very_active"
  | "extremely_active";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  iconName: string;
  dateEarned: string;
  points: number;
};

export type WorkoutHistory = {
  date: string;
  workoutId: string;
  workoutName: string;
  duration: number; // in minutes
  caloriesBurned: number;
};

export type NutritionHistory = {
  date: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  recipeId?: string;
  recipeName?: string;
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
};

export type WeeklyStats = {
  workoutMinutes: number;
  caloriesBurned: number;
  workoutsCompleted: number;
  averageWorkoutDuration: number;
  streakDays: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  bio: string;
  fitnessGoals: FitnessGoal[];
  dietaryPreferences: DietaryPreference[];
  activityLevel: ActivityLevel;
  height?: number; // in cm
  weight?: number; // in kg
  dateOfBirth?: string;
  location?: string;
  joinDate: string;
  achievements: Achievement[];
  workoutHistory: WorkoutHistory[];
  nutritionHistory: NutritionHistory[];
  weeklyStats: WeeklyStats;
  friends: string[]; // user IDs
  challengesCompleted: number;
  totalPoints: number;
};