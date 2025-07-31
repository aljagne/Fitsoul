import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";
import type { WorkoutHistory } from "@/types/user";
import { Calendar, Clock, Flame } from "lucide-react-native";

interface ActivityHistoryProps {
  workouts: WorkoutHistory[];
}

export function ActivityHistory({ workouts }: ActivityHistoryProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Activity</Text>
      
      <View style={styles.activityList}>
        {workouts.map((workout, index) => (
          <View key={index} style={styles.activityItem}>
            <View style={styles.activityDate}>
              <Calendar size={16} color={colors.textLight} />
              <Text style={styles.dateText}>{formatDate(workout.date)}</Text>
            </View>
            
            <View style={styles.activityContent}>
              <Text style={styles.workoutName}>{workout.workoutName}</Text>
              
              <View style={styles.workoutStats}>
                <View style={styles.stat}>
                  <Clock size={14} color={colors.textLight} />
                  <Text style={styles.statText}>{workout.duration} min</Text>
                </View>
                
                <View style={styles.stat}>
                  <Flame size={14} color={colors.textLight} />
                  <Text style={styles.statText}>{workout.caloriesBurned} cal</Text>
                </View>
              </View>
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
  activityList: {
    gap: 16,
  },
  activityItem: {
    gap: 8,
  },
  activityDate: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateText: {
    fontSize: 14,
    color: colors.textLight,
  },
  activityContent: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 8,
  },
  workoutStats: {
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