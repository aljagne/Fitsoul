import React, { useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Pressable, 
  Image, 
  TextInput,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Search, UserPlus, MessageCircle, ArrowLeft } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { BackButton } from '@/components/BackButton';

// Mock data for friends
const friends = [
  {
    id: '1',
    name: 'Sarah Johnson',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    status: 'online',
    lastActive: 'Active now',
    mutualFriends: 5,
    interests: ['Running', 'Yoga', 'HIIT'],
  },
  {
    id: '2',
    name: 'Michael Chen',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
    status: 'offline',
    lastActive: 'Active 2h ago',
    mutualFriends: 3,
    interests: ['Weightlifting', 'CrossFit', 'Nutrition'],
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    status: 'online',
    lastActive: 'Active now',
    mutualFriends: 8,
    interests: ['Pilates', 'Swimming', 'Cycling'],
  },
  {
    id: '4',
    name: 'David Kim',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    status: 'offline',
    lastActive: 'Active 5h ago',
    mutualFriends: 2,
    interests: ['Basketball', 'Strength Training', 'Hiking'],
  },
  {
    id: '5',
    name: 'Jessica Taylor',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400',
    status: 'online',
    lastActive: 'Active now',
    mutualFriends: 4,
    interests: ['Tennis', 'Kickboxing', 'Meditation'],
  },
  {
    id: '6',
    name: 'Alex Morgan',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    status: 'offline',
    lastActive: 'Active yesterday',
    mutualFriends: 1,
    interests: ['Soccer', 'Rowing', 'Calisthenics'],
  },
];

// Mock data for friend requests
const friendRequests = [
  {
    id: '7',
    name: 'Olivia Wilson',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    mutualFriends: 3,
  },
  {
    id: '8',
    name: 'Ethan Brown',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    mutualFriends: 2,
  },
];

export default function FriendsScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Friends</Text>
        <Pressable style={styles.addFriendButton}>
          <UserPlus size={20} color={colors.text} />
        </Pressable>
      </View>
      
      <Animated.View 
        style={[
          styles.searchContainer,
          { opacity: fadeAnim }
        ]}
      >
        <Search size={20} color={colors.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search friends"
          placeholderTextColor={colors.textLight}
        />
      </Animated.View>
      
      {friendRequests.length > 0 && (
        <Animated.View 
          style={[
            styles.requestsSection,
            { opacity: fadeAnim }
          ]}
        >
          <Text style={styles.sectionTitle}>Friend Requests</Text>
          <FlatList
            data={friendRequests}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <FriendRequestItem request={item} index={index} />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.requestsList}
          />
        </Animated.View>
      )}
      
      <Text style={styles.sectionTitle}>Your Friends</Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <FriendItem friend={item} index={index} />
        )}
        contentContainerStyle={styles.friendsList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

function FriendRequestItem({ request, index }: { request: any, index: number }) {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.requestItem,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <Image source={{ uri: request.image }} style={styles.requestAvatar} />
      <Text style={styles.requestName}>{request.name}</Text>
      <Text style={styles.mutualFriends}>{request.mutualFriends} mutual friends</Text>
      
      <View style={styles.requestActions}>
        <Pressable style={styles.acceptButton}>
          <Text style={styles.acceptButtonText}>Accept</Text>
        </Pressable>
        <Pressable style={styles.declineButton}>
          <Text style={styles.declineButtonText}>Decline</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

function FriendItem({ friend, index }: { friend: any, index: number }) {
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          { scale: scaleAnim },
          { translateY: slideAnim }
        ]
      }}
    >
      <Pressable 
        style={styles.friendItem}
        onPress={() => router.push(`/profile/${friend.id}`)}
      >
        <View style={styles.avatarContainer}>
          <Image source={{ uri: friend.image }} style={styles.avatar} />
          {friend.status === 'online' && (
            <View style={styles.statusIndicator} />
          )}
        </View>
        
        <View style={styles.friendContent}>
          <View style={styles.friendHeader}>
            <Text style={styles.friendName}>{friend.name}</Text>
            <Text style={styles.lastActive}>{friend.lastActive}</Text>
          </View>
          
          <View style={styles.interestsContainer}>
            {friend.interests.slice(0, 2).map((interest: string, i: number) => (
              <View key={i} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
            {friend.interests.length > 2 && (
              <Text style={styles.moreInterests}>+{friend.interests.length - 2}</Text>
            )}
          </View>
        </View>
        
        <Pressable 
          style={styles.messageButton}
          onPress={() => router.push(`/messages/${friend.id}`)}
        >
          <MessageCircle size={20} color={colors.primary} />
        </Pressable>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  addFriendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  requestsSection: {
    marginBottom: 16,
  },
  requestsList: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  requestItem: {
    width: 160,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  requestAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 12,
  },
  requestName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  mutualFriends: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 12,
  },
  requestActions: {
    width: '100%',
    gap: 8,
  },
  acceptButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: colors.background,
    fontWeight: '600',
    fontSize: 14,
  },
  declineButton: {
    backgroundColor: colors.card,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  declineButtonText: {
    color: colors.text,
    fontWeight: '500',
    fontSize: 14,
  },
  friendsList: {
    paddingHorizontal: 16,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.background,
  },
  friendContent: {
    flex: 1,
  },
  friendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  lastActive: {
    fontSize: 12,
    color: colors.textLight,
  },
  interestsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  interestTag: {
    backgroundColor: colors.card,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  interestText: {
    fontSize: 12,
    color: colors.textLight,
  },
  moreInterests: {
    fontSize: 12,
    color: colors.primary,
  },
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});