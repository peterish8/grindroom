import { useState } from "react";
import { Alert, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useConvexAuth, useMutation } from "convex/react";
import { Zap } from "lucide-react-native";
import { api } from "../../convex/_generated/api";
import { BackButton, DisplayText, Eyebrow, PrimaryButton, StepRail, grind } from "@/components/GrindUI";

const sizes = [{ value: 4, label: "Tight" }, { value: 8, label: "Classic" }, { value: 12, label: "Crew" }, { value: 20, label: "Army" }];

export default function CreateRoomSettingsScreen() {
  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();
  const { name } = useLocalSearchParams<{ name: string }>();
  const [memberLimit, setMemberLimit] = useState(8);
  const [inviteOnly, setInviteOnly] = useState(true);
  const [restDayGrace, setRestDayGrace] = useState(false);
  const [creating, setCreating] = useState(false);
  const createRoom = useMutation(api.rooms.createRoom);

  if (!isAuthenticated) {
    router.replace("/(auth)/splash");
    return null;
  }

  const handleCreate = async () => {
    if (!name) return;
    setCreating(true);
    try {
      const result = await createRoom({ name, isPublic: !inviteOnly, memberLimit, weeklyRequirement: restDayGrace ? 6 : 7 });
      router.replace({ pathname: "/create-room/success", params: { roomId: result.roomId, inviteCode: result.inviteCode, name } });
    } catch (error: any) {
      Alert.alert("Room not created", error.message || "Please try again.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topbar}><BackButton onPress={() => router.back()} /><StepRail step={2} /><View style={{ width: 40 }} /></View>
      <View style={styles.heading}>
        <Eyebrow>Step 2 of 2</Eyebrow>
        <DisplayText style={styles.title}>SET THE{"\n"}RULES<Text style={{ color: grind.accent }}>.</Text></DisplayText>
      </View>

      <View style={styles.section}>
        <Eyebrow style={{ marginBottom: 12 }}>Squad size</Eyebrow>
        <View style={styles.sizeRow}>
          {sizes.map((size) => {
            const selected = memberLimit === size.value;
            return (
              <Pressable key={size.value} onPress={() => setMemberLimit(size.value)} style={[styles.size, selected && styles.sizeSelected]}>
                <DisplayText style={[styles.sizeNumber, selected && { color: grind.accent }]}>{size.value}</DisplayText>
                <Text style={[styles.sizeLabel, selected && { color: grind.accent }]}>{size.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.switches}>
        <View style={styles.switchRow}><View><Text style={styles.switchTitle}>Invite only</Text><Text style={styles.switchCopy}>Members join with your code</Text></View><Switch value={inviteOnly} onValueChange={setInviteOnly} trackColor={{ false: grind.border, true: grind.accent }} thumbColor={grind.background} /></View>
        <View style={styles.switchRow}><View><Text style={styles.switchTitle}>Rest day grace</Text><Text style={styles.switchCopy}>One missed day won't kill streaks</Text></View><Switch value={restDayGrace} onValueChange={setRestDayGrace} trackColor={{ false: grind.border, true: grind.accent }} thumbColor={restDayGrace ? grind.background : "#444444"} /></View>
      </View>

      <View style={styles.code}>
        <Eyebrow style={{ marginBottom: 10 }}>Your invite code will be</Eyebrow>
        <View style={styles.codeBox}><Text style={styles.dots}>······</Text></View>
      </View>

      <View style={styles.bottom}>
        <PrimaryButton onPress={handleCreate} disabled={creating} icon={<Zap size={17} color={grind.background} fill={grind.background} />}>
          {creating ? "Creating..." : "Create Room"}
        </PrimaryButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: grind.background },
  topbar: { paddingTop: 56, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  heading: { paddingHorizontal: 28, marginTop: 40, gap: 8 },
  title: { fontSize: 38, lineHeight: 40 },
  section: { paddingHorizontal: 24, marginTop: 36 },
  sizeRow: { flexDirection: "row", gap: 8 },
  size: { flex: 1, borderRadius: 14, borderWidth: 1, borderColor: grind.border, paddingVertical: 14, alignItems: "center" },
  sizeSelected: { borderColor: grind.accent, backgroundColor: "rgba(200,241,53,0.05)" },
  sizeNumber: { color: grind.muted, fontSize: 22 },
  sizeLabel: { color: grind.quiet, fontFamily: "Inter_700Bold", fontSize: 9, letterSpacing: 0.5, textTransform: "uppercase", marginTop: 2 },
  switches: { paddingHorizontal: 24, marginTop: 28, gap: 10 },
  switchRow: { backgroundColor: grind.surface, borderRadius: 16, borderWidth: 1, borderColor: grind.border, paddingHorizontal: 18, paddingVertical: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  switchTitle: { color: grind.text, fontFamily: "Inter_700Bold", fontSize: 13 },
  switchCopy: { color: "#444444", fontFamily: "Inter_400Regular", fontSize: 11, marginTop: 3 },
  code: { paddingHorizontal: 24, marginTop: 28 },
  codeBox: { borderWidth: 1, borderStyle: "dashed", borderColor: "#2A2A2A", borderRadius: 14, paddingVertical: 12, alignItems: "center" },
  dots: { color: grind.quiet, fontFamily: "Inter_800ExtraBold", fontSize: 26, letterSpacing: 7 },
  bottom: { marginTop: "auto", paddingHorizontal: 24, paddingBottom: 42 },
});
