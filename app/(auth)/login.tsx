import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Link, useRouter } from "expo-router";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react-native";
import { api } from "../../convex/_generated/api";
import { BackButton, DisplayText, Eyebrow, PrimaryButton, grind } from "@/components/GrindUI";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuthActions();
  const createProfile = useMutation(api.users.createProfile);
  const canSubmit = email.trim().length > 3 && password.length >= 8 && !loading;

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google");
      await createProfile({ displayName: "Athlete" }).catch(() => undefined);
      router.replace("/(tabs)");
    } catch {
      Alert.alert("Sign in failed", "Google sign-in could not be completed.");
    }
  };

  const handleLogin = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      await signIn("password", { email: email.trim(), password });
      router.replace("/(tabs)");
    } catch {
      Alert.alert("Sign in failed", "Check your email and password, then try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <BackButton onPress={() => router.back()} />
        <View style={styles.heading}>
          <Eyebrow>Welcome back</Eyebrow>
          <DisplayText style={styles.title}>BACK TO THE{"\n"}GRIND<Text style={{ color: grind.accent }}>.</Text></DisplayText>
        </View>

        <View style={styles.form}>
          <View style={styles.inputShell}>
            <Mail size={17} color={grind.quiet} />
            <TextInput
              accessibilityLabel="Email address"
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#343434"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>
          <View style={styles.inputShell}>
            <LockKeyhole size={17} color={grind.quiet} />
            <TextInput
              accessibilityLabel="Password"
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#343434"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
              autoComplete="current-password"
            />
            <Pressable accessibilityLabel={passwordVisible ? "Hide password" : "Show password"} onPress={() => setPasswordVisible((value) => !value)} hitSlop={10}>
              {passwordVisible ? <EyeOff size={17} color={grind.quiet} /> : <Eye size={17} color={grind.quiet} />}
            </Pressable>
          </View>
          <Text style={styles.forgot}>Forgot password?</Text>
          <PrimaryButton onPress={handleLogin} disabled={!canSubmit}>{loading ? "Signing In..." : "Sign In"}</PrimaryButton>
        </View>

        <View style={styles.divider}><View style={styles.line} /><Text style={styles.or}>OR</Text><View style={styles.line} /></View>
        <Pressable style={styles.google} onPress={handleGoogleSignIn}>
          <Text style={styles.googleMark}>G</Text><Text style={styles.googleText}>Continue with Google</Text>
        </Pressable>
        <View style={styles.footer}>
          <Text style={styles.footerText}>New to the grind? </Text>
          <Link href="/(auth)/signup" style={styles.footerLink}>Create account</Link>
        </View>
        <DisplayText style={styles.ghost}>DAY 0 STARTS NOW</DisplayText>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: grind.background },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 56, paddingBottom: 28 },
  heading: { marginTop: 40, paddingHorizontal: 4, gap: 8 },
  title: { fontSize: 42, lineHeight: 43, letterSpacing: -0.6 },
  form: { marginTop: 40, gap: 12 },
  inputShell: { minHeight: 54, borderRadius: 14, backgroundColor: grind.surface, borderWidth: 1, borderColor: grind.border, flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16 },
  input: { flex: 1, color: grind.text, fontFamily: "Inter_600SemiBold", fontSize: 14, paddingVertical: 15 },
  forgot: { color: grind.muted, fontFamily: "Inter_600SemiBold", fontSize: 12, textAlign: "right", marginBottom: 8 },
  divider: { flexDirection: "row", alignItems: "center", gap: 14, marginVertical: 28 },
  line: { flex: 1, height: 1, backgroundColor: "#1A1A1A" },
  or: { color: grind.quiet, fontFamily: "Inter_700Bold", fontSize: 10, letterSpacing: 1 },
  google: { minHeight: 52, borderRadius: 999, backgroundColor: grind.surface, borderWidth: 1, borderColor: grind.border, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  googleMark: { color: grind.text, fontFamily: "Inter_800ExtraBold", fontSize: 16 },
  googleText: { color: grind.text, fontFamily: "Inter_700Bold", fontSize: 14 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 22 },
  footerText: { color: grind.muted, fontFamily: "Inter_400Regular", fontSize: 13 },
  footerLink: { color: grind.accent, fontFamily: "Inter_700Bold", fontSize: 13 },
  ghost: { color: "#161616", fontSize: 48, textAlign: "center", marginTop: "auto", paddingTop: 36 },
});
