import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { StyleProp, ViewStyle } from "react-native";

const SPRING = { damping: 15, stiffness: 500, mass: 0.8 };

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  style?: StyleProp<ViewStyle>;
}

export function FadeIn({
  children,
  delay = 0,
  direction = "up",
  distance = 18,
  style,
}: FadeInProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(
    direction === "up" ? distance : direction === "down" ? -distance : 0
  );
  const translateX = useSharedValue(
    direction === "left" ? distance : direction === "right" ? -distance : 0
  );

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
    ],
  }));

  useEffect(() => {
    opacity.value = withDelay(delay, withSpring(1, SPRING));
    translateY.value = withDelay(delay, withSpring(0, SPRING));
    translateX.value = withDelay(delay, withSpring(0, SPRING));
  }, []);

  return (
    <Animated.View style={[animStyle, style]}>
      {children}
    </Animated.View>
  );
}
