import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { colors } from '@/constants/colors';
import { 
  MapPin, 
  MessageSquare, 
  Heart, 
  Award, 
  Calendar, 
  Clock, 
  Dumbbell, 
  UtensilsCrossed,
  Users,
  ChevronRight,
  Share2,
  MoreHorizontal,
  Flame
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/Card';
import { BackButton } from '@/components/BackButton';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
  useAnimatedScrollHandler
} from 'react-native-reanimated';

// Mock data for profiles
const profiles = {
  '1': {
    id: '1',
    name: 'Sarah Johnson',
    age: 28,
    location: 'New York, NY',
    distance: '2.3 miles away',
    bio: 'Yoga instructor and marathon runner. Looking for running partners and people to join my morning yoga sessions. I believe fitness should be fun and accessible to everyone!',
    interests: ['Running', 'Yoga', 'Hiking', 'Meditation', 'Nutrition'],
    fitnessLevel: 'Advanced',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    coverUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600',
    stats: {
      workouts: 128,
      following: 245,
      followers: 312,
    },
    achievements: [
      { id: '1', title: 'Marathon Finisher', icon: '🏃‍♀️' },
      { id: '2', title: 'Yoga Master', icon: '🧘‍♀️' },
      { id: '3', title: '30-Day Challenge', icon: '🔥' },
    ],
    recentActivities: [
      { id: '1', type: 'workout', title: 'Morning Run', date: '2023-06-10T07:30:00', duration: '45 min', distance: '5.2 km' },
      { id: '2', type: 'workout', title: 'Yoga Session', date: '2023-06-09T18:00:00', duration: '60 min' },
      { id: '3', type: 'nutrition', title: 'Protein Smoothie', date: '2023-06-09T09:00:00', calories: 320 },
    ],
    compatibility: 92,
  },
  '2': {
    id: '2',
    name: 'Michael Chen',
    age: 32,
    location: 'Brooklyn, NY',
    distance: '3.5 miles away',
    bio: 'Crossfit enthusiast and nutrition coach. Can help with meal plans and workout routines. Always looking to connect with like-minded fitness enthusiasts!',
    interests: ['Crossfit', 'Weightlifting', 'Nutrition', 'Meal Prep', 'HIIT'],
    fitnessLevel: 'Expert',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    coverUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600',
    stats: {
      workouts: 215,
      following: 178,
      followers: 423,
    },
    achievements: [
      { id: '1', title: 'Crossfit Champion', icon: '🏆' },
      { id: '2', title: 'Nutrition Expert', icon: '🥗' },
      { id: '3', title: '100-Day Streak', icon: '📅' },
    ],
    recentActivities: [
      { id: '1', type: 'workout', title: 'Crossfit WOD', date: '2023-06-10T06:00:00', duration: '60 min' },
      { id: '2', type: 'workout', title: 'Strength Training', date: '2023-06-09T17:30:00', duration: '75 min' },
      { id: '3', type: 'nutrition', title: 'Protein-Rich Lunch', date: '2023-06-09T13:00:00', calories: 650 },
    ],
    compatibility: 85,
  },
};

