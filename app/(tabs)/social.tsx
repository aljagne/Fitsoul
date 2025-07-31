import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  Image, 
  Dimensions,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  MapPin, 
  Heart, 
  X, 
  Search,
  Dumbbell,
  Trophy,
  ArrowRight
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/Card';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay
} from 'react-native-reanimated';

// Mock data for social features
const featuredPartners = [
  {
    id: '1',
    name: 'Sarah Johnson',
    age: 28,
    location: 'New York, NY',
    distance: '2.3 miles away',
    bio: 'Yoga instructor and marathon runner. Looking for running partners!',
    interests: ['Running', 'Yoga', 'Hiking'],
    fitnessLevel: 'Advanced',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    compatibility: 92,
  },
  {
    id: '2',
    name: 'Michael Chen',
    age: 32,
    location: 'Brooklyn, NY',
    distance: '3.5 miles away',
    bio: 'Crossfit enthusiast and nutrition coach. Can help with meal plans!',
    interests: ['Crossfit', 'Weightlifting', 'Nutrition'],
    fitnessLevel: 'Expert',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    compatibility: 85,
  },
  {
    id: '3',
    name: 'Emma Wilson',
    age: 26,
    location: 'Queens, NY',
    distance: '5.1 miles away',
    bio: 'New to fitness and looking for a gym buddy to stay motivated!',
    interests: ['Gym', 'Swimming', 'Cycling'],
    fitnessLevel: 'Beginner',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    compatibility: 78,
  },
];

const upcomingEvents = [
  {
    id: '1',
    title: 'Central Park Run Club',
    date: '2023-06-15T08:00:00',
    location: 'Central Park, NY',
    participants: 24,
    imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400',
  },
  {
    id: '2',
    title: 'Yoga in the Park',
    date: '2023-06-18T09:30:00',
    location: 'Bryant Park, NY',
    participants: 18,
    imageUrl: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400',
  },
  {
    id: '3',
    title: 'HIIT Workout Session',
    date: '2023-06-20T18:00:00',
    location: 'Fitness First Gym, NY',
    participants: 12,
    imageUrl: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400',
  },
];

const recentMessages = [
  {
    id: '1',
    name: 'Sarah Johnson',
    message: 'Are we still meeting for our run tomorrow?',
    time: '10:30 AM',
    unread: true,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  },
  {
    id: '2',
    name: 'Michael Chen',
    message: 'I sent you the workout plan for this week',
    time: 'Yesterday',
    unread: false,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  },
  {
    id: '3',
    name: 'Emma Wilson',
    message: 'Thanks for the tips! My form is much better now',
    time: 'Monday',
    unread: false,
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
  },
];

const { width } = Dimensions.get('window');

