export type Ingredient = {
  id: string;
  name: string;
  amount: number;
  unit: string;
};

export type NutritionFacts = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
};

export type RecipeCategory = 
  | "breakfast"
  | "lunch"
  | "dinner"
  | "snacks"
  | "desserts";

export type DietType = 
  | "all"
  | "vegetarian"
  | "vegan"
  | "keto"
  | "paleo"
  | "gluten-free";

export type Recipe = {
  id: string;
  title: string;
  description: string;
  category: RecipeCategory;
  dietTypes: DietType[];
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  difficulty: "easy" | "medium" | "hard";
  ingredients: Ingredient[];
  instructions: string[];
  nutrition: NutritionFacts;
  imageUrl: string;
};