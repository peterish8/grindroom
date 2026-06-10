import { useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
  useDerivedValue,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

interface WorkoutCardProps {
  emoji: string;
  name: string;
  detail: string;
  points: number;
  isSelected?: boolean;
  isCompleted?: boolean;
  onPress: () => void;
}

const SPRING = { damping: 18, stiffness: 400, mass: 0.8 };

export function WorkoutCard({
  emoji,
  name,
  detail,
  points,
  isSelected,
  isCompleted,
  onPress,
}: WorkoutCardProps) {
  const selected = useSharedValue(isSelected ? 1 : 0);
  const checkScale = useSharedValue(isCompleted ? 1 : 0);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    selected.value = withSpring(isSelected ? 1 : 0, SPRING);
  }, [isSelected]);

  useEffect(() => {
    checkScale.value = withSpring(isCompleted ? 1 : 0, { damping: 14, stiffness: 500, mass: 0.6 });
  }, [isCompleted]);

  const borderProgress = useDerivedValue(() => selected.value);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
    borderWidth: 1.5,
    borderColor: interpolateColor(
      borderProgress.value,
      [0, 1],
      ["#222222", "#C8F135"]
    ),
    boxShadow: selected.value > 0.5
      ? `0 0 ${20 * selected.value}px rgba(200, 241, 53, ${0.18 * selected.value})`
      : "none",
  }));

  const iconBgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      borderProgress.value,
      [0, 1],
      ["#242424", "#1e2800"]
    ),
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkScale.value,
  }));

  return (
    <Pressable
      onPressIn={() => {
        pressScale.value = withSpring(0.96, SPRING);
        if (Platform.OS === "ios") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
      onPressOut={() => {
        pressScale.value = withSpring(1, SPRING);
      }}
      onPress={onPress}
    >
      <Animated.View
        style={[
          {
            backgroundColor: "#141414",
            borderRadius: 20,
            borderCurve: "continuous",
            padding: 16,
            position: "relative",
            minHeight: 130,
          },
          containerStyle,
        ]}
      >
        {/* Icon */}
        <Animated.View
          style={[
            {
              width: 38,
              height: 38,
              borderRadius: 10,
              borderCurve: "continuous",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            },
            iconBgStyle,
          ]}
        >
          <Text style={{ fontSize: 20 }}>{emoji}</Text>
        </Animated.View>

        {/* Name */}
        <Text
          style={{
            fontSize: 13,
            fontWeight: "700",
            color: "#ffffff",
            marginBottom: 3,
            letterSpacing: -0.1,
          }}
          numberOfLines={1}
        >
          {name}
        </Text>

        {/* Detail */}
        <Text
          style={{
            fontSize: 11,
            color: "#555555",
            fontWeight: "500",
          }}
        >
          {detail}
        </Text>

        {/* Points badge */}
        <View
          style={{
            position: "absolute",
            bottom: 12,
            right: 12,
            backgroundColor: "rgba(200, 241, 53, 0.1)",
            paddingHorizontal: 7,
            paddingVertical: 3,
            borderRadius: 6,
          }}
        >
          <Text
            style={{
              fontSize: 9,
              fontWeight: "800",
              color: "#C8F135",
              letterSpacing: 0.3,
              fontVariant: ["tabular-nums"],
            }}
          >
            +{points} PTS
          </Text>
        </View>

        {/* Completed check */}
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 10,
              right: 10,
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: "#C8F135",
              alignItems: "center",
              justifyContent: "center",
            },
            checkStyle,
          ]}
        >
          <Text style={{ fontSize: 12, fontWeight: "800", color: "#0e0e0e" }}>✓</Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}
