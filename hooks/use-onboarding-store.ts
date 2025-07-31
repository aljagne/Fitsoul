import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FitnessGoal, DietaryPreference } from '@/types/user';

interface OnboardingState {
  hasCompletedOnboarding: boolean;
  currentStep: number;
  fitnessGoals: FitnessGoal[];
  dietaryPreferences: DietaryPreference[];
  availableEquipment: string[];
  allowLocationAccess: boolean;
  avatarUrl: string | null;
  
  // Actions
  setHasCompletedOnboarding: (value: boolean) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  toggleFitnessGoal: (goal: FitnessGoal) => void;
  toggleDietaryPreference: (preference: DietaryPreference) => void;
  toggleEquipment: (equipment: string) => void;
  setAllowLocationAccess: (allow: boolean) => void;
  setAvatarUrl: (url: string) => void;
  resetOnboarding: () => void;
}

// Create the store with persist middleware
export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false, // Default to false
      currentStep: 0,
      fitnessGoals: [],
      dietaryPreferences: [],
      availableEquipment: [],
      allowLocationAccess: false,
      avatarUrl: null,
      
      setHasCompletedOnboarding: (value) => {
        console.log("Setting hasCompletedOnboarding to:", value);
        set({ hasCompletedOnboarding: value });
      },
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      nextStep: () => set((state) => ({ 
        currentStep: Math.min(5, state.currentStep + 1) 
      })),
      
      previousStep: () => set((state) => ({ 
        currentStep: Math.max(0, state.currentStep - 1) 
      })),
      
      toggleFitnessGoal: (goal) => set((state) => {
        const goals = [...state.fitnessGoals];
        const index = goals.indexOf(goal);
        
        if (index === -1) {
          goals.push(goal);
        } else {
          goals.splice(index, 1);
        }
        
        return { fitnessGoals: goals };
      }),
      
      toggleDietaryPreference: (preference) => set((state) => {
        const preferences = [...state.dietaryPreferences];
        const index = preferences.indexOf(preference);
        
        if (index === -1) {
          preferences.push(preference);
        } else {
          preferences.splice(index, 1);
        }
        
        return { dietaryPreferences: preferences };
      }),
      
      toggleEquipment: (equipment) => set((state) => {
        const equipmentList = [...state.availableEquipment];
        const index = equipmentList.indexOf(equipment);
        
        if (index === -1) {
          equipmentList.push(equipment);
        } else {
          equipmentList.splice(index, 1);
        }
        
        return { availableEquipment: equipmentList };
      }),
      
      setAllowLocationAccess: (allow) => set({ allowLocationAccess: allow }),
      
      setAvatarUrl: (url) => set({ avatarUrl: url }),
      
      resetOnboarding: () => set({
        hasCompletedOnboarding: false,
        currentStep: 0,
        fitnessGoals: [],
        dietaryPreferences: [],
        availableEquipment: [],
        allowLocationAccess: false,
        avatarUrl: null,
      }),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Add debugging to help identify persistence issues
      onRehydrateStorage: () => (state) => {
        console.log('Rehydrated onboarding state:', state);
      }
    }
  )
);