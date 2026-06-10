import { useState, useEffect } from "react";
import { View, Text, ScrollView, TextInput, Pressable, Alert } from "react-native";
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Link, useRouter } from "expo-router";
import { useConvexAuth } from "convex/react";
import { useQuery, useMutation } from "convex/react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Search, ChevronRight, Plus } from "lucide-react-native";
import { api } from "../../convex/_generated/api";
import { Skeleton } from "@/components/animations";

function LiveBadge() {
  const opacity = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.4, { duration: 900 }), -1, true);
  }, []);

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <Animated.View
        style={[
          { width: 6, height: 6, borderRadius: 3, backgroundColor: "#C8F135" },
          animStyle,
        ]}
      />
      <Text style={{ fontSize: 10, fontWeight: "800", color: "#C8F135", letterSpacing: 1, textTransform: "uppercase" }}>
        Live
      </Text>
    </View>
  );
}

export default function RoomsScreen() {
  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [showJoinInput, setShowJoinInput] = useState(false);

  const profile = useQuery(api.users.getCurrentUser);
  const myRooms = useQuery(api.rooms.getMyRooms);
  const joinRoom = useMutation(api.rooms.joinRoom);

  const firstRoomId = myRooms?.[0]?._id;
  const leaderboard = useQuery(
    api.leaderboard.getRoomLeaderboard,
    firstRoomId ? { roomId: firstRoomId } : "skip"
  );

  const computeRank = (list: any[], id: string) => {
    const idx = list?.findIndex((p) => p?._id === id);
    return idx >= 0 ? idx + 1 : null;
  };
  const userRank = leaderboard && profile ? computeRank(leaderboard, profile._id) : null;

  if (!isAuthenticated) {
    router.replace("/(auth)/splash");
    return null;
  }

  const handleJoinRoom = async () => {
    if (!joinCode.trim()) {
      Alert.alert("Error", "Please enter a room code");
      return;
    }
    try {
      const result = await joinRoom({ inviteCode: joinCode.trim().toUpperCase() });
      if (result.roomId) router.push(`/room/${result.roomId}`);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Could not join room");
    }
  };

  const filteredRooms = myRooms?.filter((room) =>
    room?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#0e0e0e" }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 24, paddingTop: insets.top + 16, paddingBottom: 8 }}>
        <Text style={{ fontSize: 32, fontWeight: "800", color: "#ffffff", letterSpacing: -1, lineHeight: 36 }}>
          Your Rooms<Text style={{ color: "#C8F135" }}>.</Text>
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Search */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            backgroundColor: "#141414",
            borderRadius: 14,
            borderCurve: "continuous",
            paddingHorizontal: 16,
            borderWidth: 1,
            borderColor: "#1E1E1E",
            marginTop: 20,
            marginBottom: 24,
          }}
        >
          <Search size={16} color="#333333" strokeWidth={2} />
          <TextInput
            style={{ flex: 1, paddingVertical: 14, fontSize: 14, color: "#ffffff" }}
            placeholder="Search rooms"
            placeholderTextColor="#2E2E2E"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Loading skeleton */}
        {myRooms === undefined && (
          <Skeleton width="100%" height={148} borderRadius={20} />
        )}

        {/* Active Room Hero */}
        {filteredRooms && filteredRooms.length > 0 && (
          <Pressable
            style={{
              backgroundColor: "#141414",
              borderRadius: 24,
              borderCurve: "continuous",
              padding: 24,
              borderWidth: 1,
              borderColor: "rgba(200,241,53,0.18)",
              marginBottom: 12,
              boxShadow: "0 0 40px rgba(200,241,53,0.05)",
            }}
            onPress={() => router.push(`/room/${filteredRooms[0]?._id}`)}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <LiveBadge />
              <ChevronRight size={16} color="#333333" strokeWidth={2} />
            </View>

            <Text
              style={{
                fontSize: 22,
                fontWeight: "800",
                color: "#ffffff",
                letterSpacing: -0.5,
                marginTop: 16,
                marginBottom: 4,
              }}
            >
              {filteredRooms[0]?.name}
            </Text>

            <Text style={{ fontSize: 12, color: "#444444", fontWeight: "500" }}>
              {filteredRooms[0]?.memberLimit} members
              {userRank !== null ? ` · You're #${userRank}` : ""}
            </Text>
          </Pressable>
        )}

        {/* Other Rooms */}
        {filteredRooms && filteredRooms.length > 1 && (
          <View style={{ gap: 8, marginBottom: 12 }}>
            {filteredRooms.slice(1).map((room) =>
              room ? (
                <Pressable
                  key={room._id}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#141414",
                    borderRadius: 16,
                    borderCurve: "continuous",
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    borderWidth: 1,
                    borderColor: "#1E1E1E",
                  }}
                  onPress={() => router.push(`/room/${room._id}`)}
                >
                  <View>
                    <Text style={{ fontSize: 14, fontWeight: "700", color: "#ffffff", marginBottom: 3 }}>
                      {room.name}
                    </Text>
                    <Text style={{ fontSize: 11, color: "#444444" }}>{room.memberLimit} members</Text>
                  </View>
                  <ChevronRight size={18} color="#333333" strokeWidth={2} />
                </Pressable>
              ) : null
            )}
          </View>
        )}

        {/* Empty State */}
        {myRooms !== undefined && filteredRooms?.length === 0 && !searchQuery && (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#333333", marginBottom: 4 }}>
              No rooms yet
            </Text>
            <Text style={{ fontSize: 12, color: "#2A2A2A" }}>Join or create one below</Text>
          </View>
        )}

        {/* Join with Code */}
        <View style={{ marginBottom: 8 }}>
          {showJoinInput ? (
            <View
              style={{
                backgroundColor: "#141414",
                borderRadius: 20,
                borderCurve: "continuous",
                padding: 20,
                borderWidth: 1,
                borderColor: "#1E1E1E",
                gap: 12,
              }}
            >
              <Text style={{ fontSize: 11, color: "#444444", fontWeight: "700", textTransform: "uppercase", letterSpacing: 1 }}>
                Enter room code
              </Text>
              <TextInput
                style={{
                  backgroundColor: "#0e0e0e",
                  borderRadius: 12,
                  borderCurve: "continuous",
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#ffffff",
                  borderWidth: 1,
                  borderColor: "#1E1E1E",
                  letterSpacing: 4,
                  textAlign: "center",
                }}
                placeholder="ABC123"
                placeholderTextColor="#2A2A2A"
                value={joinCode}
                onChangeText={setJoinCode}
                autoCapitalize="characters"
                maxLength={6}
              />
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Pressable
                  style={{
                    flex: 1,
                    backgroundColor: "#C8F135",
                    borderRadius: 12,
                    borderCurve: "continuous",
                    paddingVertical: 14,
                    alignItems: "center",
                  }}
                  onPress={handleJoinRoom}
                >
                  <Text style={{ fontSize: 14, fontWeight: "800", color: "#0e0e0e" }}>Join Room</Text>
                </Pressable>
                <Pressable
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 14,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => setShowJoinInput(false)}
                >
                  <Text style={{ fontSize: 13, color: "#444444", fontWeight: "600" }}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                paddingVertical: 20,
                borderWidth: 1,
                borderColor: "#1E1E1E",
                borderRadius: 16,
                borderCurve: "continuous",
                borderStyle: "dashed",
              }}
              onPress={() => setShowJoinInput(true)}
            >
              <Plus size={16} color="#333333" strokeWidth={2} />
              <Text style={{ fontSize: 13, color: "#444444", fontWeight: "600" }}>Join with code</Text>
            </Pressable>
          )}
        </View>

        {/* Create Room */}
        <Link href="/create-room" asChild>
          <Pressable style={{ paddingVertical: 16, alignItems: "center" }}>
            <Text style={{ fontSize: 14, color: "#C8F135", fontWeight: "700" }}>+ Create New Room</Text>
          </Pressable>
        </Link>
      </ScrollView>
    </View>
  );
}
