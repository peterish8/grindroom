import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ScalePress } from "@/components/animations";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuthActions();

  const createProfile = useMutation(api.users.createProfile);

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google");
    } catch {
      Alert.alert("Error", "Google sign-in failed. Try again.");
    }
  };

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (name.trim().length > 30) {
      Alert.alert("Error", "Name must be 30 characters or less");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await signIn("password", { email: email.trim(), password, flow: "signUp" });
      try {
        await createProfile({ displayName: name.trim() });
      } catch {
        // Auth succeeded but profile creation failed — not fatal, user can set name in settings
      }
      router.replace("/(tabs)/index" as any);
    } catch (error: any) {
      if (error.message?.toLowerCase().includes("already exists") || error.message?.toLowerCase().includes("existing")) {
        Alert.alert("Account Exists", "An account with this email already exists. Please sign in.");
      } else {
        Alert.alert("Error", error.message || "Could not create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Link href="/(auth)/splash">
            <Text style={styles.backButton}>←</Text>
          </Link>
          <Text style={styles.title}>Create Account</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Display Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#333333"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#333333"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Create a password (8+ chars)"
              placeholderTextColor="#333333"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <ScalePress
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Creating account..." : "Create Account"}
            </Text>
          </ScalePress>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <ScalePress style={styles.googleButton} onPress={handleGoogleSignIn}>
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </ScalePress>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)/login">
            <Text style={styles.linkText}>Sign In</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e0e0e",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
  },
  header: {
    gap: 32,
  },
  backButton: {
    fontSize: 28,
    color: "#adaaaa",
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -1,
  },
  form: {
    flex: 1,
    gap: 24,
    marginTop: 48,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#adaaaa",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  button: {
    backgroundColor: "#C8F135",
    borderRadius: 9999,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#C8F135",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0e0e0e",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#2A2A2A",
  },
  dividerText: {
    fontSize: 12,
    color: "#adaaaa",
  },
  googleButton: {
    backgroundColor: "#1A1A1A",
    borderRadius: 9999,
    paddingVertical: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
    gap: 4,
  },
  footerText: {
    fontSize: 14,
    color: "#adaaaa",
  },
  linkText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#C8F135",
  },
});