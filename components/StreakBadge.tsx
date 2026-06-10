import { View, StyleSheet, TextStyle } from "react-native";
import { AnimatedNumber } from "@/components/animations";

interface StreakBadgeProps {
  streak: number;
  size?: "small" | "medium" | "large";
}

const sizeConfig = {
  small: { fontSize: 12, padding: 6, emoji: 14 },
  medium: { fontSize: 14, padding: 8, emoji: 14 },
  large: { fontSize: 18, padding: 12, emoji: 18 },
};

export function StreakBadge({ streak, size = "medium" }: StreakBadgeProps) {
  const cfg = sizeConfig[size];

  return (
    <View style={[styles.container, { paddingHorizontal: cfg.padding, paddingVertical: cfg.padding / 2 }]}>
      <AnimatedNumber
        value={streak}
        suffix={streak === 1 ? " day 🔥" : " days 🔥"}
        style={StyleSheet.flatten([styles.text, { fontSize: cfg.fontSize }]) as TextStyle}
        duration={600}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#C8F135",
    borderRadius: 9999,
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontWeight: "bold",
    color: "#4c5f00",
  },
});
