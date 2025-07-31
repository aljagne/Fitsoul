import React, { useEffect, useRef } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { colors } from "@/constants/colors";
import { ArrowRight } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing
} from "react-native-reanimated";

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedText = Animated.createAnimatedComponent(Text);

export default function WelcomeScreen() {
  // Animation values
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);
  const logoScale = useSharedValue(0.8);
  
  useEffect(() => {
    // Sequence of animations
    logoScale.value = withTiming(1, {
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    
    // Content fade in and slide up
    fadeAnim.value = withTiming(1, {
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    
    slideAnim.value = withTiming(0, {
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, []);

  const handleGetStarted = () => {
    router.push("/onboarding");
  };

  const handleLogin = () => {
    router.push("/(auth)/login");
  };

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: logoScale.value }]
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ translateY: slideAnim.value }]
    };
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.background, colors.primary + "10"]}
        style={StyleSheet.absoluteFill}
      />
      
      <SafeAreaView style={styles.content}>
        <AnimatedView style={logoAnimatedStyle}>
          <View style={styles.header}>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800" }}
              style={styles.logo}
            />
            <Text style={styles.title}>FitElite</Text>
            <Text style={styles.subtitle}>Your Fitness Journey Starts Here</Text>
          </View>
        </AnimatedView>

        <AnimatedView style={contentAnimatedStyle}>
          <View style={styles.features}>
            <Feature
              title="Smart Workouts"
              description="Personalized training plans that adapt to your progress"
              delay={200}
            />
            <Feature
              title="Social Fitness"
              description="Connect with like-minded fitness partners"
              delay={400}
            />
            <Feature
              title="Track Progress"
              description="Monitor your achievements and stay motivated"
              delay={600}
            />
          </View>

          <View style={styles.buttons}>
            <Pressable
              style={styles.primaryButton}
              onPress={handleGetStarted}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
              <ArrowRight size={20} color={colors.background} />
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={handleLogin}
            >
              <Text style={styles.secondaryButtonText}>I already have an account</Text>
            </Pressable>
          </View>
        </AnimatedView>
      </SafeAreaView>
    </View>
  );
}

function Feature({ title, description, delay = 0 }: { title: string; description: string; delay?: number }) {
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(20);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      fadeAnim.value = withTiming(1, {
        duration: 600,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      
      slideAnim.value = withTiming(0, {
        duration: 600,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }, delay);
    
    return () => clearTimeout(timeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ translateY: slideAnim.value }]
    };
  });

  return (
    <AnimatedView style={[styles.feature, animatedStyle]}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textLight,
    textAlign: "center",
  },
  features: {
    flex: 1,
    justifyContent: "center",
    gap: 24,
  },
  feature: {
    alignItems: "center",
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: "center",
  },
  buttons: {
    gap: 16,
    marginTop: 24,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 16,
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.background,
  },
  secondaryButton: {
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 16,
    color: colors.primary,
    textAlign: "center",
    fontWeight: "500",
  },
});