import { useEffect } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { Play, Compass, CookingPot, Share2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSequence,
  withDelay
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.createAnimatedComponent(View);

export default function ActionButtonScreen() {
  // This is a dummy screen that will never be shown
  // It's just a placeholder for the action button in the tab bar
  
  // Animation values
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    // Redirect to home if someone somehow navigates here directly
    try {
      router.replace('/');
    } catch (error) {
      console.error("Navigation error:", error);
    }
    
    // Entrance animation sequence
    opacity.value = withTiming(1, { duration: 300 });
    translateY.value = withSequence(
      withTiming(20, { duration: 0 }),
      withDelay(100, withTiming(0, { duration: 500 }))
    );
    
    // Trigger animation when this screen is somehow loaded
    scale.value = withSequence(
      withTiming(1.2, { duration: 200 }),
      withTiming(1, { duration: 200 })
    );
    
    rotation.value = withSequence(
      withTiming(10, { duration: 100 }),
      withTiming(-10, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );
  }, []);
  
  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` },
        { translateY: translateY.value }
      ],
      opacity: opacity.value
    };
  });
  
  return (
    <View style={styles.container}>
      <AnimatedView style={[styles.actionButtonWrapper, animatedStyle]}>
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.actionButton}
        >
          <Compass size={24} color="white" />
        </LinearGradient>
        <Text style={[styles.actionLabel, { color: colors.primary }]}>
          Explore
        </Text>
      </AnimatedView>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Adaptive Flow Navigation</Text>
        <Text style={styles.infoText}>
          Our contextual action button adapts to your current screen, providing the most relevant action at your fingertips.
        </Text>
        
        <View style={styles.actionsExamples}>
          <View style={styles.actionExample}>
            <View style={[styles.actionDot, { backgroundColor: colors.primary }]} />
            <Text style={styles.actionExampleText}>
              <Text style={styles.bold}>Home:</Text> Explore social feed
            </Text>
          </View>
          
          <View style={styles.actionExample}>
            <View style={[styles.actionDot, { backgroundColor: colors.success }]} />
            <Text style={styles.actionExampleText}>
              <Text style={styles.bold}>Workouts:</Text> Start a workout
            </Text>
          </View>
          
          <View style={styles.actionExample}>
            <View style={[styles.actionDot, { backgroundColor: colors.warning }]} />
            <Text style={styles.actionExampleText}>
              <Text style={styles.bold}>Recipes:</Text> Cook featured meal
            </Text>
          </View>
          
          <View style={styles.actionExample}>
            <View style={[styles.actionDot, { backgroundColor: colors.secondary }]} />
            <Text style={styles.actionExampleText}>
              <Text style={styles.bold}>Profile:</Text> Share your stats
            </Text>
          </View>
        </View>
        
        <View style={styles.gestureInfo}>
          <Text style={styles.gestureTitle}>Pro Tips:</Text>
          <Text style={styles.gestureText}>• Long press for quick actions</Text>
          <Text style={styles.gestureText}>• Swipe on tab bar to switch tabs</Text>
          <Text style={styles.gestureText}>• Double tap to see detailed options</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  actionButtonWrapper: {
    alignItems: 'center',
    marginBottom: 40,
  },
  actionButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
  actionLabel: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: colors.card,
    padding: 24,
    borderRadius: 20,
    width: '100%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  actionsExamples: {
    gap: 14,
    marginBottom: 24,
  },
  actionExample: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  actionExampleText: {
    fontSize: 15,
    color: colors.text,
  },
  bold: {
    fontWeight: 'bold',
  },
  gestureInfo: {
    backgroundColor: colors.highlight,
    padding: 16,
    borderRadius: 12,
  },
  gestureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  gestureText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
    lineHeight: 22,
  },
});