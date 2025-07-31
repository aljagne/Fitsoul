import { Pressable, StyleSheet, View, Text } from 'react-native';
import { Plus } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useState, useCallback } from 'react';
import { ActionSheet } from './ActionSheet';
import { router } from 'expo-router';

export function ActionButton() {
  const [showActionSheet, setShowActionSheet] = useState(false);

  const handleActionSelect = useCallback((action: string) => {
    setShowActionSheet(false);
    
    // Delay navigation to ensure UI updates first
    setTimeout(() => {
      try {
        switch(action) {
          case 'workout':
            router.push("/workouts");
            break;
          case 'recipe':
            router.push("/recipes");
            break;
          case 'challenge':
            router.push("/challenges");
            break;
          case 'partner':
            router.push("/social");
            break;
          default:
            break;
        }
      } catch (error) {
        console.error("Navigation error:", error);
      }
    }, 0);
  }, []);

  return (
    <>
      <Pressable 
        style={styles.actionButton}
        onPress={() => setShowActionSheet(true)}
      >
        <Plus size={24} color="#FFFFFF" strokeWidth={2.5} />
      </Pressable>
      
      <ActionSheet 
        visible={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        actions={[
          { id: 'workout', title: 'Start Workout', icon: 'Dumbbell' },
          { id: 'recipe', title: 'Log Meal', icon: 'UtensilsCrossed' },
          { id: 'challenge', title: 'Join Challenge', icon: 'Trophy' },
          { id: 'partner', title: 'Find Partner', icon: 'Users' }
        ]}
        onSelect={handleActionSelect}
      />
    </>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});