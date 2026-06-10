import { useEffect, useMemo } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  withSpring,
  withDelay,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const PARTICLE_COUNT = 18;
const SPRING = { damping: 8, stiffness: 200, mass: 0.6 };
const COLORS = ["#C8F135", "#ffffff", "#FFD700", "#4c5f00", "#a8d400"];

interface SuccessCelebrationProps {
  visible: boolean;
}

function Particle({ color, size, delay }: { color: string; size: number; delay: number }) {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  const targetX = useMemo(() => (Math.random() - 0.5) * SCREEN_W * 0.9, []);
  const targetY = useMemo(() => -(Math.random() * SCREEN_H * 0.6 + 80), []);

  useEffect(() => {
    x.value = withDelay(delay, withSpring(targetX, SPRING));
    y.value = withDelay(delay, withSpring(targetY, SPRING));
    opacity.value = withDelay(delay, withTiming(1, { duration: 100 }));
    scale.value = withDelay(delay, withSpring(1, SPRING));
    opacity.value = withDelay(
      delay + 700,
      withTiming(0, { duration: 500 })
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
        animStyle,
      ]}
    />
  );
}

export function SuccessCelebration({ visible }: SuccessCelebrationProps) {
  if (!visible) return null;

  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        color: COLORS[i % COLORS.length],
        size: Math.random() * 8 + 6,
        delay: Math.random() * 200,
      })),
    []
  );

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((p) => (
        <Particle key={p.id} color={p.color} size={p.size} delay={p.delay} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 120,
    zIndex: 999,
  },
  particle: {
    position: "absolute",
  },
});
