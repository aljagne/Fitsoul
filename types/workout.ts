export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  duration?: number; // in seconds
  restTime: number; // in seconds
  imageUrl?: string;
};

export type WorkoutCategory = 
  | "strength"
  | "cardio" 
  | "hiit"
  | "yoga"
  | "stretching";

export type Workout = {
  id: string;
  title: string;
  description: string;
  category: WorkoutCategory;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number; // in minutes
  calories: number;
  imageUrl: string;
  exercises: Exercise[];
};