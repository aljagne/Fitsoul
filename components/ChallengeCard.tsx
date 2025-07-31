import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Calendar, Trophy, Users } from "lucide-react-native";
import { colors } from "@/constants/colors";
import type { Challenge } from "@/types/challenge";
import { router } from "expo-router";

interface ChallengeCardProps {
  challenge: Challenge;
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const progress = (challenge.progress.current / challenge.progress.target) * 100;
  const daysLeft = Math.ceil((new Date(challenge.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Pressable 
      style={styles.card}
      onPress={() => router.push(`/challenge/${challenge.id}`)}
    >
      <Image 
        source={{ uri: challenge.imageUrl }} 
        style={styles.image}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{challenge.title}</Text>
          <View style={[styles.badge, styles[`badge_${challenge.status}`]]}>
            <Text style={styles.badgeText}>
              {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
            </Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {challenge.description}
        </Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${Math.min(progress, 100)}%` },
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {challenge.progress.current} / {challenge.progress.target} {challenge.progress.unit}
          </Text>
        </View>
        
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Calendar size={16} color={colors.textLight} />
            <Text style={styles.statText}>
              {challenge.status === "completed" ? "Completed" : 
               challenge.status === "upcoming" ? "Starting soon" :
               `${daysLeft} days left`}
            </Text>
          </View>
          <View style={styles.stat}>
            <Users size={16} color={colors.textLight} />
            <Text style={styles.statText}>
              {challenge.participants.length} participants
            </Text>
          </View>
          <View style={styles.stat}>
            <Trophy size={16} color={colors.textLight} />
            <Text style={styles.statText}>
              {challenge.rewards.points} pts
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  image: {
    width: "100%",
    height: 160,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
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
    fontSize: 12,
    fontWeight: "500",
  },
  description: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: "right",
  },
  stats: {
    flexDirection: "row",
    gap: 16,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: colors.textLight,
  },
});