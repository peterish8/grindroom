import { ComponentProps, PropsWithChildren, ReactNode } from "react";
import { Pressable, StyleProp, Text, TextStyle, View, ViewStyle } from "react-native";
import { ChevronLeft } from "lucide-react-native";

export const grind = {
  background: "#0A0A0A",
  surface: "#141414",
  surfaceRaised: "#1A1A1A",
  border: "#1E1E1E",
  accent: "#C8F135",
  text: "#FFFFFF",
  muted: "#555555",
  quiet: "#333333",
  danger: "#FF6B51",
};

export function DisplayText({
  children,
  style,
  ...props
}: PropsWithChildren<{ style?: StyleProp<TextStyle> } & ComponentProps<typeof Text>>) {
  return (
    <Text
      {...props}
      style={[{ fontFamily: "Oswald_700Bold", color: grind.text }, style]}
    >
      {children}
    </Text>
  );
}

export function Eyebrow({ children, style }: PropsWithChildren<{ style?: StyleProp<TextStyle> }>) {
  return (
    <Text
      style={[
        {
          color: "#444444",
          fontFamily: "Inter_700Bold",
          fontSize: 10,
          letterSpacing: 1.2,
          textTransform: "uppercase",
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export function PrimaryButton({
  children,
  onPress,
  disabled,
  icon,
  style,
}: PropsWithChildren<{
  onPress?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
}>) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          minHeight: 56,
          borderRadius: 999,
          backgroundColor: grind.accent,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 8,
          opacity: disabled ? 0.42 : pressed ? 0.82 : 1,
          shadowColor: grind.accent,
          shadowOpacity: disabled ? 0 : 0.28,
          shadowRadius: 18,
          elevation: disabled ? 0 : 8,
        },
        style,
      ]}
    >
      <Text style={{ color: grind.background, fontFamily: "Inter_800ExtraBold", fontSize: 15 }}>
        {children}
      </Text>
      {icon}
    </Pressable>
  );
}

export function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      onPress={onPress}
      style={({ pressed }) => ({
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: grind.surface,
        borderWidth: 1,
        borderColor: grind.border,
        alignItems: "center",
        justifyContent: "center",
        opacity: pressed ? 0.65 : 1,
      })}
    >
      <ChevronLeft size={19} color={grind.text} strokeWidth={2} />
    </Pressable>
  );
}

export function StepRail({ step }: { step: 1 | 2 }) {
  return (
    <View style={{ flexDirection: "row", gap: 6 }}>
      {[1, 2].map((item) => (
        <View
          key={item}
          style={{
            width: 24,
            height: 4,
            borderRadius: 2,
            backgroundColor: item <= step ? grind.accent : grind.border,
          }}
        />
      ))}
    </View>
  );
}
