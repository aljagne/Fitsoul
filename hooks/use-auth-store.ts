import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '@/types/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  onboardingCompleted: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  completeOnboarding: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      onboardingCompleted: false,
      
      login: async (email: string, password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo purposes, any email/password combination works
        set({ 
          isAuthenticated: true,
          user: {
            id: '1',
            name: 'John Doe',
            email: email,
            avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
            fitnessGoals: ['weight_loss', 'muscle_gain'],
            dietaryPreferences: ['no_restrictions'],
            availableEquipment: ['dumbbells', 'yoga_mat'],
            weeklyStats: {
              workoutsCompleted: 3,
              caloriesBurned: 1250,
              minutesExercised: 145
            },
            friends: ['2', '3', '4'],
            achievements: [
              { id: '1', title: 'First Workout', description: 'Completed your first workout', date: new Date().toISOString() },
              { id: '2', title: 'Workout Streak', description: 'Completed 3 workouts in a row', date: new Date().toISOString() }
            ],
            workoutHistory: [
              { 
                id: '1', 
                workoutName: 'Full Body Strength', 
                date: new Date().toISOString(), 
                duration: 45, 
                caloriesBurned: 320 
              }
            ],
            nutritionHistory: [
              { 
                id: '1', 
                recipeName: 'Protein Smoothie', 
                date: new Date().toISOString(), 
                mealType: 'Breakfast', 
                calories: 350 
              }
            ]
          }
        });
        
        console.log('Logged in successfully');
      },
      
      signup: async (name: string, email: string, password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo purposes, create a new user
        set({ 
          isAuthenticated: true,
          user: {
            id: '1',
            name: name,
            email: email,
            avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
            fitnessGoals: [],
            dietaryPreferences: [],
            availableEquipment: [],
            weeklyStats: {
              workoutsCompleted: 0,
              caloriesBurned: 0,
              minutesExercised: 0
            },
            friends: [],
            achievements: [],
            workoutHistory: [],
            nutritionHistory: []
          }
        });
        
        console.log('Signed up successfully');
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
        console.log('Logged out successfully');
      },
      
      completeOnboarding: () => {
        set({ onboardingCompleted: true });
        console.log('Onboarding completed');
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        console.log('Rehydrated auth state:', state);
      }
    }
  )
);