export default function SocialScreen() {
  // Add header configuration
  useEffect(() => {
    // This ensures the screen has proper navigation setup
  }, []);
  
  const [currentPartnerIndex, setCurrentPartnerIndex] = useState(0);
  const swipeAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(0.95);
  const fadeAnim = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);
  
  // Entrance animation
  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 500 });
    scaleAnim.value = withTiming(1, { duration: 500 });
    contentOpacity.value = withTiming(1, { duration: 600 });
    contentTranslateY.value = withTiming(0, { duration: 600 });
  }, []);
  
  const handleSwipe = (direction: 'left' | 'right') => {
    // Animate the card off screen
    swipeAnim.value = withTiming(direction === 'right' ? width : -width, { duration: 300 });
    
    // Reset animation and update index after animation completes
    setTimeout(() => {
      swipeAnim.value = 0;
      setCurrentPartnerIndex((prev) => 
        prev < featuredPartners.length - 1 ? prev + 1 : 0
      );
    }, 300);
    
    // If swiping right, show a match animation or notification
    if (direction === 'right') {
      // In a real app, this would send a connection request
      console.log(`Liked ${featuredPartners[currentPartnerIndex].name}`);
    }
  };
  
  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: swipeAnim.value },
        { scale: scaleAnim.value }
      ],
      opacity: fadeAnim.value,
    };
  });
  
  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
      transform: [{ translateY: contentTranslateY.value }],
    };
  });
  
  const renderPartnerCard = () => {
    const partner = featuredPartners[currentPartnerIndex];
    
    return (
      <Animated.View style={[styles.partnerCard, cardAnimatedStyle]}>
        <Image source={{ uri: partner.avatarUrl }} style={styles.partnerImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.partnerGradient}
        >
          <View style={styles.partnerInfo}>
            <View style={styles.partnerNameRow}>
              <Text style={styles.partnerName}>{partner.name}, {partner.age}</Text>
              <View style={styles.compatibilityBadge}>
                <Text style={styles.compatibilityText}>{partner.compatibility}%</Text>
              </View>
            </View>
            <View style={styles.partnerLocationRow}>
              <MapPin size={16} color="white" />
              <Text style={styles.partnerLocation}>{partner.distance}</Text>
            </View>
            <Text style={styles.partnerBio}>{partner.bio}</Text>
            <View style={styles.partnerInterests}>
              {partner.interests.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>
        </LinearGradient>
        
        <View style={styles.swipeActions}>
          <Pressable 
            style={[styles.swipeButton, styles.swipeButtonDislike]}
            onPress={() => handleSwipe('left')}
          >
            <X size={24} color="white" />
          </Pressable>
          <Pressable 
            style={[styles.swipeButton, styles.swipeButtonLike]}
            onPress={() => handleSwipe('right')}
          >
            <Heart size={24} color="white" />
          </Pressable>
        </View>
      </Animated.View>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" />
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Social</Text>
          <View style={styles.headerActions}>
            <Pressable 
              style={styles.headerButton}
              onPress={() => {
                try {
                  setTimeout(() => {
                    router.push('/search');
                  }, 50);
                } catch (error) {
                  console.error("Navigation error:", error);
                }
              }}
            >
              <Search size={24} color={colors.text} />
            </Pressable>
            <Pressable 
              style={styles.headerButton}
              onPress={() => {
                try {
                  setTimeout(() => {
                    router.push('/messages');
                  }, 50);
                } catch (error) {
                  console.error("Navigation error:", error);
                }
              }}
            >
              <MessageSquare size={24} color={colors.text} />
              {recentMessages.some(m => m.unread) && (
                <View style={styles.notificationBadge} />
              )}
            </Pressable>
          </View>
        </View>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          <Animated.View style={contentAnimatedStyle}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <Users size={20} color={colors.primary} />
                  <Text style={styles.sectionTitle}>Featured Partners</Text>
                </View>
                <Pressable 
                  style={styles.seeAllButton}
                  onPress={() => {
                    try {
                      setTimeout(() => {
                        router.push('/social/index');
                      }, 50);
                    } catch (error) {
                      console.error("Navigation error:", error);
                    }
                  }}
                >
                  <Text style={styles.seeAllText}>See All</Text>
                  <ArrowRight size={16} color={colors.primary} />
                </Pressable>
              </View>
              
              {renderPartnerCard()}
            </View>
            
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <Calendar size={20} color={colors.primary} />
                  <Text style={styles.sectionTitle}>Upcoming Events</Text>
                </View>
                <Pressable 
                  style={styles.seeAllButton}
                  onPress={() => {
                    try {
                      setTimeout(() => {
                        router.push('/events');
                      }, 50);
                    } catch (error) {
                      console.error("Navigation error:", error);
                    }
                  }}
                >
                  <Text style={styles.seeAllText}>See All</Text>
                  <ArrowRight size={16} color={colors.primary} />
                </Pressable>
              </View>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.eventsContainer}
              >
                {upcomingEvents.map((event, index) => (
                  <Animated.View
                    key={event.id}
                    style={[
                      styles.eventCard,
                      {
                        opacity: fadeAnim,
                        transform: [{ 
                          translateY: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0]
                          }) 
                        }]
                      }
                    ]}
                  >
                    <Image source={{ uri: event.imageUrl }} style={styles.eventImage} />
                    <View style={styles.eventContent}>
                      <Text style={styles.eventTitle}>{event.title}</Text>
                      <View style={styles.eventDetail}>
                        <Calendar size={14} color={colors.textLight} />
                        <Text style={styles.eventDetailText}>
                          {new Date(event.date).toLocaleDateString(undefined, { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Text>
                      </View>
                      <View style={styles.eventDetail}>
                        <MapPin size={14} color={colors.textLight} />
                        <Text style={styles.eventDetailText}>{event.location}</Text>
                      </View>
                      <View style={styles.eventDetail}>
                        <Users size={14} color={colors.textLight} />
                        <Text style={styles.eventDetailText}>{event.participants} participants</Text>
                      </View>
                    </View>
                  </Animated.View>
                ))}
              </ScrollView>
            </View>
            
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <MessageSquare size={20} color={colors.primary} />
                  <Text style={styles.sectionTitle}>Recent Messages</Text>
                </View>
                <Pressable 
                  style={styles.seeAllButton}
                  onPress={() => {
                    try {
                      setTimeout(() => {
                        router.push('/messages');
                      }, 50);
                    } catch (error) {
                      console.error("Navigation error:", error);
                    }
                  }}
                >
                  <Text style={styles.seeAllText}>See All</Text>
                  <ArrowRight size={16} color={colors.primary} />
                </Pressable>
              </View>
              
              <Card style={styles.messagesCard}>
                {recentMessages.map((message, index) => (
                  <Animated.View
                    key={message.id}
                    style={[
                      styles.messageItem,
                      index < recentMessages.length - 1 && styles.messageItemBorder,
                      {
                        opacity: fadeAnim,
                        transform: [{ 
                          translateX: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0]
                          }) 
                        }]
                      }
                    ]}
                  >
                    <Pressable 
                      style={styles.messageContent}
                      onPress={() => {
                        try {
                          setTimeout(() => {
                            router.push(`/messages/${message.id}`);
                          }, 50);
                        } catch (error) {
                          console.error("Navigation error:", error);
                        }
                      }}
                    >
                      <Image source={{ uri: message.avatarUrl }} style={styles.messageAvatar} />
                      <View style={styles.messageTextContainer}>
                        <View style={styles.messageNameRow}>
                          <Text style={styles.messageName}>{message.name}</Text>
                          <Text style={styles.messageTime}>{message.time}</Text>
                        </View>
                        <Text 
                          style={[
                            styles.messageText,
                            message.unread && styles.messageUnread
                          ]}
                          numberOfLines={1}
                        >
                          {message.message}
                        </Text>
                      </View>
                      {message.unread && <View style={styles.unreadIndicator} />}
                    </Pressable>
                  </Animated.View>
                ))}
              </Card>
            </View>
            
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <Trophy size={20} color={colors.primary} />
                  <Text style={styles.sectionTitle}>Group Challenges</Text>
                </View>
                <Pressable 
                  style={styles.seeAllButton}
                  onPress={() => {
                    try {
                      setTimeout(() => {
                        router.push('/challenges');
                      }, 50);
                    } catch (error) {
                      console.error("Navigation error:", error);
                    }
                  }}
                >
                  <Text style={styles.seeAllText}>See All</Text>
                  <ArrowRight size={16} color={colors.primary} />
                </Pressable>
              </View>
              
              <Card style={styles.challengeCard}>
                <View style={styles.challengeHeader}>
                  <View style={styles.challengeIconContainer}>
                    <Dumbbell size={24} color={colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.challengeTitle}>Summer Fitness Challenge</Text>
                    <Text style={styles.challengeSubtitle}>Join 128 others in this 30-day challenge</Text>
                  </View>
                </View>
                <View style={styles.challengeStats}>
                  <View style={styles.challengeStat}>
                    <Text style={styles.challengeStatValue}>30</Text>
                    <Text style={styles.challengeStatLabel}>Days</Text>
                  </View>
                  <View style={styles.challengeStat}>
                    <Text style={styles.challengeStatValue}>128</Text>
                    <Text style={styles.challengeStatLabel}>Participants</Text>
                  </View>
                  <View style={styles.challengeStat}>
                    <Text style={styles.challengeStatValue}>5</Text>
                    <Text style={styles.challengeStatLabel}>Friends</Text>
                  </View>
                </View>
                <Pressable 
                  style={styles.challengeButton}
                  onPress={() => {
                    try {
                      setTimeout(() => {
                        router.push('/challenges/join');
                      }, 50);
                    } catch (error) {
                      console.error("Navigation error:", error);
                    }
                  }}
                >
                  <Text style={styles.challengeButtonText}>Join Challenge</Text>
                </Pressable>
              </Card>
            </View>
            
            {/* Extra padding at the bottom to account for the tab bar */}
            <View style={styles.bottomPadding} />
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.background,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
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
  partnerCard: {
    height: 480,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.card,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  partnerImage: {
    width: '100%',
    height: '100%',
  },
  partnerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 16,
  },
  partnerInfo: {
    gap: 8,
  },
  partnerNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  partnerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  compatibilityBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  compatibilityText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  partnerLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  partnerLocation: {
    fontSize: 14,
    color: 'white',
  },
  partnerBio: {
    fontSize: 14,
    color: 'white',
    marginTop: 4,
  },
  partnerInterests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  interestTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  interestText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  swipeActions: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  swipeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  swipeButtonDislike: {
    backgroundColor: colors.error,
  },
  swipeButtonLike: {
    backgroundColor: colors.success,
  },
  eventsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  eventCard: {
    width: 280,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.card,
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventImage: {
    width: '100%',
    height: 140,
  },
  eventContent: {
    padding: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  eventDetailText: {
    fontSize: 14,
    color: colors.textLight,
  },
  messagesCard: {
    marginHorizontal: 16,
  },
  messageItem: {
    paddingVertical: 12,
  },
  messageItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  messageContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  messageTextContainer: {
    flex: 1,
  },
  messageNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  messageTime: {
    fontSize: 12,
    color: colors.textLight,
  },
  messageText: {
    fontSize: 14,
    color: colors.textLight,
  },
  messageUnread: {
    color: colors.text,
    fontWeight: '500',
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
  challengeCard: {
    marginHorizontal: 16,
    padding: 16,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  challengeIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  challengeSubtitle: {
    fontSize: 14,
    color: colors.textLight,
  },
  challengeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  challengeStat: {
    alignItems: 'center',
  },
  challengeStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  challengeStatLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  challengeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  challengeButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  bottomPadding: {
    height: 100,
  },
});