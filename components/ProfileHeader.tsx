import { Image, StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";
import type { User } from "@/types/user";
import { Award, MapPin, Trophy } from "lucide-react-native";

interface ProfileHeaderProps {
  user: User;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image 
          source={{ uri: user.avatarUrl }} 
          style={styles.avatar}
        />
      </View>
      
      <Text style={styles.name}>{user.name}</Text>
      
      {user.location && (
        <View style={styles.locationContainer}>
          <MapPin size={14} color={colors.textLight} />
          <Text style={styles.locationText}>{user.location}</Text>
        </View>
      )}
      
      <Text style={styles.bio}>{user.bio}</Text>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Award size={18} color={colors.primary} />
          <Text style={styles.statValue}>{user.totalPoints}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.statItem}>
          <Trophy size={18} color={colors.primary} />
          <Text style={styles.statValue}>{user.challengesCompleted}</Text>
          <Text style={styles.statLabel}>Challenges</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.friends.length}</Text>
          <Text style={styles.statLabel}>Friends</Text>
        </View>
      </View>
      
      <View style={styles.goalsContainer}>
        {user.fitnessGoals.map((goal, index) => (
          <View key={index} style={styles.goalBadge}>
            <Text style={styles.goalText}>
              {goal.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: colors.textLight,
  },
  bio: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: "center",
    marginHorizontal: 24,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  goalsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  goalBadge: {
    backgroundColor: colors.primary + "15",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  goalText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },
});