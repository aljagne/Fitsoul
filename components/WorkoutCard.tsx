import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Clock, Dumbbell, Flame } from "lucide-react-native";
import { colors } from "@/constants/colors";
import type { Workout } from "@/types/workout";
import { router } from "expo-router";

interface WorkoutCardProps {
  workout: Workout;
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
  return (
    <Pressable 
      style={styles.card}
      onPress={() => router.push(`/workout/${workout.id}`)}
    >
      <Image 
        source={{ uri: workout.imageUrl }} 
        style={styles.image}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{workout.title}</Text>
          <View style={[styles.badge, styles[`badge_${workout.difficulty}`]]}>
            <Text style={styles.badgeText}>
              {workout.difficulty.charAt(0).toUpperCase() + workout.difficulty.slice(1)}
            </Text>
          </View>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {workout.description}
        </Text>
        
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Clock size={16} color={colors.textLight} />
            <Text style={styles.statText}>{workout.duration} min</Text>
          </View>
          <View style={styles.stat}>
            <Flame size={16} color={colors.textLight} />
            <Text style={styles.statText}>{workout.calories} cal</Text>
          </View>
          <View style={styles.stat}>
            <Dumbbell size={16} color={colors.textLight} />
            <Text style={styles.statText}>{workout.exercises.length} exercises</Text>
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
    height: 200,
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
  badge_beginner: {
    backgroundColor: colors.success + "20",
  },
  badge_intermediate: {
    backgroundColor: colors.primary + "20",
  },
  badge_advanced: {
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