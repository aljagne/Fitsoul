import { ScrollView, StyleSheet, View, Pressable, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { currentUser, friendUsers } from "@/mocks/user";
import { ProfileHeader } from "@/components/ProfileHeader";
import { ProfileStats } from "@/components/ProfileStats";
import { AchievementsList } from "@/components/AchievementsList";
import { ActivityHistory } from "@/components/ActivityHistory";
import { FriendsList } from "@/components/FriendsList";
import { LinearGradient } from "expo-linear-gradient";
import { Settings, Share2, Edit, Award, Bell } from "lucide-react-native";
import { router, Stack } from "expo-router";
import Animated, { 
  useSharedValue, 
  useAnimatedScrollHandler, 
  useAnimatedStyle, 
  interpolate, 
  Extrapolation,
  withTiming,
  withSequence,
  withDelay
} from "react-native-reanimated";
import { useEffect } from "react";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ProfileScreen() {
  const scrollY = useSharedValue(0);
  
  // Animation values for entrance
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-20);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);
  
  // Entrance animations
  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 600 });
    headerTranslateY.value = withTiming(0, { duration: 600 });
    
    contentOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));
    contentTranslateY.value = withDelay(300, withTiming(0, { duration: 600 }));
  }, []);
  
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 100],
      [0, 1],
      Extrapolation.CLAMP
    );
    
    return {
      opacity,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
    };
  });
  
  const profileHeaderStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
      transform: [{ translateY: headerTranslateY.value }],
    };
  });
  
  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
      transform: [{ translateY: contentTranslateY.value }],
    };
  });
  
  const profileImageAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [0, 100],
      [1, 0.8],
      Extrapolation.CLAMP
    );
    
    const translateY = interpolate(
      scrollY.value,
      [0, 100],
      [0, -10],
      Extrapolation.CLAMP
    );
    
    return {
      transform: [
        { scale },
        { translateY }
      ]
    };
  });
  
  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      <SafeAreaView style={styles.container} edges={["top"]}>
        {/* Animated header that appears on scroll */}
        <Animated.View style={[styles.animatedHeader, headerAnimatedStyle]}>
          <LinearGradient
            colors={[colors.background, colors.background + 'F0']}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>{currentUser.name}</Text>
              <Pressable 
                style={styles.headerButton} 
                onPress={() => {
                  try {
                    setTimeout(() => {
                      router.push("/settings");
                    }, 50);
                  } catch (error) {
                    console.error("Navigation error:", error);
                  }
                }}
              >
                <Settings size={22} color={colors.text} />
              </Pressable>
            </View>
          </LinearGradient>
        </Animated.View>
        
        <AnimatedScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
          <Animated.View style={[styles.profileHeaderContainer, profileHeaderStyle]}>
            <Animated.View style={profileImageAnimatedStyle}>
              <Image source={{ uri: currentUser.avatarUrl }} style={styles.profileImage} />
            </Animated.View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{currentUser.name}</Text>
              <Text style={styles.profileBio}>{currentUser.bio || "Fitness enthusiast"}</Text>
              
              <View style={styles.profileActions}>
                <AnimatedPressable 
                  style={styles.actionButton} 
                  onPress={() => {
                    try {
                      setTimeout(() => {
                        router.push("/profile/edit");
                      }, 50);
                    } catch (error) {
                      console.error("Navigation error:", error);
                    }
                  }}
                >
                  <Edit size={16} color={colors.text} />
                  <Text style={styles.actionButtonText}>Edit</Text>
                </AnimatedPressable>
                
                <AnimatedPressable 
                  style={styles.actionButton} 
                  onPress={() => {
                    try {
                      setTimeout(() => {
                        router.push("/profile/share");
                      }, 50);
                    } catch (error) {
                      console.error("Navigation error:", error);
                    }
                  }}
                >
                  <Share2 size={16} color={colors.text} />
                  <Text style={styles.actionButtonText}>Share</Text>
                </AnimatedPressable>
                
                <AnimatedPressable 
                  style={styles.actionButton} 
                  onPress={() => {
                    try {
                      setTimeout(() => {
                        router.push("/settings");
                      }, 50);
                    } catch (error) {
                      console.error("Navigation error:", error);
                    }
                  }}
                >
                  <Settings size={16} color={colors.text} />
                  <Text style={styles.actionButtonText}>Settings</Text>
                </AnimatedPressable>
              </View>
            </View>
          </Animated.View>
          
          <Animated.View style={[styles.content, contentAnimatedStyle]}>
            <ProfileStats stats={currentUser.weeklyStats} />
            
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Award size={20} color={colors.primary} />
                <Text style={styles.sectionTitle}>Achievements</Text>
              </View>
              <Pressable 
                onPress={() => {
                  try {
                    setTimeout(() => {
                      router.push("/profile/achievements");
                    }, 50);
                  } catch (error) {
                    console.error("Navigation error:", error);
                  }
                }}
              >
                <Text style={styles.seeAllText}>See All</Text>
              </Pressable>
            </View>
            <AchievementsList achievements={currentUser.achievements} />
            
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Bell size={20} color={colors.primary} />
                <Text style={styles.sectionTitle}>Recent Activity</Text>
              </View>
              <Pressable 
                onPress={() => {
                  try {
                    setTimeout(() => {
                      router.push("/profile/activity");
                    }, 50);
                  } catch (error) {
                    console.error("Navigation error:", error);
                  }
                }}
              >
                <Text style={styles.seeAllText}>See All</Text>
              </Pressable>
            </View>
            <ActivityHistory workouts={currentUser.workoutHistory.slice(0, 3)} />
            
            <FriendsList friends={friendUsers} />
          </Animated.View>
          
          {/* Extra padding at the bottom to account for the tab bar */}
          <View style={styles.bottomPadding} />
        </AnimatedScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  animatedHeader: {
    height: 60,
    width: '100%',
  },
  headerGradient: {
    height: '100%',
    paddingHorizontal: 16,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerButton: {
    padding: 8,
  },
  scrollContent: {
    paddingBottom: 100, // Extra padding for the tab bar
  },
  profileHeaderContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  profileBio: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 12,
  },
  profileActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  content: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 80,
  },
});