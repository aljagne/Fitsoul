import { StyleSheet, Text, View } from "react-native";
import { Activity, Calendar, Dumbbell, Flame } from "lucide-react-native";
import { colors } from "@/constants/colors";
import type { WeeklyStats } from "@/types/user";

interface ProfileStatsProps {
  stats: WeeklyStats;
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Stats</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
            <Dumbbell size={20} color={colors.primary} />
          </View>
          <Text style={styles.statValue}>{stats.workoutsCompleted}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
            <Activity size={20} color={colors.primary} />
          </View>
          <Text style={styles.statValue}>{stats.workoutMinutes}</Text>
          <Text style={styles.statLabel}>Minutes</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
            <Flame size={20} color={colors.primary} />
          </View>
          <Text style={styles.statValue}>{stats.caloriesBurned}</Text>
          <Text style={styles.statLabel}>Calories</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
            <Calendar size={20} color={colors.primary} />
          </View>
          <Text style={styles.statValue}>{stats.streakDays}</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
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
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + "10",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
});