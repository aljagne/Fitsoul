export const workouts: Workout[] = [
  {
    id: "1",
    title: "Full Body Strength",
    description: "Build strength and muscle with this comprehensive workout",
    category: "strength",
    difficulty: "intermediate",
    duration: 45,
    calories: 400,
    imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
    exercises: [
      {
        id: "1",
        name: "Push-ups",
        sets: 3,
        reps: 12,
        restTime: 60,
      },
      {
        id: "2",
        name: "Squats",
        sets: 4,
        reps: 15,
        restTime: 90,
      },
      {
        id: "3",
        name: "Dumbbell Rows",
        sets: 3,
        reps: 12,
        restTime: 60,
      }
    ]
  },
  {
    id: "2",
    title: "HIIT Cardio Blast",
    description: "Intense cardio workout to burn fat and improve endurance",
    category: "hiit",
    difficulty: "advanced",
    duration: 30,
    calories: 350,
    imageUrl: "https://images.unsplash.com/photo-1434596922112-19c563067271?w=800",
    exercises: [
      {
        id: "1",
        name: "Burpees",
        sets: 3,
        reps: 15,
        restTime: 30,
      },
      {
        id: "2",
        name: "Mountain Climbers",
        sets: 3,
        duration: 45,
        restTime: 30,
      }
    ]
  },
  {
    id: "3",
    title: "Yoga Flow",
    description: "Relaxing yoga session for flexibility and mindfulness",
    category: "yoga",
    difficulty: "beginner",
    duration: 20,
    calories: 150,
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
    exercises: [
      {
        id: "1",
        name: "Sun Salutation",
        sets: 1,
        duration: 300,
        restTime: 0,
      },
      {
        id: "2",
        name: "Warrior Poses",
        sets: 1,
        duration: 300,
        restTime: 30,
      }
    ]
  }
];