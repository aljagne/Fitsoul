import { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  Pressable, 
  ScrollView, 
  Platform, 
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Redirect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Check, MapPin, Camera, User, ArrowLeft } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useOnboardingStore } from '@/hooks/use-onboarding-store';
import { FitnessGoal, DietaryPreference } from '@/types/user';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// Mock data for equipment
const equipmentOptions = [
  { id: 'dumbbells', label: 'Dumbbells', icon: '🏋️' },
  { id: 'yoga_mat', label: 'Yoga Mat', icon: '🧘' },
  { id: 'resistance_bands', label: 'Resistance Bands', icon: '🔄' },
  { id: 'kettlebell', label: 'Kettlebell', icon: '🏋️‍♀️' },
  { id: 'pull_up_bar', label: 'Pull-up Bar', icon: '🔝' },
  { id: 'jump_rope', label: 'Jump Rope', icon: '⏭️' },
  { id: 'exercise_bike', label: 'Exercise Bike', icon: '🚲' },
  { id: 'treadmill', label: 'Treadmill', icon: '🏃' },
];

// Mock data for avatars
const avatarOptions = [
  { id: '1', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200' },
  { id: '2', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' },
  { id: '3', url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200' },
  { id: '4', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200' },
  { id: '5', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200' },
  { id: '6', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
];

export default function OnboardingScreen() {
  const { 
    currentStep, 
    fitnessGoals, 
    dietaryPreferences, 
    availableEquipment,
    allowLocationAccess,
    avatarUrl,
    hasCompletedOnboarding,
    setHasCompletedOnboarding,
    setCurrentStep,
    nextStep, 
    previousStep,
    toggleFitnessGoal,
    toggleDietaryPreference,
    toggleEquipment,
    setAllowLocationAccess,
    setAvatarUrl
  } = useOnboardingStore();

  // If onboarding is already completed, redirect to tabs
  if (hasCompletedOnboarding) {
    return <Redirect href="/(tabs)" />;
  }

  // Animation values
  const slideAnim = useSharedValue(0);
  const fadeAnim = useSharedValue(1);
  const progressAnim = useSharedValue((currentStep + 1) / 6);

  // Handle animation when step changes
  useEffect(() => {
    // Animate progress bar
    progressAnim.value = withTiming((currentStep + 1) / 6, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });

    // Slide out current content
    fadeAnim.value = withTiming(0, {
      duration: 150,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });

    const timeout1 = setTimeout(() => {
      slideAnim.value = -50;
      
      // Slide in new content
      const timeout2 = setTimeout(() => {
        slideAnim.value = withTiming(0, {
          duration: 300,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
        
        fadeAnim.value = withTiming(1, {
          duration: 300,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
      }, 50);
      
      return () => clearTimeout(timeout2);
    }, 150);
    
    return () => clearTimeout(timeout1);
  }, [currentStep]);

  const handleComplete = () => {
    // This is the critical part - set onboarding as completed
    console.log("Completing onboarding");
    setHasCompletedOnboarding(true);
    
    // Use router.replace instead of setTimeout
    router.replace('/(tabs)');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={nextStep} />;
      case 1:
        return (
          <FitnessGoalsStep 
            selectedGoals={fitnessGoals}
            onToggleGoal={toggleFitnessGoal}
            onNext={nextStep}
            onBack={previousStep}
          />
        );
      case 2:
        return (
          <DietaryPreferencesStep 
            selectedPreferences={dietaryPreferences}
            onTogglePreference={toggleDietaryPreference}
            onNext={nextStep}
            onBack={previousStep}
          />
        );
      case 3:
        return (
          <EquipmentStep 
            selectedEquipment={availableEquipment}
            onToggleEquipment={toggleEquipment}
            onNext={nextStep}
            onBack={previousStep}
          />
        );
      case 4:
        return (
          <LocationStep 
            allowLocation={allowLocationAccess}
            onAllowLocation={() => setAllowLocationAccess(true)}
            onSkipLocation={() => setAllowLocationAccess(false)}
            onNext={nextStep}
            onBack={previousStep}
          />
        );
      case 5:
        return (
          <AvatarStep 
            selectedAvatar={avatarUrl}
            onSelectAvatar={setAvatarUrl}
            onComplete={handleComplete}
            onBack={previousStep}
          />
        );
      default:
        return <WelcomeStep onNext={nextStep} />;
    }
  };

  const handleBackPress = () => {
    if (currentStep === 0) {
      router.back();
    } else {
      previousStep();
    }
  };

  // Animated styles
  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ translateX: slideAnim.value }]
    };
  });

  const progressBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progressAnim.value * 100}%`
    };
  });

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        {currentStep > 0 && (
          <Pressable 
            style={styles.backButton} 
            onPress={handleBackPress}
            hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
          >
            <ArrowLeft size={24} color={colors.text} />
          </Pressable>
        )}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View 
              style={[
                styles.progressFill, 
                progressBarAnimatedStyle
              ]} 
            />
          </View>
          <Text style={styles.progressText}>Step {currentStep + 1} of 6</Text>
        </View>
      </View>
      
      <Animated.View 
        style={[
          styles.stepContainer,
          contentAnimatedStyle
        ]}
      >
        {renderStep()}
      </Animated.View>
    </SafeAreaView>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  const scaleAnim = useSharedValue(0.95);
  const fadeAnim = useSharedValue(0);
  
  useEffect(() => {
    scaleAnim.value = withTiming(1, {
      duration: 600,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    
    fadeAnim.value = withTiming(1, {
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, []);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ scale: scaleAnim.value }]
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value
    };
  });

  return (
    <View style={styles.stepContent}>
      <Animated.View 
        style={[
          styles.welcomeImageContainer,
          imageAnimatedStyle
        ]}
      >
        <LinearGradient
          colors={[colors.primary + '20', colors.secondary + '20']}
          style={styles.welcomeGradient}
        >
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600' }} 
            style={styles.welcomeImage}
          />
        </LinearGradient>
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.welcomeContent,
          contentAnimatedStyle
        ]}
      >
        <Text style={styles.welcomeTitle}>Welcome to FitElity</Text>
        <Text style={styles.welcomeSubtitle}>Your Fitness Journey Starts Here</Text>
        <Text style={styles.welcomeDescription}>
          Connect with fitness partners, discover workouts, track your progress, and achieve your goals together.
        </Text>
        
        <Pressable style={styles.primaryButton} onPress={onNext}>
          <Text style={styles.primaryButtonText}>Get Started</Text>
          <ArrowRight size={20} color={colors.background} />
        </Pressable>
      </Animated.View>
    </View>
  );
}

function FitnessGoalsStep({ 
  selectedGoals, 
  onToggleGoal, 
  onNext, 
  onBack 
}: { 
  selectedGoals: FitnessGoal[],
  onToggleGoal: (goal: FitnessGoal) => void,
  onNext: () => void,
  onBack: () => void
}) {
  const goals: { id: FitnessGoal, label: string, icon: string }[] = [
    { id: 'weight_loss', label: 'Weight Loss', icon: '⚖️' },
    { id: 'muscle_gain', label: 'Muscle Gain', icon: '💪' },
    { id: 'endurance', label: 'Endurance', icon: '🏃' },
    { id: 'flexibility', label: 'Flexibility', icon: '🧘‍♀️' },
    { id: 'general_fitness', label: 'General Fitness', icon: '🏆' },
  ];

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>What are your fitness goals?</Text>
      <Text style={styles.stepDescription}>Select all that apply to you</Text>
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.goalsGrid}>
          {goals.map((goal, index) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              isSelected={selectedGoals.includes(goal.id)}
              onToggle={() => onToggleGoal(goal.id)}
              index={index}
            />
          ))}
        </View>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <Pressable 
          style={[
            styles.primaryButton, 
            selectedGoals.length === 0 && styles.disabledButton
          ]} 
          onPress={onNext}
          disabled={selectedGoals.length === 0}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
          <ArrowRight size={20} color={colors.background} />
        </Pressable>
      </View>
    </View>
  );
}

function GoalCard({ 
  goal, 
  isSelected, 
  onToggle, 
  index 
}: { 
  goal: { id: string, label: string, icon: string }, 
  isSelected: boolean, 
  onToggle: () => void,
  index: number
}) {
  const scaleAnim = useSharedValue(0.8);
  const fadeAnim = useSharedValue(0);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      scaleAnim.value = withTiming(1, {
        duration: 400,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      
      fadeAnim.value = withTiming(1, {
        duration: 400,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }, index * 100);
    
    return () => clearTimeout(timeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ scale: scaleAnim.value }],
      width: '48%',
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        style={[
          styles.goalCard,
          isSelected && styles.goalCardSelected,
        ]}
        onPress={onToggle}
      >
        <Text style={styles.goalIcon}>{goal.icon}</Text>
        <Text style={styles.goalLabel}>{goal.label}</Text>
        {isSelected && (
          <View style={styles.checkmark}>
            <Check size={16} color={colors.background} />
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

function DietaryPreferencesStep({ 
  selectedPreferences, 
  onTogglePreference, 
  onNext, 
  onBack 
}: { 
  selectedPreferences: DietaryPreference[],
  onTogglePreference: (preference: DietaryPreference) => void,
  onNext: () => void,
  onBack: () => void
}) {
  const preferences: { id: DietaryPreference, label: string, icon: string }[] = [
    { id: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
    { id: 'vegan', label: 'Vegan', icon: '🌱' },
    { id: 'keto', label: 'Keto', icon: '🥑' },
    { id: 'paleo', label: 'Paleo', icon: '🍖' },
    { id: 'gluten_free', label: 'Gluten Free', icon: '🌾' },
    { id: 'no_restrictions', label: 'No Restrictions', icon: '🍽️' },
  ];

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Dietary Preferences</Text>
      <Text style={styles.stepDescription}>Select all that apply to you</Text>
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.preferencesGrid}>
          {preferences.map((preference, index) => (
            <PreferenceCard
              key={preference.id}
              preference={preference}
              isSelected={selectedPreferences.includes(preference.id)}
              onToggle={() => onTogglePreference(preference.id)}
              index={index}
            />
          ))}
        </View>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <Pressable style={styles.primaryButton} onPress={onNext}>
          <Text style={styles.primaryButtonText}>Continue</Text>
          <ArrowRight size={20} color={colors.background} />
        </Pressable>
      </View>
    </View>
  );
}

function PreferenceCard({ 
  preference, 
  isSelected, 
  onToggle, 
  index 
}: { 
  preference: { id: string, label: string, icon: string }, 
  isSelected: boolean, 
  onToggle: () => void,
  index: number
}) {
  const scaleAnim = useSharedValue(0.8);
  const fadeAnim = useSharedValue(0);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      scaleAnim.value = withTiming(1, {
        duration: 400,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      
      fadeAnim.value = withTiming(1, {
        duration: 400,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }, index * 100);
    
    return () => clearTimeout(timeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ scale: scaleAnim.value }],
      width: '48%',
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        style={[
          styles.preferenceCard,
          isSelected && styles.preferenceCardSelected,
        ]}
        onPress={onToggle}
      >
        <Text style={styles.preferenceIcon}>{preference.icon}</Text>
        <Text style={styles.preferenceLabel}>{preference.label}</Text>
        {isSelected && (
          <View style={styles.checkmark}>
            <Check size={16} color={colors.background} />
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

function EquipmentStep({ 
  selectedEquipment, 
  onToggleEquipment, 
  onNext, 
  onBack 
}: { 
  selectedEquipment: string[],
  onToggleEquipment: (equipment: string) => void,
  onNext: () => void,
  onBack: () => void
}) {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Available Equipment</Text>
      <Text style={styles.stepDescription}>Select the equipment you have access to</Text>
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.equipmentGrid}>
          {equipmentOptions.map((equipment, index) => (
            <EquipmentCard
              key={equipment.id}
              equipment={equipment}
              isSelected={selectedEquipment.includes(equipment.id)}
              onToggle={() => onToggleEquipment(equipment.id)}
              index={index}
            />
          ))}
        </View>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <Pressable style={styles.primaryButton} onPress={onNext}>
          <Text style={styles.primaryButtonText}>Continue</Text>
          <ArrowRight size={20} color={colors.background} />
        </Pressable>
      </View>
    </View>
  );
}

function EquipmentCard({ 
  equipment, 
  isSelected, 
  onToggle, 
  index 
}: { 
  equipment: { id: string, label: string, icon: string }, 
  isSelected: boolean, 
  onToggle: () => void,
  index: number
}) {
  const scaleAnim = useSharedValue(0.8);
  const fadeAnim = useSharedValue(0);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      scaleAnim.value = withTiming(1, {
        duration: 400,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      
      fadeAnim.value = withTiming(1, {
        duration: 400,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }, index * 100);
    
    return () => clearTimeout(timeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ scale: scaleAnim.value }],
      width: '48%',
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        style={[
          styles.equipmentCard,
          isSelected && styles.equipmentCardSelected,
        ]}
        onPress={onToggle}
      >
        <Text style={styles.equipmentIcon}>{equipment.icon}</Text>
        <Text style={styles.equipmentLabel}>{equipment.label}</Text>
        {isSelected && (
          <View style={styles.checkmark}>
            <Check size={16} color={colors.background} />
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

function LocationStep({ 
  allowLocation, 
  onAllowLocation, 
  onSkipLocation, 
  onNext, 
  onBack 
}: { 
  allowLocation: boolean,
  onAllowLocation: () => void,
  onSkipLocation: () => void,
  onNext: () => void,
  onBack: () => void
}) {
  const scaleAnim = useSharedValue(0.9);
  const fadeAnim = useSharedValue(0);
  
  useEffect(() => {
    scaleAnim.value = withTiming(1, {
      duration: 600,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    
    fadeAnim.value = withTiming(1, {
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, []);

  const handleAllowLocation = () => {
    onAllowLocation();
    onNext();
  };

  const handleSkipLocation = () => {
    onSkipLocation();
    onNext();
  };

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ scale: scaleAnim.value }]
    };
  });

  return (
    <View style={styles.stepContent}>
      <Animated.View 
        style={[
          styles.locationImageContainer,
          imageAnimatedStyle
        ]}
      >
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69c07a?w=600' }} 
          style={styles.locationImage}
        />
        <View style={styles.locationIconOverlay}>
          <MapPin size={40} color={colors.primary} />
        </View>
      </Animated.View>
      
      <Text style={styles.stepTitle}>Find Nearby Fitness Partners</Text>
      <Text style={styles.stepDescription}>
        Allow location access to find workout partners and fitness events near you
      </Text>
      
      <View style={styles.buttonContainer}>
        <Pressable style={styles.secondaryButton} onPress={handleSkipLocation}>
          <Text style={styles.secondaryButtonText}>Not Now</Text>
        </Pressable>
        <Pressable style={styles.primaryButton} onPress={handleAllowLocation}>
          <Text style={styles.primaryButtonText}>Allow</Text>
          <MapPin size={20} color={colors.background} />
        </Pressable>
      </View>
    </View>
  );
}

function AvatarStep({ 
  selectedAvatar, 
  onSelectAvatar, 
  onComplete, 
  onBack 
}: { 
  selectedAvatar: string | null,
  onSelectAvatar: (url: string) => void,
  onComplete: () => void,
  onBack: () => void
}) {
  const handleTakePhoto = () => {
    // In a real app, this would open the camera
    // For now, just select a default avatar
    onSelectAvatar(avatarOptions[0].url);
  };

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Choose Your Avatar</Text>
      <Text style={styles.stepDescription}>Select a profile picture or take a photo</Text>
      
      {selectedAvatar ? (
        <View style={styles.selectedAvatarContainer}>
          <Image source={{ uri: selectedAvatar }} style={styles.selectedAvatar} />
          <Pressable style={styles.changeAvatarButton} onPress={() => onSelectAvatar('')}>
            <Text style={styles.changeAvatarText}>Change</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.avatarGrid}>
              {avatarOptions.map((avatar, index) => (
                <AvatarCard
                  key={avatar.id}
                  avatar={avatar}
                  isSelected={selectedAvatar === avatar.url}
                  onSelect={() => onSelectAvatar(avatar.url)}
                  index={index}
                />
              ))}
            </View>
          </ScrollView>
          
          <Pressable style={styles.takePhotoButton} onPress={handleTakePhoto}>
            <Camera size={20} color={colors.primary} />
            <Text style={styles.takePhotoText}>Take a Photo</Text>
          </Pressable>
        </>
      )}
      
      <View style={styles.buttonContainer}>
        <Pressable 
          style={[
            styles.primaryButton, 
            !selectedAvatar && styles.disabledButton
          ]} 
          onPress={onComplete}
          disabled={!selectedAvatar}
        >
          <Text style={styles.primaryButtonText}>Complete Setup</Text>
          <Check size={20} color={colors.background} />
        </Pressable>
      </View>
    </View>
  );
}

function AvatarCard({ 
  avatar, 
  isSelected, 
  onSelect, 
  index 
}: { 
  avatar: { id: string, url: string }, 
  isSelected: boolean, 
  onSelect: () => void,
  index: number
}) {
  const scaleAnim = useSharedValue(0.8);
  const fadeAnim = useSharedValue(0);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      scaleAnim.value = withTiming(1, {
        duration: 400,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      
      fadeAnim.value = withTiming(1, {
        duration: 400,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }, index * 100);
    
    return () => clearTimeout(timeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ scale: scaleAnim.value }],
      width: '31%',
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        style={[
          styles.avatarCard,
          isSelected && styles.avatarCardSelected,
        ]}
        onPress={onSelect}
      >
        <Image source={{ uri: avatar.url }} style={styles.avatarImage} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  progressContainer: {
    flex: 1,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'right',
  },
  stepContainer: {
    flex: 1,
  },
  stepContent: {
    flex: 1,
    padding: 16,
  },
  welcomeImageContainer: {
    marginBottom: 24,
  },
  welcomeGradient: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  welcomeImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  welcomeContent: {
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  welcomeDescription: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 24,
  },
  scrollContainer: {
    flex: 1,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  goalCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  goalCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  goalIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preferencesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  preferenceCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  preferenceCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  preferenceIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  equipmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  equipmentCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  equipmentCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  equipmentIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  equipmentLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  locationImageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 24,
  },
  locationImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  locationIconOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -40 }, { translateY: -40 }],
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 40,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  avatarCard: {
    aspectRatio: 1,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarCardSelected: {
    borderColor: colors.primary,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  selectedAvatarContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  selectedAvatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  changeAvatarButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 20,
  },
  changeAvatarText: {
    color: colors.primary,
    fontWeight: '500',
  },
  takePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 24,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  takePhotoText: {
    color: colors.primary,
    fontWeight: '500',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    flex: 1,
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: colors.background,
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    flex: 1,
  },
  secondaryButtonText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
});