import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { useConvexAuth } from "convex/react";
import { ArrowRight } from "lucide-react-native";
import { BackButton, DisplayText, Eyebrow, PrimaryButton, StepRail, grind } from "@/components/GrindUI";

const suggestions = ["5AM Warriors", "The Grind House", "No Excuses", "Iron Pact"];

export default function CreateRoomNameScreen() {
  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();
  const [roomName, setRoomName] = useState("");

  if (!isAuthenticated) {
    router.replace("/(auth)/splash");
    return null;
  }

  const trimmedName = roomName.trim();

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.topbar}>
        <BackButton onPress={() => router.back()} />
        <StepRail step={1} />
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.heading}>
        <Eyebrow>Step 1 of 2</Eyebrow>
        <DisplayText style={styles.title}>NAME YOUR{"\n"}ROOM<Text style={{ color: grind.accent }}>.</Text></DisplayText>
        <Text style={styles.copy}>Pick something your squad will rally behind. You can't hide from a name like "5AM Warriors".</Text>
      </View>

      <View style={styles.nameRow}>
        <TextInput
          autoFocus
          value={roomName}
          onChangeText={setRoomName}
          maxLength={24}
          placeholder="Alpha Squad"
          placeholderTextColor="#333333"
          style={styles.nameInput}
        />
        <Text style={styles.count}>{roomName.length}/24</Text>
      </View>

      <View style={styles.chips}>
        {suggestions.map((suggestion) => (
          <Pressable key={suggestion} onPress={() => setRoomName(suggestion)} style={styles.chip}>
            <Text style={styles.chipText}>{suggestion}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.previewArea}>
        <Eyebrow style={{ marginBottom: 10 }}>Preview</Eyebrow>
        <View style={styles.preview}>
          <View style={styles.live}><View style={styles.dot} /><Text style={styles.liveText}>LIVE</Text></View>
          <DisplayText style={styles.previewName}>{trimmedName || "ALPHA SQUAD"}</DisplayText>
          <Text style={styles.previewMeta}>1 member · You're #1 (for now)</Text>
        </View>
      </View>

      <View style={styles.bottom}>
        <PrimaryButton
          disabled={trimmedName.length < 3}
          onPress={() => router.push({ pathname: "/create-room/settings", params: { name: trimmedName } })}
          icon={<ArrowRight size={17} color={grind.background} strokeWidth={2.5} />}
        >
          Continue
        </PrimaryButton>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: grind.background },
  topbar: { paddingTop: 56, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  heading: { paddingHorizontal: 28, marginTop: 40, gap: 8 },
  title: { fontSize: 38, lineHeight: 40, letterSpacing: -0.4 },
  copy: { color: grind.muted, fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 20, marginTop: 6 },
  nameRow: { marginHorizontal: 24, marginTop: 36, paddingBottom: 10, borderBottomWidth: 2, borderBottomColor: grind.accent, flexDirection: "row", alignItems: "flex-end" },
  nameInput: { flex: 1, color: grind.text, fontFamily: "Oswald_600SemiBold", fontSize: 30, padding: 0 },
  count: { color: grind.quiet, fontFamily: "Inter_700Bold", fontSize: 11 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingHorizontal: 24, marginTop: 24 },
  chip: { borderWidth: 1, borderColor: grind.border, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14 },
  chipText: { color: grind.muted, fontFamily: "Inter_600SemiBold", fontSize: 11 },
  previewArea: { marginHorizontal: 24, marginTop: 32 },
  preview: { backgroundColor: grind.surface, borderRadius: 20, borderWidth: 1, borderColor: "rgba(200,241,53,0.2)", padding: 18 },
  live: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: grind.accent },
  liveText: { color: grind.accent, fontFamily: "Inter_800ExtraBold", fontSize: 10, letterSpacing: 1 },
  previewName: { fontSize: 21, textTransform: "uppercase" },
  previewMeta: { color: "#444444", fontFamily: "Inter_400Regular", fontSize: 11, marginTop: 4 },
  bottom: { marginTop: "auto", paddingHorizontal: 24, paddingBottom: 42 },
});
