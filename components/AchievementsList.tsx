import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";
import type { Achievement } from "@/types/user";
import { Award, Beef, Dumbbell, Sunrise, Timer } from "lucide-react-native";

interface AchievementsListProps {
  achievements: Achievement[];
}

export function AchievementsList({ achievements }: AchievementsListProps) {
  const getIconForAchievement = (iconName: string) => {
    switch (iconName) {
      case "Sunrise":
        return <Sunrise size={20} color={colors.background} />;
      case "Beef":
        return <Beef size={20} color={colors.background} />;
      case "Dumbbell":
        return <Dumbbell size={20} color={colors.background} />;
      case "Timer":
        return <Timer size={20} color={colors.background} />;
      default:
        return <Award size={20} color={colors.background} />;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Achievements</Text>
      
      <View style={styles.achievementsList}>
        {achievements.map((achievement) => (
          <View key={achievement.id} style={styles.achievementItem}>
            <View style={styles.achievementIcon}>
              {getIconForAchievement(achievement.iconName)}
            </View>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.achievementDescription}>
                {achievement.description}
              </Text>
            </View>
            <View style={styles.achievementPoints}>
              <Text style={styles.pointsText}>{achievement.points}</Text>
              <Text style={styles.pointsLabel}>pts</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  achievementDescription: {
    fontSize: 14,
    color: colors.textLight,
  },
  achievementPoints: {
    alignItems: "center",
  },
  pointsText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
  },
  pointsLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
});