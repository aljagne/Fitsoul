import { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Pressable, Animated, PanResponder, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { Heart, X, Star, MessageCircle, Info, MapPin, ChevronDown, ChevronUp } from 'lucide-react-native';
import { User } from '@/types/user';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

interface SocialMatchCardProps {
  user: User;
  onLike: (userId: string) => void;
  onDislike: (userId: string) => void;
  onSuperLike?: (userId: string) => void;
  isActive?: boolean;
}

export function SocialMatchCard({ 
  user, 
  onLike, 
  onDislike, 
  onSuperLike,
  isActive = true
}: SocialMatchCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  // Animation values
  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: ['-30deg', '0deg', '30deg'],
    extrapolate: 'clamp',
  });
  
  const likeOpacity = position.x.interpolate({
    inputRange: [25, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  
  const dislikeOpacity = position.x.interpolate({
    inputRange: [-100, -25],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  
  const detailsHeight = useRef(new Animated.Value(0)).current;
  const detailsOpacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(detailsHeight, {
        toValue: showDetails ? 200 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(detailsOpacity, {
        toValue: showDetails ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      })
    ]).start();
  }, [showDetails]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isActive,
      onPanResponderMove: (_, gestureState) => {
        position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 120) {
          Animated.timing(position, {
            toValue: { x: 500, y: 0 },
            duration: 300,
            useNativeDriver: false,
          }).start(() => {
            onLike(user.id);
          });
        } else if (gestureState.dx < -120) {
          Animated.timing(position, {
            toValue: { x: -500, y: 0 },
            duration: 300,
            useNativeDriver: false,
          }).start(() => {
            onDislike(user.id);
          });
        } else if (gestureState.dy < -120 && onSuperLike) {
          Animated.timing(position, {
            toValue: { x: 0, y: -500 },
            duration: 300,
            useNativeDriver: false,
          }).start(() => {
            onSuperLike(user.id);
          });
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 4,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.card,
        {
          transform: [
            { translateX: position.x },
            { translateY: position.y },
            { rotate: rotate },
          ],
        },
      ]}
    >
      <Animated.View style={[styles.likeStamp, { opacity: likeOpacity }]}>
        <Text style={styles.stampText}>LIKE</Text>
      </Animated.View>
      
      <Animated.View style={[styles.dislikeStamp, { opacity: dislikeOpacity }]}>
        <Text style={styles.stampText}>NOPE</Text>
      </Animated.View>
      
      <Pressable onPress={() => setShowDetails(!showDetails)}>
        <Image source={{ uri: user.avatarUrl }} style={styles.image} />
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.infoGradient}
        >
          <View style={styles.infoContainer}>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{user.name}</Text>
              {user.location && (
                <View style={styles.locationContainer}>
                  <MapPin size={14} color="rgba(255, 255, 255, 0.8)" />
                  <Text style={styles.location}>{user.location}</Text>
                </View>
              )}
            </View>
            
            <View style={styles.goalsContainer}>
              {user.fitnessGoals.slice(0, 3).map((goal, index) => (
                <View key={index} style={styles.goalBadge}>
                  <Text style={styles.goalText}>
                    {goal.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </Text>
                </View>
              ))}
              {user.fitnessGoals.length > 3 && (
                <View style={styles.goalBadge}>
                  <Text style={styles.goalText}>+{user.fitnessGoals.length - 3}</Text>
                </View>
              )}
            </View>
            
            <Pressable 
              style={styles.detailsToggle}
              onPress={() => setShowDetails(!showDetails)}
            >
              {showDetails ? (
                <ChevronUp size={20} color="rgba(255, 255, 255, 0.8)" />
              ) : (
                <ChevronDown size={20} color="rgba(255, 255, 255, 0.8)" />
              )}
            </Pressable>
            
            <Animated.View 
              style={[
                styles.detailsContainer,
                { 
                  height: detailsHeight,
                  opacity: detailsOpacity,
                }
              ]}
            >
              <Text style={styles.bio}>{user.bio}</Text>
              
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{user.workoutHistory.length}</Text>
                  <Text style={styles.statLabel}>Workouts</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{user.challengesCompleted}</Text>
                  <Text style={styles.statLabel}>Challenges</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{user.friends.length}</Text>
                  <Text style={styles.statLabel}>Friends</Text>
                </View>
              </View>
              
              <Pressable 
                style={styles.viewProfileButton}
                onPress={() => router.push(`/profile/${user.id}`)}
              >
                <Info size={16} color="#fff" />
                <Text style={styles.viewProfileText}>View Full Profile</Text>
              </Pressable>
            </Animated.View>
          </View>
        </LinearGradient>
      </Pressable>
      
      <View style={styles.actionsContainer}>
        <Pressable 
          style={[styles.actionButton, styles.dislikeButton]}
          onPress={() => onDislike(user.id)}
          android_ripple={Platform.OS === 'android' ? { color: 'rgba(255, 255, 255, 0.2)', radius: 25 } : undefined}
        >
          <X size={24} color="white" />
        </Pressable>
        
        {onSuperLike && (
          <Pressable 
            style={[styles.actionButton, styles.superLikeButton]}
            onPress={() => onSuperLike(user.id)}
            android_ripple={Platform.OS === 'android' ? { color: 'rgba(255, 255, 255, 0.2)', radius: 25 } : undefined}
          >
            <Star size={24} color="white" />
          </Pressable>
        )}
        
        <Pressable 
          style={[styles.actionButton, styles.messageButton]}
          onPress={() => router.push(`/messages/${user.id}`)}
          android_ripple={Platform.OS === 'android' ? { color: 'rgba(255, 255, 255, 0.2)', radius: 25 } : undefined}
        >
          <MessageCircle size={24} color="white" />
        </Pressable>
        
        <Pressable 
          style={[styles.actionButton, styles.likeButton]}
          onPress={() => onLike(user.id)}
          android_ripple={Platform.OS === 'android' ? { color: 'rgba(255, 255, 255, 0.2)', radius: 25 } : undefined}
        >
          <Heart size={24} color="white" />
        </Pressable>
      </View>
    </Animated.View>
  );
}

interface SocialMatchListProps {
  users: User[];
}

export function SocialMatchList({ users }: SocialMatchListProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedUsers, setLikedUsers] = useState<string[]>([]);
  const [dislikedUsers, setDislikedUsers] = useState<string[]>([]);
  const [superLikedUsers, setSuperLikedUsers] = useState<string[]>([]);
  
  // Animation for empty state
  const emptyAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (currentIndex >= users.length) {
      Animated.timing(emptyAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [currentIndex, users.length]);
  
  const handleLike = (userId: string) => {
    setLikedUsers([...likedUsers, userId]);
    if (currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const handleDislike = (userId: string) => {
    setDislikedUsers([...dislikedUsers, userId]);
    if (currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const handleSuperLike = (userId: string) => {
    setSuperLikedUsers([...superLikedUsers, userId]);
    if (currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  if (users.length === 0 || currentIndex >= users.length) {
    return (
      <Animated.View 
        style={[
          styles.emptyContainer,
          {
            opacity: emptyAnim,
            transform: [
              { 
                translateY: emptyAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0]
                })
              }
            ]
          }
        ]}
      >
        <LinearGradient
          colors={[colors.primary + '20', colors.secondary + '20']}
          style={styles.emptyGradient}
        >
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=800' }} 
            style={styles.emptyImage} 
          />
        </LinearGradient>
        <Text style={styles.emptyTitle}>No more matches available</Text>
        <Text style={styles.emptyText}>
          You've gone through all available profiles. Check back later for more matches!
        </Text>
        <Pressable 
          style={styles.refreshButton}
          onPress={() => setCurrentIndex(0)}
        >
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.refreshButtonGradient}
          >
            <Text style={styles.refreshButtonText}>Start Over</Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    );
  }
  
  return (
    <View style={styles.container}>
      {users.slice(currentIndex).reverse().map((user, index) => {
        const isTop = index === users.slice(currentIndex).length - 1;
        return (
          <SocialMatchCard 
            key={user.id}
            user={user} 
            onLike={handleLike}
            onDislike={handleDislike}
            onSuperLike={handleSuperLike}
            isActive={isTop}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    width: '90%',
    height: '80%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.card,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 60,
    paddingBottom: 80, // Extra space for action buttons
    paddingHorizontal: 20,
  },
  infoContainer: {
    gap: 12,
  },
  nameContainer: {
    marginBottom: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  goalText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  detailsToggle: {
    alignSelf: 'center',
    padding: 8,
  },
  detailsContainer: {
    overflow: 'hidden',
    gap: 16,
  },
  bio: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    paddingVertical: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  viewProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  viewProfileText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  dislikeButton: {
    backgroundColor: colors.error,
  },
  likeButton: {
    backgroundColor: colors.success,
  },
  superLikeButton: {
    backgroundColor: colors.primary,
  },
  messageButton: {
    backgroundColor: colors.secondary,
  },
  likeStamp: {
    position: 'absolute',
    top: 50,
    right: 40,
    zIndex: 10,
    transform: [{ rotate: '30deg' }],
    borderWidth: 4,
    borderColor: colors.success,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dislikeStamp: {
    position: 'absolute',
    top: 50,
    left: 40,
    zIndex: 10,
    transform: [{ rotate: '-30deg' }],
    borderWidth: 4,
    borderColor: colors.error,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  stampText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyGradient: {
    borderRadius: 100,
    padding: 8,
    marginBottom: 24,
  },
  emptyImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  refreshButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  refreshButtonGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});