export default function ProfileScreen() {
  const { id } = useLocalSearchParams();
  const profile = profiles[id as keyof typeof profiles];
  
  const [isFollowing, setIsFollowing] = useState(false);
  
  const scrollY = useSharedValue(0);
  const fadeAnim = useSharedValue(0);
  
  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 500 });
  }, []);
  
  const headerOpacity = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [0, 100, 150],
        [0, 0.5, 1],
        Extrapolate.CLAMP
      )
    };
  });
  
  const imageScale = useAnimatedStyle(() => {
    return {
      transform: [
        { 
          scale: interpolate(
            scrollY.value,
            [-100, 0, 100],
            [1.2, 1, 1],
            Extrapolate.CLAMP
          ) 
        }
      ]
    };
  });
  
  const contentFade = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value
    };
  });
  
  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };
  
  const handleMessage = () => {
    router.push(`/messages/${profile.id}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: () => (
            <Animated.View style={headerOpacity}>
              <Text style={styles.headerTitle}>{profile.name}</Text>
            </Animated.View>
          ),
          headerLeft: () => <BackButton color="white" />,
          headerRight: () => (
            <View style={styles.headerActions}>
              <Pressable style={styles.headerButton}>
                <Share2 size={24} color="white" />
              </Pressable>
              <Pressable style={styles.headerButton}>
                <MoreHorizontal size={24} color="white" />
              </Pressable>
            </View>
          ),
        }}
      />
      
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={useAnimatedScrollHandler((event) => {
          scrollY.value = event.contentOffset.y;
        })}
        scrollEventThrottle={16}
      >
        <Animated.View style={[styles.coverContainer, imageScale]}>
          <Image source={{ uri: profile.coverUrl }} style={styles.coverImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.coverGradient}
          />
        </Animated.View>
        
        <View style={styles.profileContent}>
          <Animated.View style={[styles.profileHeader, contentFade]}>
            <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
            
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profile.name}, {profile.age}</Text>
              <View style={styles.locationRow}>
                <MapPin size={16} color={colors.textLight} />
                <Text style={styles.locationText}>{profile.distance}</Text>
              </View>
              
              <View style={styles.compatibilityBadge}>
                <Text style={styles.compatibilityText}>{profile.compatibility}% Match</Text>
              </View>
            </View>
            
            <View style={styles.actionButtons}>
              <Pressable 
                style={[
                  styles.actionButton,
                  styles.messageButton
                ]}
                onPress={handleMessage}
              >
                <MessageSquare size={20} color={colors.primary} />
              </Pressable>
              <Pressable 
                style={[
                  styles.actionButton,
                  isFollowing ? styles.followingButton : styles.followButton
                ]}
                onPress={handleFollow}
              >
                <Heart size={20} color={isFollowing ? 'white' : colors.primary} />
              </Pressable>
            </View>
          </Animated.View>
          
          <Animated.View style={[styles.statsContainer, contentFade]}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile.stats.workouts}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile.stats.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile.stats.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
          </Animated.View>
          
          <Animated.View style={[styles.bioContainer, contentFade]}>
            <Text style={styles.bioText}>{profile.bio}</Text>
          </Animated.View>
          
          <Animated.View style={[styles.interestsContainer, contentFade]}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.interestTags}>
              {profile.interests.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
          
          <Animated.View style={[styles.achievementsContainer, contentFade]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Achievements</Text>
              <Pressable style={styles.seeAllButton}>
                <Text style={styles.seeAllText}>See All</Text>
                <ChevronRight size={16} color={colors.primary} />
              </Pressable>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.achievementsScroll}
            >
              {profile.achievements.map((achievement) => (
                <View key={achievement.id} style={styles.achievementCard}>
                  <View style={styles.achievementIcon}>
                    <Text style={styles.achievementIconText}>{achievement.icon}</Text>
                  </View>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                </View>
              ))}
            </ScrollView>
          </Animated.View>
          
          <Animated.View style={[styles.activitiesContainer, contentFade]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <Pressable style={styles.seeAllButton}>
                <Text style={styles.seeAllText}>See All</Text>
                <ChevronRight size={16} color={colors.primary} />
              </Pressable>
            </View>
            
            <Card style={styles.activitiesCard}>
              {profile.recentActivities.map((activity, index) => (
                <View 
                  key={activity.id}
                  style={[
                    styles.activityItem,
                    index < profile.recentActivities.length - 1 && styles.activityItemBorder
                  ]}
                >
                  <View 
                    style={[
                      styles.activityIcon,
                      activity.type === 'workout' ? styles.workoutIcon : styles.nutritionIcon
                    ]}
                  >
                    {activity.type === 'workout' ? (
                      <Dumbbell size={20} color={colors.primary} />
                    ) : (
                      <UtensilsCrossed size={20} color={colors.secondary} />
                    )}
                  </View>
                  
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <View style={styles.activityDetails}>
                      <View style={styles.activityDetail}>
                        <Calendar size={14} color={colors.textLight} />
                        <Text style={styles.activityDetailText}>
                          {new Date(activity.date).toLocaleDateString()}
                        </Text>
                      </View>
                      
                      {activity.duration && (
                        <View style={styles.activityDetail}>
                          <Clock size={14} color={colors.textLight} />
                          <Text style={styles.activityDetailText}>{activity.duration}</Text>
                        </View>
                      )}
                      
                      {activity.type === 'workout' && 'distance' in activity && activity.distance && (
                        <View style={styles.activityDetail}>
                          <MapPin size={14} color={colors.textLight} />
                          <Text style={styles.activityDetailText}>{activity.distance}</Text>
                        </View>
                      )}
                      
                      {activity.type === 'nutrition' && 'calories' in activity && activity.calories && (
                        <View style={styles.activityDetail}>
                          <Flame size={14} color={colors.textLight} />
                          <Text style={styles.activityDetailText}>{activity.calories} cal</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </Card>
          </Animated.View>
          
          <Animated.View style={[styles.friendsContainer, contentFade]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mutual Friends</Text>
              <Pressable style={styles.seeAllButton}>
                <Text style={styles.seeAllText}>See All</Text>
                <ChevronRight size={16} color={colors.primary} />
              </Pressable>
            </View>
            
            <Card style={styles.friendsCard}>
              <View style={styles.friendsContent}>
                <View style={styles.friendAvatars}>
                  <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200' }} 
                    style={styles.friendAvatar} 
                  />
                  <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200' }} 
                    style={[styles.friendAvatar, styles.friendAvatarOverlap]} 
                  />
                  <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200' }} 
                    style={[styles.friendAvatar, styles.friendAvatarOverlap]} 
                  />
                  <View style={[styles.friendAvatar, styles.friendAvatarOverlap, styles.friendAvatarMore]}>
                    <Text style={styles.friendAvatarMoreText}>+2</Text>
                  </View>
                </View>
                <Text style={styles.friendsText}>You have 5 mutual friends</Text>
              </View>
              <Pressable style={styles.viewFriendsButton}>
                <Text style={styles.viewFriendsText}>View Friends</Text>
                <Users size={16} color={colors.primary} />
              </Pressable>
            </Card>
          </Animated.View>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    padding: 4,
  },
  coverContainer: {
    height: 250,
    width: '100%',
  },
  coverImage: {
    height: '100%',
    width: '100%',
  },
  coverGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  profileContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    marginTop: -50,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: colors.background,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: colors.textLight,
  },
  compatibilityBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  compatibilityText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  messageButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  followButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  followingButton: {
    backgroundColor: colors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: colors.border,
    alignSelf: 'center',
  },
  bioContainer: {
    marginBottom: 24,
  },
  bioText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  interestsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  interestTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  interestText: {
    color: colors.primary,
    fontWeight: '500',
    fontSize: 14,
  },
  achievementsContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  achievementsScroll: {
    paddingBottom: 8,
  },
  achievementCard: {
    width: 100,
    alignItems: 'center',
    marginRight: 16,
  },
  achievementIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementIconText: {
    fontSize: 24,
  },
  achievementTitle: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    textAlign: 'center',
  },
  activitiesContainer: {
    marginBottom: 24,
  },
  activitiesCard: {
    padding: 0,
  },
  activityItem: {
    flexDirection: 'row',
    padding: 16,
  },
  activityItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  workoutIcon: {
    backgroundColor: colors.primary + '15',
  },
  nutritionIcon: {
    backgroundColor: colors.secondary + '15',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  activityDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  activityDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activityDetailText: {
    fontSize: 14,
    color: colors.textLight,
  },
  friendsContainer: {
    marginBottom: 24,
  },
  friendsCard: {
    padding: 16,
  },
  friendsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  friendAvatars: {
    flexDirection: 'row',
    marginRight: 12,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.background,
  },
  friendAvatarOverlap: {
    marginLeft: -16,
  },
  friendAvatarMore: {
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendAvatarMoreText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
  },
  friendsText: {
    fontSize: 14,
    color: colors.text,
  },
  viewFriendsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: colors.primary + '15',
    borderRadius: 12,
    gap: 8,
  },
  viewFriendsText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});