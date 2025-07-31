import { useState, useEffect } from "react";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, View, Pressable, Modal, Alert, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar, Trophy, Users, MessageCircle, Share2, ChevronDown, ChevronUp, Bell, X } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { challenges } from "@/mocks/challenges";
import { BackButton } from "@/components/BackButton";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing
} from "react-native-reanimated";

export default function ChallengeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const challenge = challenges.find((c) => c.id === id);
  const [showRules, setShowRules] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [userProgress, setUserProgress] = useState(0);

  // Animation values
  const fadeAnim = useSharedValue(0);
  const translateY = useSharedValue(20);

  // Calculate days left once when component mounts
  const [daysLeft, setDaysLeft] = useState(0);
  
  useEffect(() => {
    if (challenge) {
      const days = Math.ceil((new Date(challenge.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      setDaysLeft(days);
    }

    // Start entrance animation
    fadeAnim.value = withTiming(1, { duration: 600 });
    translateY.value = withTiming(0, { duration: 600 });
  }, [challenge]);

  if (!challenge) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ 
          title: "Challenge not found",
          headerLeft: () => <BackButton />
        }} />
        <View style={styles.content}>
          <Text style={styles.title}>Challenge not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const progress = (challenge.progress.current / challenge.progress.target) * 100;

  const handleJoinChallenge = () => {
    if (challenge.status === "upcoming") {
      // Set reminder
      Alert.alert(
        "Set Reminder",
        `We'll remind you when the ${challenge.title} challenge starts.`,
        [{ text: "OK", onPress: () => setHasJoined(true) }]
      );
    } else {
      // Join active challenge
      setShowJoinModal(true);
    }
  };

  const confirmJoinChallenge = () => {
    Alert.alert(
      "Challenge Joined",
      `You've successfully joined the ${challenge.title} challenge!`,
      [{ text: "OK" }]
    );
    setShowJoinModal(false);
    setHasJoined(true);
    setUserProgress(0);
  };

  const handleShareChallenge = () => {
    if (Platform.OS !== 'web') {
      try {
        // This would use the Share API on native platforms
        Alert.alert("Share", `Sharing challenge: ${challenge.title}`);
      } catch (error) {
        console.error("Error sharing challenge:", error);
      }
    } else {
      // Web fallback
      Alert.alert("Share", "Sharing not available on web");
    }
  };

  const handleUpdateProgress = () => {
    if (!hasJoined) {
      Alert.alert(
        "Join Challenge",
        "You need to join this challenge first to update your progress.",
        [{ text: "OK" }]
      );
      return;
    }

    // For web compatibility, we'll use a simple alert instead of Alert.prompt
    if (Platform.OS === 'web') {
      const newProgress = prompt(`Enter your current progress (0-${challenge.progress.target} ${challenge.progress.unit})`, userProgress.toString());
      if (newProgress !== null) {
        const progress = parseInt(newProgress);
        if (!isNaN(progress) && progress >= 0 && progress <= challenge.progress.target) {
          setUserProgress(progress);
        } else {
          Alert.alert("Invalid Input", "Please enter a valid number.");
        }
      }
    } else {
      Alert.prompt(
        "Update Progress",
        `Enter your current progress (0-${challenge.progress.target} ${challenge.progress.unit})`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Update",
            onPress: (value) => {
              const newProgress = parseInt(value || "0");
              if (!isNaN(newProgress) && newProgress >= 0 && newProgress <= challenge.progress.target) {
                setUserProgress(newProgress);
              } else {
                Alert.alert("Invalid Input", "Please enter a valid number.");
              }
            }
          }
        ],
        "plain-text",
        userProgress.toString()
      );
    }
  };

  // Animated styles
  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ translateY: translateY.value }]
    };
  });

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen 
        options={{ 
          title: challenge.title,
          headerLeft: () => <BackButton />,
          headerRight: () => (
            <Pressable style={{ marginRight: 16 }} onPress={handleShareChallenge}>
              <Share2 size={24} color={colors.text} />
            </Pressable>
          )
        }} 
      />
      <ScrollView>
        <Image source={{ uri: challenge.imageUrl }} style={styles.image} />
        
        <Animated.View style={[styles.content, contentAnimatedStyle]}>
          <View style={styles.header}>
            <Text style={styles.title}>{challenge.title}</Text>
            <View style={[styles.badge, styles[`badge_${challenge.status}`]]}>
              <Text style={styles.badgeText}>
                {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
              </Text>
            </View>
          </View>

          <Text style={styles.description}>{challenge.description}</Text>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Calendar size={20} color={colors.textLight} />
              <Text style={styles.statText}>
                {challenge.status === "completed" ? "Completed" : 
                 challenge.status === "upcoming" ? "Starting soon" :
                 `${daysLeft} days left`}
              </Text>
            </View>
            <View style={styles.stat}>
              <Users size={20} color={colors.textLight} />
              <Text style={styles.statText}>
                {challenge.participants.length} participants
              </Text>
            </View>
            <View style={styles.stat}>
              <Trophy size={20} color={colors.textLight} />
              <Text style={styles.statText}>
                {challenge.rewards.points} pts
              </Text>
            </View>
          </View>

          {hasJoined && challenge.status === "active" && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Progress</Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { width: `${Math.min((userProgress / challenge.progress.target) * 100, 100)}%` },
                    ]} 
                  />
                </View>
                <View style={styles.progressTextContainer}>
                  <Text style={styles.progressText}>
                    {userProgress} / {challenge.progress.target} {challenge.progress.unit}
                  </Text>
                  <Text style={styles.progressPercentage}>
                    {Math.round((userProgress / challenge.progress.target) * 100)}%
                  </Text>
                </View>
                <Pressable 
                  style={styles.updateProgressButton}
                  onPress={handleUpdateProgress}
                >
                  <Text style={styles.updateProgressText}>Update Progress</Text>
                </Pressable>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Challenge Progress</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { width: `${Math.min(progress, 100)}%` },
                  ]} 
                />
              </View>
              <View style={styles.progressTextContainer}>
                <Text style={styles.progressText}>
                  {challenge.progress.current} / {challenge.progress.target} {challenge.progress.unit}
                </Text>
                <Text style={styles.progressPercentage}>
                  {Math.round(progress)}%
                </Text>
              </View>
            </View>
          </View>

          {/* Collapsible Rules Section */}
          <Pressable 
            style={styles.sectionHeader}
            onPress={() => setShowRules(!showRules)}
          >
            <Text style={styles.sectionTitle}>Rules</Text>
            {showRules ? (
              <ChevronUp size={20} color={colors.textLight} />
            ) : (
              <ChevronDown size={20} color={colors.textLight} />
            )}
          </Pressable>
          
          {showRules && (
            <View style={styles.rulesList}>
              {challenge.rules.map((rule, index) => (
                <View key={index} style={styles.rule}>
                  <Text style={styles.ruleNumber}>{index + 1}</Text>
                  <Text style={styles.ruleText}>{rule}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Collapsible Leaderboard Section */}
          <Pressable 
            style={styles.sectionHeader}
            onPress={() => setShowLeaderboard(!showLeaderboard)}
          >
            <Text style={styles.sectionTitle}>Leaderboard</Text>
            {showLeaderboard ? (
              <ChevronUp size={20} color={colors.textLight} />
            ) : (
              <ChevronDown size={20} color={colors.textLight} />
            )}
          </Pressable>
          
          {showLeaderboard && (
            <View style={styles.leaderboard}>
              {challenge.participants.map((participant, index) => (
                <View key={participant.id} style={styles.participant}>
                  <Image 
                    source={{ uri: participant.avatarUrl }} 
                    style={styles.avatar}
                  />
                  <View style={styles.participantInfo}>
                    <Text style={styles.participantName}>{participant.name}</Text>
                    <View style={styles.participantProgress}>
                      <View style={styles.participantProgressBar}>
                        <View 
                          style={[
                            styles.participantProgressFill,
                            { 
                              width: `${Math.min((participant.progress.current / participant.progress.target) * 100, 100)}%` 
                            },
                          ]} 
                        />
                      </View>
                      <Text style={styles.participantProgressText}>
                        {participant.progress.current} / {participant.progress.target}
                      </Text>
                    </View>
                  </View>
                  {participant.rank && (
                    <View style={styles.rank}>
                      <Text style={styles.rankText}>#{participant.rank}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
          
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {(challenge.status === "upcoming" || challenge.status === "active") && !hasJoined ? (
              <Pressable 
                style={styles.joinButton}
                onPress={handleJoinChallenge}
              >
                {challenge.status === "upcoming" ? (
                  <>
                    <Bell size={20} color={colors.background} />
                    <Text style={styles.joinButtonText}>Remind Me</Text>
                  </>
                ) : (
                  <>
                    <Trophy size={20} color={colors.background} />
                    <Text style={styles.joinButtonText}>Join Challenge</Text>
                  </>
                )}
              </Pressable>
            ) : hasJoined && (
              <View style={styles.joinedBadge}>
                <Trophy size={20} color={colors.success} />
                <Text style={styles.joinedText}>
                  {challenge.status === "upcoming" ? "Reminder Set" : "Challenge Joined"}
                </Text>
              </View>
            )}
            
            <Pressable 
              style={styles.chatButton}
              onPress={() => router.push("/messages")}
            >
              <MessageCircle size={20} color={colors.primary} />
              <Text style={styles.chatButtonText}>Chat with Participants</Text>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Join Challenge Modal */}
      <Modal
        visible={showJoinModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowJoinModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Join Challenge</Text>
              <Pressable onPress={() => setShowJoinModal(false)}>
                <X size={24} color={colors.text} />
              </Pressable>
            </View>
            
            <Text style={styles.modalText}>
              Are you ready to join the "{challenge.title}" challenge? You'll need to complete {challenge.progress.target} {challenge.progress.unit} by {new Date(challenge.endDate).toLocaleDateString()}.
            </Text>
            
            <View style={styles.modalButtons}>
              <Pressable 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowJoinModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmJoinChallenge}
              >
                <Text style={styles.confirmButtonText}>Join Challenge</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    marginLeft: 8,
  },
  image: {
    width: "100%",
    height: 200,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 8,
  },
  badge_active: {
    backgroundColor: colors.primary + "20",
  },
  badge_upcoming: {
    backgroundColor: colors.secondary + "20",
  },
  badge_completed: {
    backgroundColor: colors.success + "20",
  },
  badge_failed: {
    backgroundColor: colors.error + "20",
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "500",
  },
  description: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 16,
    lineHeight: 24,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  stat: {
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 16,
    color: colors.textLight,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressText: {
    fontSize: 14,
    color: colors.textLight,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  updateProgressButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 12,
  },
  updateProgressText: {
    color: colors.background,
    fontWeight: '500',
    fontSize: 14,
  },
  rulesList: {
    marginBottom: 24,
  },
  rule: {
    flexDirection: "row",
    marginBottom: 12,
  },
  ruleNumber: {
    width: 24,
    height: 24,
    backgroundColor: colors.primary,
    borderRadius: 12,
    color: colors.background,
    textAlign: "center",
    lineHeight: 24,
    marginRight: 12,
    fontSize: 14,
    fontWeight: "500",
  },
  ruleText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  leaderboard: {
    marginBottom: 24,
  },
  participant: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 4,
  },
  participantProgress: {
    flex: 1,
  },
  participantProgressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginBottom: 4,
  },
  participantProgressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  participantProgressText: {
    fontSize: 12,
    color: colors.textLight,
  },
  rank: {
    marginLeft: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + "10",
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  actionButtons: {
    gap: 12,
  },
  joinButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.background,
  },
  joinedBadge: {
    backgroundColor: colors.success + "15",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  joinedText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.success,
  },
  chatButton: {
    backgroundColor: colors.background,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    gap: 8,
  },
  chatButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  modalText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 24,
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.card,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
});