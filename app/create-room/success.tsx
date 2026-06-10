import { View, Text, Pressable, StyleSheet, Alert, Share } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Clipboard from "expo-clipboard";

export default function RoomCreatedSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    roomId: string;
    inviteCode: string;
    name: string;
  }>();

  const handleCopy = async () => {
    if (params.inviteCode) {
      await Clipboard.setStringAsync(params.inviteCode);
      Alert.alert("Copied!", "Access key copied to clipboard");
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join my GrindRoom "${params.name || "New Room"}"! Use code: ${params.inviteCode}`,
        title: "Join my GrindRoom",
      });
    } catch {
      // user cancelled — ignore
    }
  };

  const handleGoToRoom = () => {
    if (params.roomId) {
      router.replace(`/room/${params.roomId}`);
    } else {
      router.replace("/(tabs)/rooms");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Success Checkmark */}
        <View style={styles.checkmarkContainer}>
          <View style={styles.checkmark}>
            <Text style={styles.checkmarkIcon}>✓</Text>
          </View>
        </View>

        {/* Headlines */}
        <View style={styles.headlines}>
          <Text style={styles.successTitle}>Room is Live!</Text>
          <Text style={styles.successSubtitle}>GrindRoom Session Active</Text>
          <View style={styles.roomNameBadge}>
            <Text style={styles.roomNameText}>{params.name || "New Room"}</Text>
          </View>
        </View>

        {/* Invite Code Card */}
        <View style={styles.inviteCard}>
          <Text style={styles.accessKeyLabel}>Access Key</Text>
          <View style={styles.inviteCodeRow}>
            <Text style={styles.inviteCodeText}>
              {params.inviteCode || "------"}
            </Text>
            <Pressable style={styles.copyButton} onPress={handleCopy}>
              <Text style={styles.copyIcon}>📋</Text>
            </Pressable>
          </View>
          <Pressable style={styles.shareButton} onPress={handleShare}>
            <Text style={styles.shareIcon}>📤</Text>
            <Text style={styles.shareText}>Share Invite</Text>
          </Pressable>
        </View>

        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            This room is private. Only athletes with this access key can join.
          </Text>
        </View>
      </View>

      {/* Bottom Action */}
      <View style={styles.bottomAction}>
        <Pressable style={styles.goToRoomButton} onPress={handleGoToRoom}>
          <Text style={styles.goToRoomText}>Go to Room</Text>
          <Text style={styles.arrowIcon}>→</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e0e0e",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  checkmarkContainer: {
    marginBottom: 48,
  },
  checkmark: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#C8F135",
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkIcon: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#0e0e0e",
  },
  headlines: {
    alignItems: "center",
    marginBottom: 64,
  },
  successTitle: {
    fontSize: 48,
    fontWeight: "800",
    color: "#ffffff",
    fontStyle: "italic",
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 12,
    color: "#adaaaa",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 24,
  },
  roomNameBadge: {
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(72, 72, 71, 0.15)",
  },
  roomNameText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#C8F135",
    letterSpacing: -0.5,
  },
  inviteCard: {
    width: "100%",
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(72, 72, 71, 0.1)",
  },
  accessKeyLabel: {
    fontSize: 10,
    color: "#adaaaa",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 12,
  },
  inviteCodeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  inviteCodeText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 4,
    fontFamily: "monospace",
  },
  copyButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#262626",
    alignItems: "center",
    justifyContent: "center",
  },
  copyIcon: {
    fontSize: 20,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#262626",
    borderRadius: 9999,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "rgba(72, 72, 71, 0.2)",
  },
  shareIcon: {
    fontSize: 18,
    color: "#C8F135",
  },
  shareText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginTop: 24,
    paddingHorizontal: 8,
  },
  infoIcon: {
    fontSize: 16,
    marginTop: 2,
  },
  infoText: {
    fontSize: 12,
    color: "#adaaaa",
    lineHeight: 18,
    flex: 1,
  },
  bottomAction: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    paddingTop: 24,
  },
  goToRoomButton: {
    backgroundColor: "#C8F135",
    borderRadius: 9999,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#C8F135",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 12,
  },
  goToRoomText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0e0e0e",
  },
  arrowIcon: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0e0e0e",
  },
});