import { Challenge } from "@/types/challenge";

export const challenges: Challenge[] = [
  {
    id: "1",
    title: "30-Day Push-Up Challenge",
    description: "Build upper body strength with daily push-ups. Start with 5 and work your way up to 50!",
    type: "workout",
    status: "active",
    startDate: "2024-02-01",
    endDate: "2024-03-01",
    imageUrl: "https://images.unsplash.com/photo-1598971639058-999901179375?w=800",
    progress: {
      current: 150,
      target: 500,
      unit: "push-ups",
      lastUpdated: "2024-02-15",
    },
    participants: [
      {
        id: "1",
        name: "Sarah Johnson",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
        progress: {
          current: 200,
          target: 500,
          unit: "push-ups",
          lastUpdated: "2024-02-15",
        },
        rank: 1,
      },
      {
        id: "2",
        name: "Mike Chen",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
        progress: {
          current: 150,
          target: 500,
          unit: "push-ups",
          lastUpdated: "2024-02-14",
        },
        rank: 2,
      },
    ],
    rules: [
      "Complete the daily push-up target",
      "Record your progress in the app",
      "Rest days are on Sundays",
      "Form must be perfect for reps to count",
    ],
    rewards: {
      points: 1000,
      badge: "Push-Up Pro",
    },
  },
  {
    id: "2",
    title: "Meal Prep Master",
    description: "Prepare healthy meals in advance for 4 weeks. Build better eating habits!",
    type: "nutrition",
    status: "upcoming",
    startDate: "2024-03-01",
    endDate: "2024-03-28",
    imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800",
    progress: {
      current: 0,
      target: 20,
      unit: "meals",
      lastUpdated: "2024-02-15",
    },
    participants: [
      {
        id: "1",
        name: "Emily Davis",
        avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
        progress: {
          current: 0,
          target: 20,
          unit: "meals",
          lastUpdated: "2024-02-15",
        },
      },
    ],
    rules: [
      "Prep minimum 5 meals per week",
      "Share photos of your prep",
      "Include protein in every meal",
      "Use fresh ingredients",
    ],
    rewards: {
      points: 800,
      badge: "Meal Prep Expert",
    },
  },
  {
    id: "3",
    title: "10K Steps Daily",
    description: "Walk 10,000 steps every day for 2 weeks. Stay active and healthy!",
    type: "steps",
    status: "completed",
    startDate: "2024-01-15",
    endDate: "2024-01-29",
    imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800",
    progress: {
      current: 140000,
      target: 140000,
      unit: "steps",
      lastUpdated: "2024-01-29",
    },
    participants: [
      {
        id: "1",
        name: "Alex Wong",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
        progress: {
          current: 140000,
          target: 140000,
          unit: "steps",
          lastUpdated: "2024-01-29",
        },
        rank: 1,
      },
    ],
    rules: [
      "Walk 10,000 steps daily",
      "Sync your fitness tracker",
      "Indoor or outdoor steps count",
      "Complete all 14 days",
    ],
    rewards: {
      points: 500,
      badge: "Step Master",
    },
  },
];