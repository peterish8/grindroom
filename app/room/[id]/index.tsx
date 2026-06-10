import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useConvexAuth } from "convex/react";
import { useQuery, useMutation } from "convex/react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, Copy, LogOut } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { StaggeredList, Skeleton } from "@/components/animations";

export default function RoomDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const currentSeason = new Date().getMonth() + 1;
  const roomId = id as Id<"rooms">;
  const room = useQuery(api.rooms.getRoomById, { roomId });
  const leaderboard = useQuery(api.leaderboard.getRoomLeaderboard, { roomId });
  const todayActivity = useQuery(api.leaderboard.getTodayActivity, { roomId });
  const currentUser = useQuery(api.users.getCurrentUser);
  const leaveRoom = useMutation(api.rooms.leaveRoom);

  if (!isAuthenticated) {
    router.replace("/(auth)/splash");
    return null;
  }

  const handleLeaveRoom = () => {
    Alert.alert("Leave Room", "Are you sure you want to leave this room?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Leave",
        style: "destructive",
        onPress: async () => {
          await leaveRoom({ roomId });
          router.replace("/(tabs)/rooms");
        },
      },
    ]);
  };

  const copyInviteCode = async () => {
    if (room?.inviteCode) {
      await Clipboard.setStringAsync(room.inviteCode);
      if (Platform.OS === "ios") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Copied!", "Invite code copied to clipboard");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0e0e0e" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 24,
          paddingTop: insets.top + 12,
          paddingBottom: 16,
        }}
      >
        <Pressable
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#141414",
            borderWidth: 1,
            borderColor: "#1E1E1E",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => router.back()}
        >
          <ChevronLeft size={20} color="#ffffff" strokeWidth={2} />
        </Pressable>

        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: "#ffffff",
            letterSpacing: -0.3,
            flex: 1,
            textAlign: "center",
          }}
        >
          {room?.name ?? "Room"}
        </Text>

        <View
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            backgroundColor: "#141414",
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "#1E1E1E",
          }}
        >
          <Text
            style={{
              fontSize: 11,
              color: "#555555",
              fontWeight: "700",
              fontVariant: ["tabular-nums"],
            }}
          >
            {todayActivity?.length ?? 0}/{room?.memberLimit ?? 0}
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Today's Activity */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 10,
              color: "#444444",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: 1.5,
              marginBottom: 16,
            }}
          >
            Today's Activity
          </Text>

          <View
            style={{
              backgroundColor: "#141414",
              borderRadius: 20,
              borderCurve: "continuous",
              padding: 20,
              borderWidth: 1,
              borderColor: "#1E1E1E",
            }}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: "row", gap: 16 }}>
                {todayActivity?.map((activity, index) => (
                  <View key={index} style={{ alignItems: "center", gap: 8 }}>
                    <View style={{ position: "relative" }}>
                      <View
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 26,
                          backgroundColor: "#1A1A1A",
                          alignItems: "center",
                          justifyContent: "center",
                          borderWidth: 2,
                          borderColor: activity.hasLoggedToday ? "#C8F135" : "#1E1E1E",
                        }}
                      >
                        <Text style={{ fontSize: 18, fontWeight: "800", color: "#ffffff" }}>
                          {activity.profile?.displayName?.charAt(0).toUpperCase() ?? "?"}
                        </Text>
                      </View>
                      <View
                        style={{
                          position: "absolute",
                          bottom: -2,
                          right: -2,
                          width: 18,
                          height: 18,
                          borderRadius: 9,
                          borderWidth: 2,
                          borderColor: "#141414",
                          backgroundColor: activity.hasLoggedToday ? "#C8F135" : "#1A1A1A",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ fontSize: 9, fontWeight: "800", color: activity.hasLoggedToday ? "#0e0e0e" : "#444444" }}>
                          {activity.hasLoggedToday ? "✓" : "×"}
                        </Text>
                      </View>
                    </View>
                    <Text style={{ fontSize: 10, color: "#555555", fontWeight: "600", maxWidth: 52 }} numberOfLines={1}>
                      {activity.profile?.displayName?.split(" ")[0] ?? "?"}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Live Leaderboard */}
        <View style={{ marginBottom: 32 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Text style={{ fontSize: 10, color: "#444444", fontWeight: "700", textTransform: "uppercase", letterSpacing: 1.5 }}>
              Live Leaderboard
            </Text>
            <Text style={{ fontSize: 10, color: "#C8F135", fontWeight: "700", textTransform: "uppercase", letterSpacing: 1 }}>
              Season {currentSeason}
            </Text>
          </View>

          {leaderboard === undefined ? (
            <View style={{ gap: 10 }}>
              <Skeleton width="100%" height={68} borderRadius={16} />
              <Skeleton width="100%" height={68} borderRadius={16} />
              <Skeleton width="100%" height={68} borderRadius={16} />
            </View>
          ) : (
            <StaggeredList baseDelay={80} staggerMs={40}>
              {leaderboard.filter(Boolean).map((profile, index) =>
                profile ? (
                  <View
                    key={profile._id}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#141414",
                      borderRadius: 16,
                      borderCurve: "continuous",
                      padding: 14,
                      borderWidth: 1,
                      borderColor: index === 0 ? "rgba(200,241,53,0.2)" : "#1E1E1E",
                      marginBottom: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "800",
                        color: index === 0 ? "#C8F135" : "#333333",
                        width: 32,
                        fontVariant: ["tabular-nums"],
                      }}
                    >
                      #{index + 1}
                    </Text>

                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: "#1A1A1A",
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: index === 0 ? 1.5 : 1,
                        borderColor: index === 0 ? "#C8F135" : "#222222",
                        marginRight: 12,
                      }}
                    >
                      <Text style={{ fontSize: 16, fontWeight: "800", color: "#ffffff" }}>
                        {profile.displayName?.charAt(0).toUpperCase() ?? "?"}
                      </Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: "700", color: "#ffffff", letterSpacing: -0.1, marginBottom: 2 }}>
                        {profile.displayName}
                      </Text>
                      <Text style={{ fontSize: 10, color: "#444444", fontWeight: "600" }}>
                        🔥 {profile.currentStreak} day{profile.currentStreak !== 1 ? "s" : ""}
                      </Text>
                    </View>

                    <View style={{ alignItems: "flex-end" }}>
                      <Text
                        style={{
                          fontSize: 17,
                          fontWeight: "800",
                          color: index === 0 ? "#C8F135" : "#ffffff",
                          letterSpacing: -0.3,
                          fontVariant: ["tabular-nums"],
                        }}
                      >
                        {profile.monthlyPoints}
                      </Text>
                      <Text style={{ fontSize: 9, color: "#333333", textTransform: "uppercase", letterSpacing: 0.8, fontWeight: "700" }}>
                        pts
                      </Text>
                    </View>
                  </View>
                ) : null
              )}
            </StaggeredList>
          )}
        </View>

        {/* Invite Code */}
        <View
          style={{
            backgroundColor: "#141414",
            borderRadius: 24,
            borderCurve: "continuous",
            padding: 24,
            borderWidth: 1,
            borderColor: "#1E1E1E",
            marginBottom: 24,
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "700", color: "#ffffff", marginBottom: 4 }}>
            Grow the Pack
          </Text>
          <Text style={{ fontSize: 12, color: "#444444", marginBottom: 20 }}>
            Invite friends to compete in this room
          </Text>

          <Pressable
            style={{
              backgroundColor: "#0e0e0e",
              borderRadius: 16,
              borderCurve: "continuous",
              paddingVertical: 18,
              paddingHorizontal: 24,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#1E1E1E",
            }}
            onPress={copyInviteCode}
          >
            <Text
              style={{
                fontSize: 26,
                fontWeight: "800",
                color: "#ffffff",
                letterSpacing: 6,
                fontVariant: ["tabular-nums"],
              }}
            >
              {room?.inviteCode ?? "——"}
            </Text>
            <Copy size={18} color="#C8F135" strokeWidth={2} />
          </Pressable>
        </View>

        {/* Leave Room */}
        <Pressable
          style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 16 }}
          onPress={handleLeaveRoom}
        >
          <LogOut size={16} color="#ff6b51" strokeWidth={2} />
          <Text style={{ fontSize: 14, color: "#ff6b51", fontWeight: "600" }}>Leave Room</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
