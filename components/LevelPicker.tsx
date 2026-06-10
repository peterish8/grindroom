import { useEffect } from "react";
import { View, Text, Pressable, LayoutChangeEvent } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

interface LevelPickerProps {
  selectedLevel: "beginner" | "medium" | "advanced";
  onSelect: (level: "beginner" | "medium" | "advanced") => void;
}

const LEVELS: Array<{ key: "beginner" | "medium" | "advanced"; label: string; pts: string }> = [
  { key: "beginner", label: "Beginner", pts: "10 pts" },
  { key: "medium",   label: "Medium",   pts: "20 pts" },
  { key: "advanced", label: "Advanced", pts: "30 pts" },
];

const SPRING = { damping: 20, stiffness: 300, mass: 0.8 };

export function LevelPicker({ selectedLevel, onSelect }: LevelPickerProps) {
  const selectedIndex = LEVELS.findIndex((l) => l.key === selectedLevel);
  const indicatorX = useSharedValue(0);
  const containerWidth = useSharedValue(0);

  useEffect(() => {
    if (containerWidth.value > 0) {
      const segmentW = containerWidth.value / 3;
      indicatorX.value = withSpring(selectedIndex * segmentW, SPRING);
    }
  }, [selectedIndex, containerWidth.value]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: containerWidth.value / 3,
  }));

  const handleLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    containerWidth.value = w;
    indicatorX.value = selectedIndex * (w / 3);
  };

  return (
    <View
      onLayout={handleLayout}
      style={{
        flexDirection: "row",
        backgroundColor: "#111111",
        borderRadius: 12,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: "#1E1E1E",
        padding: 3,
        position: "relative",
      }}
    >
      {/* Sliding indicator */}
      <Animated.View
        style={[
          indicatorStyle,
          {
            position: "absolute",
            top: 3,
            bottom: 3,
            left: 3,
            backgroundColor: "#1A1A1A",
            borderRadius: 9,
            borderCurve: "continuous",
            boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
          },
        ]}
      />

      {LEVELS.map(({ key, label, pts }, i) => {
        const isActive = key === selectedLevel;
        return (
          <Pressable
            key={key}
            style={{ flex: 1, alignItems: "center", paddingVertical: 10, gap: 2 }}
            onPress={() => {
              Haptics.selectionAsync();
              onSelect(key);
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: isActive ? "700" : "500",
                color: isActive ? "#ffffff" : "#555555",
                letterSpacing: -0.1,
              }}
            >
              {label}
            </Text>
            <Text
              style={{
                fontSize: 10,
                fontWeight: "700",
                color: isActive ? "#C8F135" : "#333333",
                letterSpacing: 0.3,
              }}
            >
              {pts}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
