import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Pressable, 
  Image, 
  Dimensions,
  TextInput,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { 
  MapPin, 
  Heart, 
  X, 
  Search,
  Filter,
  Dumbbell,
  ArrowRight,
  ChevronDown,
  Check,
  ArrowLeft,
  Users,
  Compass
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/Card';
import { BackButton } from '@/components/BackButton';
import { SocialMatchList } from '@/components/SocialMatch';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  withSequence,
  withDelay
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Platform } from 'react-native';
import { User } from '@/types/user';

// Mock data for partners
const allPartners = [
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
    workoutHistory: [
      { id: '1', workoutName: 'Morning Run', date: new Date().toISOString(), duration: 45, caloriesBurned: 320 },
      { id: '2', workoutName: 'Yoga Session', date: new Date(Date.now() - 86400000).toISOString(), duration: 60, caloriesBurned: 250 }
    ],
    challengesCompleted: 8,
    friends: ['2', '3', '5'],
    fitnessGoals: ['weight_loss', 'endurance', 'flexibility']
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
    workoutHistory: [
      { id: '1', workoutName: 'Crossfit WOD', date: new Date().toISOString(), duration: 60, caloriesBurned: 550 },
      { id: '2', workoutName: 'Strength Training', date: new Date(Date.now() - 172800000).toISOString(), duration: 75, caloriesBurned: 420 }
    ],
    challengesCompleted: 12,
    friends: ['4', '6'],
    fitnessGoals: ['muscle_gain', 'strength', 'nutrition']
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
    workoutHistory: [
      { id: '1', workoutName: 'Beginner Cardio', date: new Date(Date.now() - 86400000).toISOString(), duration: 30, caloriesBurned: 180 }
    ],
    challengesCompleted: 2,
    friends: ['1'],
    fitnessGoals: ['weight_loss', 'general_fitness']
  },
  {
    id: '4',
    name: 'David Kim',
    age: 30,
    location: 'Manhattan, NY',
    distance: '1.8 miles away',
    bio: 'Personal trainer specializing in strength training. Looking for workout partners!',
    interests: ['Weightlifting', 'Nutrition', 'Boxing'],
    fitnessLevel: 'Expert',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    compatibility: 88,
    workoutHistory: [
      { id: '1', workoutName: 'Heavy Lifting', date: new Date().toISOString(), duration: 90, caloriesBurned: 480 },
      { id: '2', workoutName: 'Boxing Session', date: new Date(Date.now() - 86400000).toISOString(), duration: 60, caloriesBurned: 550 }
    ],
    challengesCompleted: 15,
    friends: ['2', '6'],
    fitnessGoals: ['muscle_gain', 'strength', 'endurance']
  },
  {
    id: '5',
    name: 'Jessica Martinez',
    age: 27,
    location: 'Bronx, NY',
    distance: '6.2 miles away',
    bio: 'Dance instructor and fitness enthusiast. Love trying new workout classes!',
    interests: ['Dance', 'Pilates', 'HIIT'],
    fitnessLevel: 'Intermediate',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    compatibility: 82,
    workoutHistory: [
      { id: '1', workoutName: 'Dance Cardio', date: new Date(Date.now() - 172800000).toISOString(), duration: 45, caloriesBurned: 380 },
      { id: '2', workoutName: 'Pilates Class', date: new Date(Date.now() - 259200000).toISOString(), duration: 60, caloriesBurned: 280 }
    ],
    challengesCompleted: 7,
    friends: ['1', '3'],
    fitnessGoals: ['flexibility', 'endurance', 'general_fitness']
  },
  {
    id: '6',
    name: 'Alex Thompson',
    age: 31,
    location: 'Jersey City, NJ',
    distance: '7.5 miles away',
    bio: 'Former college athlete. Looking for tennis partners and running buddies.',
    interests: ['Tennis', 'Running', 'Basketball'],
    fitnessLevel: 'Advanced',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
    compatibility: 75,
    workoutHistory: [
      { id: '1', workoutName: 'Tennis Match', date: new Date(Date.now() - 86400000).toISOString(), duration: 90, caloriesBurned: 650 },
      { id: '2', workoutName: 'Long Run', date: new Date(Date.now() - 259200000).toISOString(), duration: 60, caloriesBurned: 520 }
    ],
    challengesCompleted: 9,
    friends: ['2', '4'],
    fitnessGoals: ['endurance', 'agility', 'general_fitness']
  },
];

