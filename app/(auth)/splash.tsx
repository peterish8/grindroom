import { View, Text, StyleSheet } from "react-native";
import { Link, useRouter } from "expo-router";
import { ArrowRight, Zap } from "lucide-react-native";
import { DisplayText, PrimaryButton, grind } from "@/components/GrindUI";

export default function SplashScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.glow} />
      <View style={styles.brand}>
        <View style={styles.mark}><Zap size={15} color={grind.background} fill={grind.background} /></View>
        <Text style={styles.wordmark}>GRINDROOM</Text>
      </View>

      <View style={styles.hero}>
        <DisplayText style={styles.line}>GRIND<Text style={{ color: grind.accent }}>.</Text></DisplayText>
        <DisplayText style={[styles.line, styles.outline]}>TOGETHER.</DisplayText>
        <DisplayText style={[styles.line, { color: grind.accent }]}>EVERY DAY.</DisplayText>
        <Text style={styles.copy}>Daily workouts. Live squads. Streaks that actually matter. Your crew is watching.</Text>
      </View>

      <View style={styles.ticker}>
        <Text style={styles.tickerText}>PUSH-UPS   <Text style={styles.x}>×</Text>   SQUATS   <Text style={styles.x}>×</Text>   PLANK   <Text style={styles.x}>×</Text>   BURPEES</Text>
      </View>

      <View style={styles.actions}>
        <PrimaryButton onPress={() => router.push("/(auth)/signup")} icon={<ArrowRight size={17} color={grind.background} strokeWidth={2.5} />}>
          Get Started
        </PrimaryButton>
        <Link href="/(auth)/login" style={styles.signIn}>
          Already grinding? <Text style={{ color: grind.accent, fontFamily: "Inter_700Bold" }}>Sign in</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: grind.background, paddingTop: 64 },
  glow: { position: "absolute", top: -100, right: -145, width: 360, height: 360, borderRadius: 180, backgroundColor: "rgba(200,241,53,0.08)" },
  brand: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 28 },
  mark: { width: 27, height: 27, borderRadius: 7, backgroundColor: grind.accent, alignItems: "center", justifyContent: "center" },
  wordmark: { color: grind.text, fontFamily: "Oswald_600SemiBold", fontSize: 15, letterSpacing: 2.7 },
  hero: { paddingHorizontal: 28, marginTop: 64 },
  line: { fontSize: 68, lineHeight: 68, letterSpacing: -1.2 },
  outline: { color: "#202020", textShadowColor: "#3A3A3A", textShadowRadius: 1 },
  copy: { color: grind.muted, fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 22, maxWidth: 290, marginTop: 24 },
  ticker: { marginTop: 42, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#161616", paddingVertical: 10, overflow: "hidden" },
  tickerText: { color: grind.quiet, fontFamily: "Oswald_600SemiBold", fontSize: 12, letterSpacing: 2.2, width: 620 },
  x: { color: grind.accent },
  actions: { marginTop: "auto", paddingHorizontal: 24, paddingBottom: 44, gap: 16 },
  signIn: { color: grind.muted, textAlign: "center", fontFamily: "Inter_400Regular", fontSize: 13 },
});
