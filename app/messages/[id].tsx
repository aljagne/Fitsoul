import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Pressable, 
  Image, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { colors } from '@/constants/colors';
import { Send, Phone, Video, MoreVertical, ArrowLeft, Info } from 'lucide-react-native';
import { BackButton } from '@/components/BackButton';

// Mock data for messages
const conversations = {
  '1': {
    id: '1',
    name: 'Sarah Johnson',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    lastActive: 'Online',
    messages: [
      {
        id: '1',
        text: 'Hey! How was your workout today?',
        timestamp: '2023-06-10T10:30:00',
        sender: 'them',
      },
      {
        id: '2',
        text: 'It was great! I managed to increase my weights on the bench press.',
        timestamp: '2023-06-10T10:35:00',
        sender: 'me',
      },
      {
        id: '3',
        text: 'That\'s awesome! How much are you lifting now?',
        timestamp: '2023-06-10T10:37:00',
        sender: 'them',
      },
      {
        id: '4',
        text: '185 lbs for 5 reps. Still working on it!',
        timestamp: '2023-06-10T10:40:00',
        sender: 'me',
      },
      {
        id: '5',
        text: 'Are we still meeting for our run tomorrow?',
        timestamp: '2023-06-10T10:45:00',
        sender: 'them',
      },
    ],
  },
  '2': {
    id: '2',
    name: 'Michael Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    lastActive: '2 hours ago',
    messages: [
      {
        id: '1',
        text: 'I sent you the workout plan for this week',
        timestamp: '2023-06-09T15:20:00',
        sender: 'them',
      },
      {
        id: '2',
        text: 'Thanks! I\'ll check it out.',
        timestamp: '2023-06-09T15:25:00',
        sender: 'me',
      },
      {
        id: '3',
        text: 'Let me know if you have any questions about the exercises.',
        timestamp: '2023-06-09T15:30:00',
        sender: 'them',
      },
    ],
  },
  '3': {
    id: '3',
    name: 'Emma Wilson',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    lastActive: '5 hours ago',
    messages: [
      {
        id: '1',
        text: 'How\'s your squat form coming along?',
        timestamp: '2023-06-05T09:10:00',
        sender: 'me',
      },
      {
        id: '2',
        text: 'Much better after your tips! I\'ve been practicing with just the bar to get the form right.',
        timestamp: '2023-06-05T09:15:00',
        sender: 'them',
      },
      {
        id: '3',
        text: 'That\'s the way to do it. Form first, then weight.',
        timestamp: '2023-06-05T09:20:00',
        sender: 'me',
      },
      {
        id: '4',
        text: 'Thanks for the tips! My form is much better now',
        timestamp: '2023-06-05T09:25:00',
        sender: 'them',
      },
    ],
  },
};

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const conversation = conversations[id as keyof typeof conversations];
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(conversation.messages);
  const [isTyping, setIsTyping] = useState(false);
  
  const listRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    // Simulate typing indicator
    if (conversation.id === '1') {
      const typingTimer = setTimeout(() => {
        setIsTyping(true);
        
        // Simulate a new message after typing
        const replyTimer = setTimeout(() => {
          setIsTyping(false);
          const newMessage = {
            id: String(messages.length + 1),
            text: 'Yes, 7 AM at the park entrance. Don\'t forget your water bottle!',
            timestamp: new Date().toISOString(),
            sender: 'them',
          };
          setMessages(prev => [...prev, newMessage]);
        }, 3000);
        
        return () => clearTimeout(replyTimer);
      }, 2000);
      
      return () => clearTimeout(typingTimer);
    }
  }, []);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (listRef.current) {
      listRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);
  
  const handleSend = () => {
    if (message.trim() === '') return;
    
    const newMessage = {
      id: String(messages.length + 1),
      text: message,
      timestamp: new Date().toISOString(),
      sender: 'me',
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    Keyboard.dismiss();
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const renderMessageItem = ({ item, index }: { item: typeof messages[0], index: number }) => {
    const isMe = item.sender === 'me';
    const showAvatar = !isMe && (index === 0 || messages[index - 1].sender !== item.sender);
    
    return (
      <Animated.View
        style={[
          styles.messageRow,
          isMe ? styles.myMessageRow : styles.theirMessageRow,
          { opacity: fadeAnim }
        ]}
      >
        {!isMe && showAvatar ? (
          <Image source={{ uri: conversation.avatarUrl }} style={styles.messageAvatar} />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}
        
        <View
          style={[
            styles.messageBubble,
            isMe ? styles.myMessageBubble : styles.theirMessageBubble,
          ]}
        >
          <Text style={[
            styles.messageText,
            isMe ? styles.myMessageText : styles.theirMessageText,
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.messageTime,
            isMe ? styles.myMessageTime : styles.theirMessageTime,
          ]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <Pressable 
              style={styles.headerTitle}
              onPress={() => router.push(`/profile/${conversation.id}`)}
            >
              <Image source={{ uri: conversation.avatarUrl }} style={styles.headerAvatar} />
              <View>
                <Text style={styles.headerName}>{conversation.name}</Text>
                <Text style={styles.headerStatus}>{conversation.lastActive}</Text>
              </View>
            </Pressable>
          ),
          headerLeft: () => <BackButton />,
          headerRight: () => (
            <View style={styles.headerActions}>
              <Pressable style={styles.headerButton}>
                <Phone size={20} color={colors.text} />
              </Pressable>
              <Pressable style={styles.headerButton}>
                <Video size={20} color={colors.text} />
              </Pressable>
              <Pressable style={styles.headerButton}>
                <Info size={20} color={colors.text} />
              </Pressable>
            </View>
          ),
        }}
      />
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />
        
        {isTyping && (
          <View style={styles.typingContainer}>
            <Image source={{ uri: conversation.avatarUrl }} style={styles.typingAvatar} />
            <View style={styles.typingBubble}>
              <View style={styles.typingDots}>
                <View style={[styles.typingDot, styles.typingDot1]} />
                <View style={[styles.typingDot, styles.typingDot2]} />
                <View style={[styles.typingDot, styles.typingDot3]} />
              </View>
            </View>
          </View>
        )}
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={colors.textLight}
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <Pressable 
            style={[
              styles.sendButton,
              message.trim() === '' && styles.sendButtonDisabled
            ]}
            onPress={handleSend}
            disabled={message.trim() === ''}
          >
            <Send size={20} color={message.trim() === '' ? colors.textLight : colors.background} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  headerStatus: {
    fontSize: 12,
    color: colors.textLight,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    padding: 4,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  myMessageRow: {
    alignSelf: 'flex-end',
  },
  theirMessageRow: {
    alignSelf: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  avatarPlaceholder: {
    width: 32,
    marginRight: 8,
  },
  messageBubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingBottom: 24,
    position: 'relative',
  },
  myMessageBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  theirMessageBubble: {
    backgroundColor: colors.card,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
  },
  myMessageText: {
    color: 'white',
  },
  theirMessageText: {
    color: colors.text,
  },
  messageTime: {
    fontSize: 10,
    position: 'absolute',
    bottom: 6,
    right: 12,
  },
  myMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  theirMessageTime: {
    color: colors.textLight,
  },
  typingContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  typingAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  typingBubble: {
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomLeftRadius: 4,
  },
  typingDots: {
    flexDirection: 'row',
    width: 40,
    justifyContent: 'space-between',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textLight,
    opacity: 0.5,
  },
  typingDot1: {
    animationName: 'bounce',
    animationDuration: '0.6s',
    animationIterationCount: 'infinite',
  },
  typingDot2: {
    animationName: 'bounce',
    animationDuration: '0.6s',
    animationDelay: '0.2s',
    animationIterationCount: 'infinite',
  },
  typingDot3: {
    animationName: 'bounce',
    animationDuration: '0.6s',
    animationDelay: '0.4s',
    animationIterationCount: 'infinite',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingRight: 48,
    maxHeight: 120,
    color: colors.text,
    fontSize: 16,
  },
  sendButton: {
    position: 'absolute',
    right: 24,
    bottom: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.border,
  },
});