const { width } = Dimensions.get('window');

// Tab data for the social screen
const tabs = [
  { id: 'discover', label: 'Discover', icon: Compass },
  { id: 'matches', label: 'Matches', icon: Heart },
  { id: 'partners', label: 'Partners', icon: Users },
];

export default function SocialScreen() {
  // Add header configuration
  useEffect(() => {
    // This ensures the screen has proper navigation setup
  }, []);

  const [activeTab, setActiveTab] = useState('discover');
  const [partners, setPartners] = useState(allPartners);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    fitnessLevel: [] as string[],
    distance: 'any',
    interests: [] as string[],
  });
  
  // Animation values
  const filterHeight = useSharedValue(0);
  const searchBarWidth = useSharedValue(width - 32);
  const searchBarY = useSharedValue(0);
  const tabIndicatorPosition = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);
  
  // Entrance animation
  useEffect(() => {
    contentOpacity.value = withTiming(1, { duration: 600 });
    contentTranslateY.value = withTiming(0, { duration: 600 });
  }, []);
  
  // Update tab indicator position
  useEffect(() => {
    const position = tabs.findIndex(tab => tab.id === activeTab) * (width / 3);
    tabIndicatorPosition.value = withSpring(position, { damping: 15 });
  }, [activeTab]);
  
  // Animated styles
  const filterAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: filterHeight.value,
      opacity: filterHeight.value > 0 ? 1 : 0,
      overflow: 'hidden',
    };
  });
  
  const searchBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: searchBarWidth.value,
      transform: [{ translateY: searchBarY.value }],
    };
  });
  
  const tabIndicatorStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      bottom: 0,
      left: tabIndicatorPosition.value,
      width: width / 3,
      height: 3,
      backgroundColor: colors.primary,
      borderRadius: 1.5,
    };
  });
  
  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
      transform: [{ translateY: contentTranslateY.value }],
    };
  });
  
  const toggleFilter = () => {
    if (showFilters) {
      filterHeight.value = withTiming(0, { duration: 300 });
      setTimeout(() => setShowFilters(false), 300);
    } else {
      setShowFilters(true);
      filterHeight.value = withTiming(320, { duration: 300 });
    }
  };
  
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    if (text.trim() === '') {
      setPartners(allPartners);
      return;
    }
    
    const filtered = allPartners.filter(partner => 
      partner.name.toLowerCase().includes(text.toLowerCase()) ||
      partner.interests.some(interest => 
        interest.toLowerCase().includes(text.toLowerCase())
      ) ||
      partner.location.toLowerCase().includes(text.toLowerCase())
    );
    
    setPartners(filtered);
  };
  
  const toggleFitnessLevel = (level: string) => {
    setSelectedFilters(prev => {
      const levels = [...prev.fitnessLevel];
      const index = levels.indexOf(level);
      
      if (index === -1) {
        levels.push(level);
      } else {
        levels.splice(index, 1);
      }
      
      return { ...prev, fitnessLevel: levels };
    });
  };
  
  const toggleInterest = (interest: string) => {
    setSelectedFilters(prev => {
      const interests = [...prev.interests];
      const index = interests.indexOf(interest);
      
      if (index === -1) {
        interests.push(interest);
      } else {
        interests.splice(index, 1);
      }
      
      return { ...prev, interests };
    });
  };
  
  const setDistance = (distance: string) => {
    setSelectedFilters(prev => ({ ...prev, distance }));
  };
  
  const applyFilters = () => {
    let filtered = [...allPartners];
    
    // Apply fitness level filter
    if (selectedFilters.fitnessLevel.length > 0) {
      filtered = filtered.filter(partner => 
        selectedFilters.fitnessLevel.includes(partner.fitnessLevel)
      );
    }
    
    // Apply distance filter
    if (selectedFilters.distance !== 'any') {
      const maxDistance = parseInt(selectedFilters.distance);
      filtered = filtered.filter(partner => {
        const distance = parseFloat(partner.distance.split(' ')[0]);
        return distance <= maxDistance;
      });
    }
    
    // Apply interests filter
    if (selectedFilters.interests.length > 0) {
      filtered = filtered.filter(partner => 
        partner.interests.some(interest => 
          selectedFilters.interests.includes(interest)
        )
      );
    }
    
    // Apply search query if exists
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(partner => 
        partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.interests.some(interest => 
          interest.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        partner.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setPartners(filtered);
    toggleFilter();
  };
  
  const resetFilters = () => {
    setSelectedFilters({
      fitnessLevel: [],
      distance: 'any',
      interests: [],
    });
    setPartners(allPartners);
    toggleFilter();
  };
  
  const handleLike = (partnerId: string) => {
    // In a real app, this would send a connection request
    console.log(`Liked partner with ID: ${partnerId}`);
  };
  
  const handleDislike = (partnerId: string) => {
    // In a real app, this would remove the partner from suggestions
    console.log(`Disliked partner with ID: ${partnerId}`);
  };
  
  const handleSuperLike = (partnerId: string) => {
    // In a real app, this would send a priority connection request
    console.log(`Super liked partner with ID: ${partnerId}`);
  };
  
  const renderContent = () => {
    switch (activeTab) {
      case 'discover':
        return (
          <View style={styles.discoverContainer}>
            <SocialMatchList users={partners.map(p => ({
              id: p.id,
              name: p.name,
              email: `${p.name.toLowerCase().replace(' ', '.')}@example.com`,
              avatarUrl: p.avatarUrl,
              bio: p.bio,
              fitnessGoals: p.fitnessGoals as any[],
              dietaryPreferences: ['no_restrictions'] as any[],
              activityLevel: 'moderately_active' as any,
              joinDate: new Date().toISOString(),
              workoutHistory: p.workoutHistory.map(wh => ({
                date: wh.date,
                workoutId: wh.id,
                workoutName: wh.workoutName,
                duration: wh.duration,
                caloriesBurned: wh.caloriesBurned
              })),
              nutritionHistory: [],
              weeklyStats: {
                workoutMinutes: p.workoutHistory.reduce((acc, curr) => acc + curr.duration, 0),
                caloriesBurned: p.workoutHistory.reduce((acc, curr) => acc + curr.caloriesBurned, 0),
                workoutsCompleted: p.workoutHistory.length,
                averageWorkoutDuration: p.workoutHistory.reduce((acc, curr) => acc + curr.duration, 0) / 
                  (p.workoutHistory.length || 1),
                streakDays: Math.floor(Math.random() * 10)
              },
              achievements: [],
              friends: p.friends,
              challengesCompleted: p.challengesCompleted,
              totalPoints: p.challengesCompleted * 100
            } as User))} />
          </View>
        );
      
      case 'matches':
        return (
          <View style={styles.matchesContainer}>
            <Text style={styles.sectionTitle}>New Matches</Text>
            <FlatList
              data={partners.slice(0, 3)}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.matchesList}
              renderItem={({ item }) => (
                <Pressable 
                  style={styles.matchItem}
                  onPress={() => {
                    try {
                      setTimeout(() => {
                        router.push(`/profile/${item.id}`);
                      }, 50);
                    } catch (error) {
                      console.error("Navigation error:", error);
                    }
                  }}
                >
                  <Image source={{ uri: item.avatarUrl }} style={styles.matchImage} />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.matchGradient}
                  >
                    <Text style={styles.matchName}>{item.name}</Text>
                    <View style={styles.matchCompatibility}>
                      <Text style={styles.matchCompatibilityText}>{item.compatibility}% Match</Text>
                    </View>
                  </LinearGradient>
                </Pressable>
              )}
              keyExtractor={item => item.id}
            />
            
            <Text style={styles.sectionTitle}>Messages</Text>
            <View style={styles.emptyMessages}>
              <Text style={styles.emptyTitle}>No messages yet</Text>
              <Text style={styles.emptyText}>Start connecting with fitness partners to chat</Text>
              <Pressable 
                style={styles.emptyButton}
                onPress={() => setActiveTab('discover')}
              >
                <Text style={styles.emptyButtonText}>Find Partners</Text>
              </Pressable>
            </View>
          </View>
        );
      
      case 'partners':
        return (
          <View style={styles.partnersContainer}>
            <Text style={styles.sectionTitle}>Your Fitness Partners</Text>
            {partners.length > 0 ? (
              <FlatList
                data={partners}
                renderItem={({ item }) => (
                  <Pressable 
                    style={styles.partnerItem}
                    onPress={() => {
                      try {
                        setTimeout(() => {
                          router.push(`/profile/${item.id}`);
                        }, 50);
                      } catch (error) {
                        console.error("Navigation error:", error);
                      }
                    }}
                  >
                    <Image source={{ uri: item.avatarUrl }} style={styles.partnerAvatar} />
                    <View style={styles.partnerInfo}>
                      <Text style={styles.partnerName}>{item.name}</Text>
                      <Text style={styles.partnerDetails}>{item.fitnessLevel} • {item.distance}</Text>
                      <View style={styles.partnerInterests}>
                        {item.interests.slice(0, 2).map((interest, idx) => (
                          <View key={idx} style={styles.interestTag}>
                            <Text style={styles.interestText}>{interest}</Text>
                          </View>
                        ))}
                        {item.interests.length > 2 && (
                          <Text style={styles.moreInterests}>+{item.interests.length - 2}</Text>
                        )}
                      </View>
                    </View>
                    <Pressable 
                      style={styles.messageButton}
                      onPress={() => {
                        try {
                          setTimeout(() => {
                            router.push(`/messages/${item.id}`);
                          }, 50);
                        } catch (error) {
                          console.error("Navigation error:", error);
                        }
                      }}
                    >
                      <Text style={styles.messageButtonText}>Message</Text>
                    </Pressable>
                  </Pressable>
                )}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.partnersList}
              />
            ) : (
              <View style={styles.emptyPartners}>
                <Text style={styles.emptyTitle}>No partners yet</Text>
                <Text style={styles.emptyText}>Connect with fitness enthusiasts to find workout buddies</Text>
                <Pressable 
                  style={styles.emptyButton}
                  onPress={() => setActiveTab('discover')}
                >
                  <Text style={styles.emptyButtonText}>Find Partners</Text>
                </Pressable>
              </View>
            )}
          </View>
        );
      
      default:
        return null;
    }
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
          <Pressable 
            onPress={() => {
              try {
                setTimeout(() => {
                  router.back();
                }, 50);
              } catch (error) {
                console.error("Navigation error:", error);
              }
            }} 
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Social</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <Pressable
                key={tab.id}
                style={styles.tabItem}
                onPress={() => setActiveTab(tab.id)}
              >
                <TabIcon 
                  size={20} 
                  color={isActive ? colors.primary : colors.textLight} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <Text 
                  style={[
                    styles.tabLabel,
                    isActive && styles.activeTabLabel
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
          <Animated.View style={tabIndicatorStyle} />
        </View>
        
        <View style={styles.searchContainer}>
          <Animated.View style={[styles.searchInputContainer, searchBarAnimatedStyle]}>
            <Search size={20} color={colors.textLight} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, interest, location..."
              placeholderTextColor={colors.textLight}
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </Animated.View>
          <Pressable 
            style={[
              styles.filterButton,
              showFilters && styles.filterButtonActive
            ]}
            onPress={toggleFilter}
          >
            <Filter size={20} color={showFilters ? colors.background : colors.text} />
          </Pressable>
        </View>
        
        <Animated.View style={[styles.filtersContainer, filterAnimatedStyle]}>
          <Card style={styles.filtersCard}>
            <Text style={styles.filterTitle}>Fitness Level</Text>
            <View style={styles.filterOptions}>
              {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((level) => (
                <Pressable 
                  key={level}
                  style={[
                    styles.filterOption,
                    selectedFilters.fitnessLevel.includes(level) && styles.filterOptionSelected
                  ]}
                  onPress={() => toggleFitnessLevel(level)}
                >
                  <Text 
                    style={[
                      styles.filterOptionText,
                      selectedFilters.fitnessLevel.includes(level) && styles.filterOptionTextSelected
                    ]}
                  >
                    {level}
                  </Text>
                  {selectedFilters.fitnessLevel.includes(level) && (
                    <Check size={16} color={colors.primary} />
                  )}
                </Pressable>
              ))}
            </View>
            
            <Text style={styles.filterTitle}>Distance</Text>
            <View style={styles.filterOptions}>
              {['5', '10', '25', 'any'].map((distance) => (
                <Pressable 
                  key={distance}
                  style={[
                    styles.filterOption,
                    selectedFilters.distance === distance && styles.filterOptionSelected
                  ]}
                  onPress={() => setDistance(distance)}
                >
                  <Text 
                    style={[
                      styles.filterOptionText,
                      selectedFilters.distance === distance && styles.filterOptionTextSelected
                    ]}
                  >
                    {distance === 'any' ? 'Any distance' : `${distance} miles`}
                  </Text>
                  {selectedFilters.distance === distance && (
                    <Check size={16} color={colors.primary} />
                  )}
                </Pressable>
              ))}
            </View>
            
            <Text style={styles.filterTitle}>Interests</Text>
            <View style={styles.filterOptions}>
              {['Running', 'Yoga', 'Weightlifting', 'Crossfit', 'Swimming', 'Cycling', 'HIIT', 'Tennis'].map((interest) => (
                <Pressable 
                  key={interest}
                  style={[
                    styles.filterOption,
                    selectedFilters.interests.includes(interest) && styles.filterOptionSelected
                  ]}
                  onPress={() => toggleInterest(interest)}
                >
                  <Text 
                    style={[
                      styles.filterOptionText,
                      selectedFilters.interests.includes(interest) && styles.filterOptionTextSelected
                    ]}
                  >
                    {interest}
                  </Text>
                  {selectedFilters.interests.includes(interest) && (
                    <Check size={16} color={colors.primary} />
                  )}
                </Pressable>
              ))}
            </View>
            
            <View style={styles.filterActions}>
              <Pressable style={styles.resetButton} onPress={resetFilters}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </Pressable>
              <Pressable style={styles.applyButton} onPress={applyFilters}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </Pressable>
            </View>
          </Card>
        </Animated.View>
        
        <Animated.View style={[styles.contentContainer, contentAnimatedStyle]}>
          {renderContent()}
        </Animated.View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    position: 'relative',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  tabLabel: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
  },
  activeTabLabel: {
    color: colors.primary,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginVertical: 16,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filtersCard: {
    padding: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  filterOptionSelected: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary,
  },
  filterOptionText: {
    fontSize: 14,
    color: colors.text,
  },
  filterOptionTextSelected: {
    color: colors.primary,
    fontWeight: '500',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  resetButtonText: {
    color: colors.text,
    fontWeight: '500',
  },
  applyButton: {
    flex: 2,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  discoverContainer: {
    flex: 1,
  },
  matchesContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  matchesList: {
    paddingBottom: 8,
    gap: 12,
  },
  matchItem: {
    width: 160,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
  },
  matchImage: {
    width: '100%',
    height: '100%',
  },
  matchGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  matchName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  matchCompatibility: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  matchCompatibilityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyMessages: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.card,
    borderRadius: 16,
    marginTop: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  partnersContainer: {
    flex: 1,
    padding: 16,
  },
  partnersList: {
    paddingBottom: 16,
  },
  partnerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  partnerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  partnerInfo: {
    flex: 1,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  partnerDetails: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 6,
  },
  partnerInterests: {
    flexDirection: 'row',
    gap: 6,
  },
  interestTag: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  interestText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  moreInterests: {
    fontSize: 12,
    color: colors.textLight,
    alignSelf: 'center',
  },
  messageButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  messageButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 12,
  },
  emptyPartners: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.card,
    borderRadius: 16,
    marginTop: 8,
  },
});