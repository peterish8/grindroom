import React from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Pressable, PressableProps, StyleProp, ViewStyle, Platform } from "react-native";
import * as Haptics from "expo-haptics";

const SPRING = { damping: 15, stiffness: 500, mass: 0.8 };

interface ScalePressProps extends Omit<PressableProps, "style"> {
  children: React.ReactNode;
  scaleTo?: number;
  style?: StyleProp<ViewStyle>;
  haptic?: boolean;
}

export function ScalePress({
  children,
  scaleTo = 0.96,
  style,
  onPress,
  onPressIn,
  onPressOut,
  haptic = true,
  ...props
}: ScalePressProps) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={(e) => {
        scale.value = withSpring(scaleTo, SPRING);
        if (haptic && Platform.OS === "ios") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, SPRING);
        onPressOut?.(e);
      }}
      onPress={onPress}
      {...props}
    >
      <Animated.View style={[animStyle, style]}>{children}</Animated.View>
    </Pressable>
  );
}
