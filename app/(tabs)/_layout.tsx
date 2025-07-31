import { Pressable, StyleSheet, View, Text } from "react-native";
import { Tabs, router, usePathname } from "expo-router";
import { Home, Dumbbell, UtensilsCrossed, UserRound, Compass, Play, CookingPot, Share2 } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";
import { BlurView } from "expo-blur";
import { useEffect, useState, useCallback, useRef } from "react";
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  withSpring, 
  useSharedValue,
  Easing,
  withSequence
} from "react-native-reanimated";
import * as Haptics from 'expo-haptics';

// Animated components
const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const initialRender = useRef(true);
  
  // Determine which tab is active for contextual CTA
  const [activeTab, setActiveTab] = useState("home");
  
  // Animation values for tab indicator
  const indicatorPosition = useSharedValue(0);
  const indicatorWidth = useSharedValue(70); // Default width
  const ctaScale = useSharedValue(1);
  const ctaRotation = useSharedValue(0);
  const ctaGlow = useSharedValue(0);
  
  // Animation values for tab items
  const homeScale = useSharedValue(1);
  const workoutsScale = useSharedValue(1);
  const recipesScale = useSharedValue(1);
  const profileScale = useSharedValue(1);
  
  // Start the glow animation for CTA
  useEffect(() => {
    const startGlowAnimation = () => {
      ctaGlow.value = withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      );
      
      // Repeat the animation
      setTimeout(startGlowAnimation, 3000);
    };
    
    startGlowAnimation();
    
    return () => {
      // Clean up any animations
    };
  }, [ctaGlow]);
  
  useEffect(() => {
    // Skip animation on initial render
    if (initialRender.current) {
      initialRender.current = false;
      
      // Set initial tab based on pathname
      if (pathname.includes("index")) {
        setActiveTab("home");
        indicatorPosition.value = 0;
        indicatorWidth.value = 70;
      } else if (pathname.includes("workouts")) {
        setActiveTab("workouts");
        indicatorPosition.value = 70;
        indicatorWidth.value = 90;
      } else if (pathname.includes("recipes")) {
        setActiveTab("recipes");
        indicatorPosition.value = 230;
        indicatorWidth.value = 80;
      } else if (pathname.includes("profile")) {
        setActiveTab("profile");
        indicatorPosition.value = 300;
        indicatorWidth.value = 80;
      }
      return;
    }
    
    // Trigger haptic feedback on tab change
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    
    if (pathname.includes("index")) {
      setActiveTab("home");
      indicatorPosition.value = withSpring(0, { damping: 15 });
      indicatorWidth.value = withSpring(70, { damping: 15 });
      
      // Animate the tab scale
      homeScale.value = withSequence(
        withTiming(1.2, { duration: 200 }),
        withTiming(1, { duration: 200 })
      );
    } else if (pathname.includes("workouts")) {
      setActiveTab("workouts");
      indicatorPosition.value = withSpring(70, { damping: 15 });
      indicatorWidth.value = withSpring(90, { damping: 15 });
      
      // Animate the tab scale
      workoutsScale.value = withSequence(
        withTiming(1.2, { duration: 200 }),
        withTiming(1, { duration: 200 })
      );
    } else if (pathname.includes("recipes")) {
      setActiveTab("recipes");
      indicatorPosition.value = withSpring(230, { damping: 15 });
      indicatorWidth.value = withSpring(80, { damping: 15 });
      
      // Animate the tab scale
      recipesScale.value = withSequence(
        withTiming(1.2, { duration: 200 }),
        withTiming(1, { duration: 200 })
      );
    } else if (pathname.includes("profile")) {
      setActiveTab("profile");
      indicatorPosition.value = withSpring(300, { damping: 15 });
      indicatorWidth.value = withSpring(80, { damping: 15 });
      
      // Animate the tab scale
      profileScale.value = withSequence(
        withTiming(1.2, { duration: 200 }),
        withTiming(1, { duration: 200 })
      );
    }
  }, [pathname]);
  
  // Get contextual CTA data based on active tab
  const getCtaData = () => {
    switch(activeTab) {
      case "home":
        return { 
          icon: Compass, 
          label: "Explore", 
          color: colors.primary,
          action: () => navigateToSocial()
        };
      case "workouts":
        return { 
          icon: Play, 
          label: "Start", 
          color: colors.success,
          action: () => navigateToWorkoutStart()
        };
      case "recipes":
        return { 
          icon: CookingPot, 
          label: "Cook", 
          color: colors.warning,
          action: () => navigateToRecipeFeatured()
        };
      case "profile":
        return { 
          icon: Share2, 
          label: "Share", 
          color: colors.secondary,
          action: () => navigateToProfileShare()
        };
      default:
        return { 
          icon: Compass, 
          label: "Explore", 
          color: colors.primary,
          action: () => navigateToSocial()
        };
    }
  };
  
  // Safe navigation functions with try/catch
  const navigateToSocial = useCallback(() => {
    try {
      router.push("/social");
    } catch (error) {
      console.error("Navigation error:", error);
    }
  }, []);

  const navigateToWorkoutStart = useCallback(() => {
    try {
      router.push("/workouts/start");
    } catch (error) {
      console.error("Navigation error:", error);
    }
  }, []);

  const navigateToRecipeFeatured = useCallback(() => {
    try {
      router.push("/recipes/featured");
    } catch (error) {
      console.error("Navigation error:", error);
    }
  }, []);

  const navigateToProfileShare = useCallback(() => {
    try {
      router.push("/profile/share");
    } catch (error) {
      console.error("Navigation error:", error);
    }
  }, []);
  
  const ctaData = getCtaData();
  const CtaIcon = ctaData.icon;
  
  // Animated styles for the tab indicator
  const indicatorStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      bottom: 0,
      left: indicatorPosition.value,
      width: indicatorWidth.value,
      height: 3,
      backgroundColor: colors.primary,
      borderRadius: 1.5,
    };
  });
  
  // Animated styles for the CTA button
  const ctaAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: ctaScale.value },
        { rotate: `${ctaRotation.value}deg` }
      ],
    };
  });
  
  // Animated styles for the CTA glow effect
  const ctaGlowStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      top: -8,
      left: -8,
      right: -8,
      bottom: -8,
      borderRadius: 36,
      backgroundColor: ctaData.color,
      opacity: ctaGlow.value * 0.2,
    };
  });
  
  // Animated styles for tab items
  const homeAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: homeScale.value }],
    };
  });
  
  const workoutsAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: workoutsScale.value }],
    };
  });
  
  const recipesAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: recipesScale.value }],
    };
  });
  
  const profileAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: profileScale.value }],
    };
  });
  
  // Handle CTA button press with animation
  const handleCtaPress = () => {
    // Trigger haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // Animate the scale down and up
    ctaScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1.1, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    // Animate a slight rotation for a more dynamic feel
    ctaRotation.value = withSequence(
      withTiming(-5, { duration: 100 }),
      withTiming(5, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );
    
    // Execute the action after the animation completes
    setTimeout(() => {
      if (ctaData.action) {
        ctaData.action();
      }
    }, 200);
  };
  
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.9)' : colors.background,
          borderTopColor: 'transparent',
          elevation: 0,
          shadowOpacity: 0,
          height: 70 + insets.bottom,
          paddingBottom: insets.bottom,
          position: 'absolute',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          borderWidth: Platform.OS === 'ios' ? 0 : 1,
          borderColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabBarInactive,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginTop: 0,
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 6,
        },
        tabBarBackground: Platform.OS === 'ios' ? () => (
          <BlurView 
            tint="light" 
            intensity={80} 
            style={StyleSheet.absoluteFill}
          />
        ) : undefined,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedView style={[styles.tabItemContainer, homeAnimatedStyle]}>
              <View style={focused ? styles.activeIconContainer : null}>
                <Home 
                  size={24} 
                  color={focused ? colors.primary : color} 
                  strokeWidth={focused ? 2.5 : 2} 
                />
              </View>
              <AnimatedText 
                style={[
                  styles.tabLabel, 
                  { 
                    color: focused ? colors.primary : color,
                    fontWeight: focused ? '600' : '400',
                    opacity: focused ? 1 : 0.8,
                    transform: [{ translateY: focused ? -2 : 0 }]
                  }
                ]}
              >
                Home
              </AnimatedText>
            </AnimatedView>
          ),
          tabBarLabel: () => null, // We're using custom labels in the icon component
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: "Workouts",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedView style={[styles.tabItemContainer, workoutsAnimatedStyle]}>
              <View style={focused ? styles.activeIconContainer : null}>
                <Dumbbell 
                  size={24} 
                  color={focused ? colors.primary : color} 
                  strokeWidth={focused ? 2.5 : 2} 
                />
              </View>
              <AnimatedText 
                style={[
                  styles.tabLabel, 
                  { 
                    color: focused ? colors.primary : color,
                    fontWeight: focused ? '600' : '400',
                    opacity: focused ? 1 : 0.8,
                    transform: [{ translateY: focused ? -2 : 0 }]
                  }
                ]}
              >
                Workouts
              </AnimatedText>
            </AnimatedView>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="action-button"
        options={{
          title: "",
          tabBarIcon: () => (
            <AnimatedPressable 
              style={[styles.ctaContainer, ctaAnimatedStyle]}
              onPress={handleCtaPress}
            >
              <AnimatedView style={ctaGlowStyle} />
              <View style={[styles.actionButton, { backgroundColor: ctaData.color }]}>
                <CtaIcon size={24} color="#FFFFFF" strokeWidth={2.5} />
              </View>
              <Text style={[styles.ctaLabel, { color: ctaData.color }]}>{ctaData.label}</Text>
            </AnimatedPressable>
          ),
          tabBarLabel: () => null,
        }}
        listeners={{
          tabPress: (e) => {
            // Prevent default action
            e.preventDefault();
            handleCtaPress();
          },
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: "Recipes",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedView style={[styles.tabItemContainer, recipesAnimatedStyle]}>
              <View style={focused ? styles.activeIconContainer : null}>
                <UtensilsCrossed 
                  size={24} 
                  color={focused ? colors.primary : color} 
                  strokeWidth={focused ? 2.5 : 2} 
                />
              </View>
              <AnimatedText 
                style={[
                  styles.tabLabel, 
                  { 
                    color: focused ? colors.primary : color,
                    fontWeight: focused ? '600' : '400',
                    opacity: focused ? 1 : 0.8,
                    transform: [{ translateY: focused ? -2 : 0 }]
                  }
                ]}
              >
                Recipes
              </AnimatedText>
            </AnimatedView>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedView style={[styles.tabItemContainer, profileAnimatedStyle]}>
              <View style={focused ? styles.activeIconContainer : null}>
                <UserRound 
                  size={24} 
                  color={focused ? colors.primary : color} 
                  strokeWidth={focused ? 2.5 : 2} 
                />
              </View>
              <AnimatedText 
                style={[
                  styles.tabLabel, 
                  { 
                    color: focused ? colors.primary : color,
                    fontWeight: focused ? '600' : '400',
                    opacity: focused ? 1 : 0.8,
                    transform: [{ translateY: focused ? -2 : 0 }]
                  }
                ]}
              >
                Profile
              </AnimatedText>
            </AnimatedView>
          ),
          tabBarLabel: () => null,
        }}
      />
      {/* Hide these screens from the tab bar */}
      <Tabs.Screen
        name="challenges"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="social"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    padding: 8,
    marginRight: 8,
  },
  tabItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
  },
  activeIconContainer: {
    backgroundColor: colors.highlight,
    borderRadius: 12,
    padding: 6,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  ctaContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -15, // Lift the CTA button up slightly
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  ctaLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
});