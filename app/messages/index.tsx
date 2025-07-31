import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Pressable, 
  Image, 
  Animated,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { Search, MessageSquare } from 'lucide-react-native';
import { BackButton } from '@/components/BackButton';

// Mock data for messages
const allMessages = [
  {
    id: '1',
    name: 'Sarah Johnson',
    message: 'Are we still meeting for our run tomorrow?',
    time: '10:30 AM',
    unread: true,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    lastActive: 'Online',
  },
  {
    id: '2',
    name: 'Michael Chen',
    message: 'I sent you the workout plan for this week',
    time: 'Yesterday',
    unread: false,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    lastActive: '2 hours ago',
  },
  {
    id: '3',
    name: 'Emma Wilson',
    message: 'Thanks for the tips! My form is much better now',
    time: 'Monday',
    unread: false,
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    lastActive: '5 hours ago',
  },
  {
    id: '4',
    name: 'David Kim',
    message: 'Let me know when you want to schedule our next session',
    time: 'Sunday',
    unread: false,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    lastActive: 'Yesterday',
  },
  {
    id: '5',
    name: 'Jessica Martinez',
    message: 'The yoga class was amazing! We should go again next week',
    time: 'Last week',
    unread: false,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    lastActive: '3 days ago',
  },
  {
    id: '6',
    name: 'Alex Thompson',
    message: 'I found a great new running trail we should try',
    time: 'Last week',
    unread: false,
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
    lastActive: 'Online',
  },
];

export default function MessagesScreen() {
  const [messages, setMessages] = useState(allMessages);
  const [searchQuery, setSearchQuery] = useState('');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);
  
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    if (text.trim() === '') {
      setMessages(allMessages);
      return;
    }
    
    const filtered = allMessages.filter(message => 
      message.name.toLowerCase().includes(text.toLowerCase()) ||
      message.message.toLowerCase().includes(text.toLowerCase())
    );
    
    setMessages(filtered);
  };
  
  const renderMessageItem = ({ item, index }: { item: typeof allMessages[0], index: number }) => {
    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ 
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0]
            }) 
          }]
        }}
      >
        <Pressable
          style={[
            styles.messageItem,
            index < messages.length - 1 && styles.messageItemBorder
          ]}
          onPress={() => router.push(`/messages/${item.id}`)}
        >
          <View style={styles.avatarContainer}>
            <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
            {item.lastActive === 'Online' && (
              <View style={styles.onlineIndicator} />
            )}
          </View>
          
          <View style={styles.messageContent}>
            <View style={styles.messageHeader}>
              <Text style={styles.messageName}>{item.name}</Text>
              <Text style={styles.messageTime}>{item.time}</Text>
            </View>
            <View style={styles.messagePreview}>
              <Text 
                style={[
                  styles.messageText,
                  item.unread && styles.unreadMessageText
                ]}
                numberOfLines={1}
              >
                {item.message}
              </Text>
              {item.unread && <View style={styles.unreadIndicator} />}
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search messages..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>
      
      {messages.length > 0 ? (
        <FlatList
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MessageSquare size={60} color={colors.textLight} />
          <Text style={styles.emptyTitle}>No messages found</Text>
          <Text style={styles.emptyText}>
            {searchQuery.trim() !== '' 
              ? 'Try a different search term'
              : 'Connect with fitness partners to start chatting'}
          </Text>
          {searchQuery.trim() !== '' && (
            <Pressable 
              style={styles.clearSearchButton}
              onPress={() => handleSearch('')}
            >
              <Text style={styles.clearSearchButtonText}>Clear Search</Text>
            </Pressable>
          )}
        </View>
      )}
    </SafeAreaView>
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInputContainer: {
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
  messagesList: {
    paddingHorizontal: 16,
  },
  messageItem: {
    flexDirection: 'row',
    paddingVertical: 16,
  },
  messageItemBorder: {
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
  onlineIndicator: {
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
  messageContent: {
    flex: 1,
    justifyContent: 'center',
  },
  messageHeader: {
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
  messagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageText: {
    flex: 1,
    fontSize: 14,
    color: colors.textLight,
  },
  unreadMessageText: {
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  clearSearchButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  clearSearchButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});