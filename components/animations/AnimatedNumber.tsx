import { useState, useEffect } from "react";
import {
  useSharedValue,
  withTiming,
  useAnimatedReaction,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { Text, TextStyle } from "react-native";

interface AnimatedNumberProps {
  value: number;
  style?: TextStyle;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export function AnimatedNumber({
  value,
  style,
  duration = 800,
  suffix = "",
  prefix = "",
}: AnimatedNumberProps) {
  const animValue = useSharedValue(0);
  const [display, setDisplay] = useState(0);

  useAnimatedReaction(
    () => Math.round(animValue.value),
    (current, prev) => {
      if (current !== prev) {
        runOnJS(setDisplay)(current);
      }
    }
  );

  useEffect(() => {
    animValue.value = withTiming(value, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [value]);

  return (
    <Text style={style}>
      {prefix}{display}{suffix}
    </Text>
  );
}
