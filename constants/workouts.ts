export const workoutPresets = [
  {
    key: "pushups",
    name: "Push Ups",
    emoji: "💪",
    beginner: { reps: 10, description: "Standard push-ups, chest to floor" },
    medium: { reps: 20, description: "Full range push-ups, controlled tempo" },
    advanced: { reps: 30, description: "Diamond push-ups or archer push-ups" },
  },
  {
    key: "squats",
    name: "Squats",
    emoji: "🏋️",
    beginner: { reps: 15, description: "Bodyweight squats, full depth" },
    medium: { reps: 25, description: "Goblet squats or jump squats" },
    advanced: { reps: 40, description: "Pistol squats or box jumps" },
  },
  {
    key: "plank",
    name: "Plank Hold",
    emoji: "⏱️",
    beginner: { duration: 30, description: "Standard plank, core tight" },
    medium: { duration: 60, description: "Plank with shoulder taps" },
    advanced: { duration: 90, description: "Side plank or plank jack" },
  },
  {
    key: "mountain_climbers",
    name: "Mountain Climbers",
    emoji: "🔥",
    beginner: { duration: 30, description: "Slow and controlled" },
    medium: { duration: 45, description: "Faster pace, knees to chest" },
    advanced: { duration: 60, description: "High speed, cross-body" },
  },
  {
    key: "burpees",
    name: "Burpees",
    emoji: "🏃",
    beginner: { reps: 5, description: "Step-back burpees, no jump" },
    medium: { reps: 10, description: "Standard burpees with jump" },
    advanced: { reps: 15, description: "Burpees with push-up and tuck jump" },
  },
  {
    key: "lunges",
    name: "Lunges",
    emoji: "🦵",
    beginner: { reps: 10, description: "Static lunges, alternating" },
    medium: { reps: 20, description: "Walking lunges or reverse lunges" },
    advanced: { reps: 30, description: "Jump lunges or curtsy lunges" },
  },
  {
    key: "pullups",
    name: "Pull Ups",
    emoji: "🙆",
    beginner: { reps: 3, description: "Assisted or negative pull-ups" },
    medium: { reps: 8, description: "Strict full pull-ups" },
    advanced: { reps: 12, description: "Muscle-ups or weighted pull-ups" },
  },
  {
    key: "dips",
    name: "Dips",
    emoji: "⬇️",
    beginner: { reps: 5, description: "Bench dips, controlled" },
    medium: { reps: 12, description: "Parallel bar dips" },
    advanced: { reps: 20, description: "Ring dips or weighted dips" },
  },
  {
    key: "jumping_jacks",
    name: "Jumping Jacks",
    emoji: "⭐",
    beginner: { duration: 30, description: "Slow, full range of motion" },
    medium: { duration: 60, description: "Medium pace, arms fully extended" },
    advanced: { duration: 90, description: "High intensity, minimal rest" },
  },
  {
    key: "situps",
    name: "Sit Ups",
    emoji: "🧘",
    beginner: { reps: 15, description: "Standard sit-ups, controlled" },
    medium: { reps: 30, description: "Tuck-ups or v-ups" },
    advanced: { reps: 50, description: "Pike sit-ups or leg raises" },
  },
];

export const getWorkoutPoints = (level: "beginner" | "medium" | "advanced") => {
  switch (level) {
    case "beginner":
      return 10;
    case "medium":
      return 20;
    case "advanced":
      return 30;
  }
};

export const getWorkoutDetails = (
  key: string,
  level: "beginner" | "medium" | "advanced"
) => {
  const workout = workoutPresets.find((w) => w.key === key);
  if (!workout) return null;
  return workout[level];
};