import { useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useConvexAuth } from "convex/react";
import { useQuery, useMutation } from "convex/react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { api } from "../../convex/_generated/api";
import { workoutPresets, getWorkoutPoints } from "../../constants/workouts";
import { useUIStore } from "../../store/uiStore";
import { LevelPicker } from "@/components/LevelPicker";
import { WorkoutCard } from "@/components/WorkoutCard";
import { StaggeredList, SuccessCelebration, ScalePress } from "@/components/animations";

export default function LogScreen() {
  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { selectedLevel, setSelectedLevel, selectedWorkout, setSelectedWorkout } = useUIStore();
  const todayLogs = useQuery(api.workoutLogs.getTodayLogs);
  const logWorkout = useMutation(api.workoutLogs.logWorkout);
  const [showCelebration, setShowCelebration] = useState(false);

  if (!isAuthenticated) {
    router.replace("/(auth)/splash");
    return null;
  }

  const selectedDetails = selectedWorkout
    ? workoutPresets.find((w) => w.key === selectedWorkout)?.[selectedLevel]
    : null;

  const handleLogWorkout = async () => {
    if (!selectedWorkout) return;
    try {
      await logWorkout({ workoutKey: selectedWorkout, level: selectedLevel });
      const newCount = (todayLogs?.length ?? 0) + 1;
      if (newCount >= 5) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2200);
      }
      setSelectedWorkout(null);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to log workout. Please try again.");
    }
  };

  const isWorkoutCompletedToday = (workoutKey: string) =>
    todayLogs?.some((log) => log.workoutKey === workoutKey) ?? false;

  const pts = getWorkoutPoints(selectedLevel);

  return (
    <View style={{ flex: 1, backgroundColor: "#0e0e0e" }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: insets.top + 16,
          paddingBottom: 8,
        }}
      >
        <Text style={{ fontSize: 11, color: "#444444", fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
          Log Workout
        </Text>
        <Text style={{ fontSize: 28, fontWeight: "800", color: "#ffffff", letterSpacing: -0.8 }}>
          What'd you do?
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 180 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Level Picker */}
        <View style={{ marginTop: 20, marginBottom: 28 }}>
          <LevelPicker selectedLevel={selectedLevel} onSelect={setSelectedLevel} />
        </View>

        {/* Workout Grid */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <StaggeredList baseDelay={50} staggerMs={35}>
            {workoutPresets.map((workout) => {
              const details = workout[selectedLevel];
              const detailText = details.reps ? `${details.reps} reps` : `${details.duration}s`;
              return (
                <View key={workout.key} style={{ width: "47.5%" }}>
                  <WorkoutCard
                    emoji={workout.emoji}
                    name={workout.name}
                    detail={detailText}
                    points={pts}
                    isSelected={selectedWorkout === workout.key}
                    isCompleted={isWorkoutCompletedToday(workout.key)}
                    onPress={() => setSelectedWorkout(workout.key)}
                  />
                </View>
              );
            })}
          </StaggeredList>
        </View>

        {/* Selected Workout Details */}
        {selectedWorkout && selectedDetails && (
          <View
            style={{
              backgroundColor: "#141414",
              borderRadius: 20,
              borderCurve: "continuous",
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(200,241,53,0.2)",
              borderLeftWidth: 3,
              borderLeftColor: "#C8F135",
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: "700", color: "#ffffff", marginBottom: 8, letterSpacing: -0.2 }}>
              {workoutPresets.find((w) => w.key === selectedWorkout)?.name}
            </Text>
            <Text style={{ fontSize: 13, color: "#555555", lineHeight: 20 }}>
              {selectedDetails.description}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Done Button */}
      {selectedWorkout && (
        <View
          style={{
            position: "absolute",
            bottom: insets.bottom + 72,
            left: 24,
            right: 24,
          }}
        >
          <ScalePress
            onPress={handleLogWorkout}
            style={{
              backgroundColor: "#C8F135",
              borderRadius: 9999,
              paddingVertical: 18,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 0 32px rgba(200,241,53,0.35)",
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: "800", color: "#0e0e0e", letterSpacing: -0.2 }}>
              Done — +{pts} pts
            </Text>
            <Text style={{ fontSize: 18 }}>⚡</Text>
          </ScalePress>
        </View>
      )}

      <SuccessCelebration visible={showCelebration} />
    </View>
  );
}
