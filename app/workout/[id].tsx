import { useState, useRef, useEffect } from "react";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, View, Pressable, Modal, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Clock, Dumbbell, Flame, Play, ChevronDown, ChevronUp, CheckCircle, ArrowLeft, Pause, X, ArrowRight } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { workouts } from "@/mocks/workouts";
import { BackButton } from "@/components/BackButton";

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const workout = workouts.find((w) => w.id === id);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [activeWorkout, setActiveWorkout] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  if (!workout) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ 
          title: "Workout not found",
          headerLeft: () => <BackButton />
        }} />
        <View style={styles.content}>
          <Text style={styles.title}>Workout not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const toggleExercise = (exerciseId: string) => {
    if (expandedExercise === exerciseId) {
      setExpandedExercise(null);
    } else {
      setExpandedExercise(exerciseId);
    }
  };

  const handleStartWorkout = () => {
    setActiveWorkout(true);
    setCurrentExerciseIndex(0);
    setCurrentSet(1);
    setIsResting(false);
    const currentExercise = workout.exercises[0];
    setTimeLeft(currentExercise.duration || 0);
    if (currentExercise.duration) {
      startTimer();
    }
  };

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          
          // If we're resting, move to the next set or exercise
          if (isResting) {
            handleRestComplete();
          }
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleRestComplete = () => {
    const currentExercise = workout.exercises[currentExerciseIndex];
    
    if (currentSet < currentExercise.sets) {
      // Move to next set
      setCurrentSet(currentSet + 1);
      setIsResting(false);
    } else {
      // Move to next exercise
      handleNextExercise();
    }
  };

  const handlePauseResume = () => {
    if (isPaused) {
      startTimer();
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPaused(!isPaused);
  };

  const handleCompleteSet = () => {
    const currentExercise = workout.exercises[currentExerciseIndex];
    
    if (currentSet < currentExercise.sets) {
      // Start rest timer
      setIsResting(true);
      setTimeLeft(currentExercise.restTime);
      startTimer();
    } else {
      // Move to next exercise
      handleNextExercise();
    }
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSet(1);
      setIsResting(false);
      const nextExercise = workout.exercises[currentExerciseIndex + 1];
      setTimeLeft(nextExercise.duration || 0);
      if (nextExercise.duration && !isPaused) {
        startTimer();
      }
    } else {
      // Workout complete
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      Alert.alert(
        "Workout Complete",
        "Great job! You've completed your workout.",
        [{ text: "OK", onPress: () => setActiveWorkout(false) }]
      );
      setCurrentExerciseIndex(0);
      setCurrentSet(1);
    }
  };

  const handleCloseWorkout = () => {
    Alert.alert(
      "End Workout",
      "Are you sure you want to end this workout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "End Workout", 
          style: "destructive",
          onPress: () => {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            setActiveWorkout(false);
            setCurrentExerciseIndex(0);
            setCurrentSet(1);
            setIsPaused(false);
          }
        }
      ]
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentExercise = workout.exercises[currentExerciseIndex];

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen options={{ 
        title: workout.title,
        headerLeft: () => <BackButton />
      }} />
      <ScrollView>
        <Image source={{ uri: workout.imageUrl }} style={styles.image} />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{workout.title}</Text>
            <View style={[styles.badge, styles[`badge_${workout.difficulty}`]]}>
              <Text style={styles.badgeText}>
                {workout.difficulty.charAt(0).toUpperCase() + workout.difficulty.slice(1)}
              </Text>
            </View>
          </View>

          <Text style={styles.description}>{workout.description}</Text>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Clock size={20} color={colors.textLight} />
              <Text style={styles.statText}>{workout.duration} min</Text>
            </View>
            <View style={styles.stat}>
              <Flame size={20} color={colors.textLight} />
              <Text style={styles.statText}>{workout.calories} cal</Text>
            </View>
            <View style={styles.stat}>
              <Dumbbell size={20} color={colors.textLight} />
              <Text style={styles.statText}>{workout.exercises.length} exercises</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Equipment Needed</Text>
          <View style={styles.equipmentList}>
            <View style={styles.equipmentItem}>
              <CheckCircle size={16} color={colors.success} />
              <Text style={styles.equipmentText}>Dumbbells</Text>
            </View>
            <View style={styles.equipmentItem}>
              <CheckCircle size={16} color={colors.success} />
              <Text style={styles.equipmentText}>Yoga Mat</Text>
            </View>
            {workout.difficulty === "advanced" && (
              <View style={styles.equipmentItem}>
                <CheckCircle size={16} color={colors.success} />
                <Text style={styles.equipmentText}>Resistance Bands</Text>
              </View>
            )}
          </View>

          <Text style={styles.sectionTitle}>Exercises</Text>
          {workout.exercises.map((exercise, index) => (
            <View key={exercise.id} style={styles.exercise}>
              <Pressable 
                style={styles.exerciseHeader}
                onPress={() => toggleExercise(exercise.id)}
              >
                <View style={styles.exerciseTitle}>
                  <Text style={styles.exerciseNumber}>{index + 1}</Text>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                </View>
                <View style={styles.exerciseHeaderRight}>
                  <Text style={styles.exerciseDetail}>
                    {exercise.duration
                      ? `${exercise.duration}s`
                      : `${exercise.sets} × ${exercise.reps}`}
                  </Text>
                  {expandedExercise === exercise.id ? (
                    <ChevronUp size={20} color={colors.textLight} />
                  ) : (
                    <ChevronDown size={20} color={colors.textLight} />
                  )}
                </View>
              </Pressable>
              
              {expandedExercise === exercise.id && (
                <View style={styles.exerciseDetails}>
                  <View style={styles.exerciseDetailItem}>
                    <Text style={styles.detailLabel}>Sets:</Text>
                    <Text style={styles.detailValue}>{exercise.sets}</Text>
                  </View>
                  <View style={styles.exerciseDetailItem}>
                    <Text style={styles.detailLabel}>Reps:</Text>
                    <Text style={styles.detailValue}>{exercise.reps}</Text>
                  </View>
                  <View style={styles.exerciseDetailItem}>
                    <Text style={styles.detailLabel}>Rest:</Text>
                    <Text style={styles.detailValue}>{exercise.restTime}s</Text>
                  </View>
                  {exercise.duration && (
                    <View style={styles.exerciseDetailItem}>
                      <Text style={styles.detailLabel}>Duration:</Text>
                      <Text style={styles.detailValue}>{exercise.duration}s</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          ))}
          
          <Pressable 
            style={styles.startButton}
            onPress={handleStartWorkout}
          >
            <Play size={20} color={colors.background} />
            <Text style={styles.startButtonText}>Start Workout</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Active Workout Modal */}
      <Modal
        visible={activeWorkout}
        animationType="slide"
        transparent={false}
        onRequestClose={handleCloseWorkout}
      >
        <SafeAreaView style={styles.activeWorkoutContainer}>
          <View style={styles.activeWorkoutHeader}>
            <Pressable onPress={handleCloseWorkout} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </Pressable>
            <Text style={styles.activeWorkoutTitle}>{workout.title}</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.activeWorkoutContent}>
            <View style={styles.exerciseProgress}>
              <Text style={styles.exerciseProgressText}>
                Exercise {currentExerciseIndex + 1} of {workout.exercises.length}
              </Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${((currentExerciseIndex + 1) / workout.exercises.length) * 100}%` }
                  ]} 
                />
              </View>
            </View>

            <View style={styles.currentExerciseContainer}>
              <Text style={styles.currentExerciseName}>{currentExercise.name}</Text>
              
              {isResting ? (
                <View style={styles.restingContainer}>
                  <Text style={styles.restingText}>Rest Time</Text>
                  <Text style={styles.restingSubtext}>Next set starting soon</Text>
                </View>
              ) : (
                <View style={styles.exerciseInfoRow}>
                  <View style={styles.exerciseInfoItem}>
                    <Text style={styles.infoLabel}>Set</Text>
                    <Text style={styles.infoValue}>{currentSet}/{currentExercise.sets}</Text>
                  </View>
                  <View style={styles.exerciseInfoItem}>
                    <Text style={styles.infoLabel}>Reps</Text>
                    <Text style={styles.infoValue}>{currentExercise.reps}</Text>
                  </View>
                  <View style={styles.exerciseInfoItem}>
                    <Text style={styles.infoLabel}>Rest</Text>
                    <Text style={styles.infoValue}>{currentExercise.restTime}s</Text>
                  </View>
                </View>
              )}

              {(timeLeft > 0 || isResting) && (
                <View style={styles.timerContainer}>
                  <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                  {timeLeft > 0 && (
                    <Pressable 
                      style={styles.timerButton}
                      onPress={handlePauseResume}
                    >
                      {isPaused ? (
                        <Play size={24} color={colors.text} />
                      ) : (
                        <Pause size={24} color={colors.text} />
                      )}
                    </Pressable>
                  )}
                </View>
              )}

              <View style={styles.controlsContainer}>
                {!isResting && (
                  <Pressable 
                    style={[styles.controlButton, styles.completeButton]}
                    onPress={handleCompleteSet}
                  >
                    <Text style={styles.completeButtonText}>
                      {currentExercise.duration ? 'Skip' : 'Complete Set'}
                    </Text>
                    <CheckCircle size={20} color={colors.background} />
                  </Pressable>
                )}
                
                <Pressable 
                  style={[styles.controlButton, styles.nextButton]}
                  onPress={handleNextExercise}
                >
                  <Text style={styles.nextButtonText}>
                    {currentExerciseIndex < workout.exercises.length - 1 ? 'Next Exercise' : 'Finish Workout'}
                  </Text>
                  <ArrowRight size={20} color={colors.background} />
                </Pressable>
              </View>
            </View>

            <View style={styles.upcomingExercises}>
              <Text style={styles.upcomingTitle}>Up Next</Text>
              {currentExerciseIndex < workout.exercises.length - 1 ? (
                <View style={styles.upcomingExercise}>
                  <Text style={styles.upcomingName}>
                    {workout.exercises[currentExerciseIndex + 1].name}
                  </Text>
                  <Text style={styles.upcomingDetail}>
                    {workout.exercises[currentExerciseIndex + 1].sets} sets × {workout.exercises[currentExerciseIndex + 1].reps} reps
                  </Text>
                </View>
              ) : (
                <Text style={styles.upcomingComplete}>Workout Complete!</Text>
              )}
            </View>
          </View>
        </SafeAreaView>
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
    height: 300,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  equipmentList: {
    marginBottom: 24,
  },
  equipmentItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  equipmentText: {
    fontSize: 16,
    color: colors.text,
  },
  exercise: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  exerciseTitle: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  exerciseNumber: {
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
  exerciseName: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
  },
  exerciseHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  exerciseDetail: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },
  exerciseDetails: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  exerciseDetailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  startButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
    gap: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.background,
  },
  activeWorkoutContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  activeWorkoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: 4,
  },
  activeWorkoutTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  activeWorkoutContent: {
    flex: 1,
    padding: 16,
  },
  exerciseProgress: {
    marginBottom: 24,
  },
  exerciseProgressText: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  currentExerciseContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentExerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  restingContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  restingText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  restingSubtext: {
    fontSize: 16,
    color: colors.textLight,
  },
  exerciseInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 32,
  },
  exerciseInfoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  timerContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
  },
  timerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  controlsContainer: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    marginBottom: 24,
  },
  controlButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  completeButton: {
    backgroundColor: colors.success,
    flex: 1,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
  nextButton: {
    backgroundColor: colors.primary,
    flex: 1,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
  upcomingExercises: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  upcomingExercise: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    paddingLeft: 12,
  },
  upcomingName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  upcomingDetail: {
    fontSize: 14,
    color: colors.textLight,
  },
  upcomingComplete: {
    fontSize: 16,
    color: colors.success,
    fontWeight: '500',
  },
});