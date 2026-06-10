import { create } from "zustand";

interface UIState {
  selectedLevel: "beginner" | "medium" | "advanced";
  selectedWorkout: string | null;
  setSelectedLevel: (level: "beginner" | "medium" | "advanced") => void;
  setSelectedWorkout: (key: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedLevel: "beginner",
  selectedWorkout: null,
  setSelectedLevel: (level) => set({ selectedLevel: level }),
  setSelectedWorkout: (key) => set({ selectedWorkout: key }),
}));