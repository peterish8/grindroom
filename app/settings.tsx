import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useConvexAuth } from "convex/react";
import { useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../convex/_generated/api";
import { ScalePress } from "@/components/animations";

export default function SettingsScreen() {
  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();
  const { signOut } = useAuthActions();
  const profile = useQuery(api.users.getCurrentUser);
  const updateProfile = useMutation(api.users.updateProfile);

  const [displayName, setDisplayName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!isAuthenticated) {
    router.replace("/(auth)/splash");
    return null;
  }

  const handleSaveName = async () => {
    const trimmed = displayName.trim();
    if (!trimmed) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }
    if (trimmed.length > 30) {
      Alert.alert("Error", "Name must be 30 characters or less");
      return;
    }
    setSaving(true);
    try {
      await updateProfile({ displayName: trimmed });
      setEditingName(false);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update name");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/(auth)/splash");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <Text style={styles.sectionLabel}>Profile</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Display Name</Text>
            {editingName ? (
              <View style={styles.editRow}>
                <TextInput
                  style={styles.nameInput}
                  value={displayName}
                  onChangeText={setDisplayName}
                  autoFocus
                  maxLength={30}
                  placeholderTextColor="#555"
                />
                <Pressable onPress={handleSaveName} disabled={saving}>
                  <Text style={styles.saveText}>{saving ? "Saving..." : "Save"}</Text>
                </Pressable>
                <Pressable onPress={() => setEditingName(false)}>
                  <Text style={styles.cancelEditText}>Cancel</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={() => {
                  setDisplayName(profile?.displayName ?? "");
                  setEditingName(true);
                }}
              >
                <Text style={styles.rowValue}>
                  {profile?.displayName ?? "—"}{" "}
                  <Text style={styles.editHint}>Edit</Text>
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Account Section */}
        <Text style={[styles.sectionLabel, { marginTop: 32 }]}>Account</Text>
        <View style={styles.card}>
          <ScalePress onPress={handleSignOut}>
            <View style={styles.signOutRow}>
              <Text style={styles.signOutText}>Sign Out</Text>
              <Text style={styles.signOutArrow}>→</Text>
            </View>
          </ScalePress>
        </View>

        <Text style={styles.version}>GrindRoom v1.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e0e0e",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 16,
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 24,
    color: "#C8F135",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  sectionLabel: {
    fontSize: 11,
    color: "#adaaaa",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(72, 72, 71, 0.15)",
    overflow: "hidden",
  },
  row: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  rowLabel: {
    fontSize: 11,
    color: "#adaaaa",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  rowValue: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "500",
  },
  editHint: {
    fontSize: 12,
    color: "#C8F135",
  },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  nameInput: {
    flex: 1,
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "#C8F135",
  },
  saveText: {
    fontSize: 14,
    color: "#C8F135",
    fontWeight: "bold",
  },
  cancelEditText: {
    fontSize: 14,
    color: "#adaaaa",
  },
  signOutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  signOutText: {
    fontSize: 16,
    color: "#ff7351",
    fontWeight: "600",
  },
  signOutArrow: {
    fontSize: 18,
    color: "#ff7351",
  },
  version: {
    marginTop: 48,
    textAlign: "center",
    fontSize: 12,
    color: "#444444",
  },
});
