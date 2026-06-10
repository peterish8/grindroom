import { View, Text, ScrollView, Pressable } from "react-native";
import Svg, { Defs, LinearGradient, Stop, Circle } from "react-native-svg";
import { useRouter } from "expo-router";
import { useConvexAuth } from "convex/react";
import { useQuery } from "convex/react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Settings } from "lucide-react-native";
import { api } from "../../convex/_generated/api";
import { Skeleton, AnimatedNumber } from "@/components/animations";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatMonth(monthStr: string) {
  const [year, month] = monthStr.split("-");
  return `${MONTH_NAMES[parseInt(month) - 1]} ${year}`;
}

export default function ProfileScreen() {
  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const profile = useQuery(api.users.getCurrentUser);
  const monthlyHistory = useQuery(api.users.getMonthlyHistory, {});

  if (!isAuthenticated) {
    router.replace("/(auth)/splash");
    return null;
  }

  const bestMonth =
    monthlyHistory?.items && monthlyHistory.items.length > 0
      ? Math.max(...monthlyHistory.items.map((s) => s.totalPoints))
      : null;

  const initial = profile?.displayName?.charAt(0).toUpperCase() ?? "?";

  return (
    <View style={{ flex: 1, backgroundColor: "#0e0e0e" }}>
      {/* Header */}
      <View
        style={{
          alignItems: "center",
          paddingTop: insets.top + 16,
          paddingBottom: 32,
          paddingHorizontal: 24,
        }}
      >
        {/* Settings button */}
        <Pressable
          style={{ position: "absolute", top: insets.top + 16, right: 24, padding: 8 }}
          onPress={() => router.push("/settings")}
        >
          <Settings size={20} color="#444444" strokeWidth={2} />
        </Pressable>

        {/* Avatar with lime ring */}
        <View style={{ width: 80, height: 80, position: "relative", marginBottom: 16, alignItems: "center", justifyContent: "center" }}>
          <Svg width={80} height={80} style={{ position: "absolute", top: 0, left: 0 }}>
            <Defs>
              <LinearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#C8F135" />
                <Stop offset="1" stopColor="#3a4700" />
              </LinearGradient>
            </Defs>
            <Circle cx={40} cy={40} r={37} stroke="url(#ring)" strokeWidth={2.5} fill="none" />
          </Svg>
          <View
            style={{
              width: 68,
              height: 68,
              borderRadius: 34,
              backgroundColor: "#1A1A1A",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 26, fontWeight: "800", color: "#ffffff" }}>{initial}</Text>
          </View>
        </View>

        <Text style={{ fontSize: 22, fontWeight: "800", color: "#ffffff", letterSpacing: -0.5, marginBottom: 4 }}>
          {profile?.displayName ?? "Athlete"}
        </Text>
        <Text style={{ fontSize: 12, color: "#444444", fontWeight: "500" }}>
          Member since{" "}
          {profile?.createdAt
            ? formatMonth(new Date(profile.createdAt).toISOString().slice(0, 7))
            : "—"}
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Grid */}
        {profile === undefined ? (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 32 }}>
            <Skeleton width="47%" height={96} borderRadius={16} />
            <Skeleton width="47%" height={96} borderRadius={16} />
            <Skeleton width="47%" height={96} borderRadius={16} />
            <Skeleton width="47%" height={96} borderRadius={16} />
          </View>
        ) : (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 32 }}>
            {[
              { label: "Current Streak", value: profile?.currentStreak ?? 0, unit: "days", highlight: true },
              { label: "Longest Streak", value: profile?.longestStreak ?? 0, unit: "days", highlight: false },
              { label: "This Month", value: profile?.monthlyPoints ?? 0, unit: "pts", highlight: false },
              { label: "Best Month", value: bestMonth ?? (monthlyHistory === undefined ? "..." : "—"), unit: "pts", highlight: false },
            ].map(({ label, value, unit, highlight }) => (
              <View
                key={label}
                style={{
                  width: "47%",
                  backgroundColor: "#141414",
                  borderRadius: 20,
                  borderCurve: "continuous",
                  padding: 18,
                  borderWidth: 1,
                  borderColor: highlight ? "rgba(200,241,53,0.2)" : "#1E1E1E",
                }}
              >
                <Text
                  style={{
                    fontSize: 9,
                    color: "#444444",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                    marginBottom: 10,
                  }}
                >
                  {label}
                </Text>
                {typeof value === "number" ? (
                  <AnimatedNumber
                    value={value}
                    style={{
                      fontSize: 26,
                      fontWeight: "800",
                      color: highlight ? "#C8F135" : "#ffffff",
                      letterSpacing: -0.5,
                      fontVariant: ["tabular-nums"],
                    }}
                    duration={700}
                  />
                ) : (
                  <Text
                    style={{
                      fontSize: 26,
                      fontWeight: "800",
                      color: "#ffffff",
                      letterSpacing: -0.5,
                    }}
                  >
                    {value}
                  </Text>
                )}
                <Text style={{ fontSize: 10, color: "#333333", marginTop: 2 }}>{unit}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Monthly History */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "800",
              color: "#ffffff",
              letterSpacing: -0.5,
              marginBottom: 16,
            }}
          >
            Past months
          </Text>

          {monthlyHistory?.items && monthlyHistory.items.length > 0 ? (
            <View style={{ gap: 10 }}>
              {monthlyHistory.items.slice(0, 6).map((snapshot, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#141414",
                    borderRadius: 16,
                    borderCurve: "continuous",
                    paddingVertical: 14,
                    paddingHorizontal: 20,
                    borderWidth: 1,
                    borderColor: "#1E1E1E",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
                    <Text style={{ fontSize: 14, fontWeight: "700", color: "#ffffff", minWidth: 60 }}>
                      {formatMonth(snapshot.month)}
                    </Text>
                    <View style={{ flexDirection: "row", gap: 16 }}>
                      <View style={{ alignItems: "center" }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "700",
                            color: "#ffffff",
                            fontVariant: ["tabular-nums"],
                          }}
                        >
                          {snapshot.totalPoints}
                        </Text>
                        <Text style={{ fontSize: 8, color: "#444444", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: "700" }}>
                          Pts
                        </Text>
                      </View>
                      <View style={{ alignItems: "center" }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "700",
                            color: "#ffffff",
                            fontVariant: ["tabular-nums"],
                          }}
                        >
                          {snapshot.finalStreak}
                        </Text>
                        <Text style={{ fontSize: 8, color: "#444444", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: "700" }}>
                          Days
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: snapshot.rankInRoom === 1 ? "#C8F135" : "#1A1A1A",
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 1,
                      borderColor: snapshot.rankInRoom === 1 ? "transparent" : "#252525",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "800",
                        color: snapshot.rankInRoom === 1 ? "#0e0e0e" : "#555555",
                      }}
                    >
                      #{snapshot.rankInRoom}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View
              style={{
                backgroundColor: "#141414",
                borderRadius: 20,
                borderCurve: "continuous",
                padding: 32,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#1E1E1E",
                borderStyle: "dashed",
              }}
            >
              <Text style={{ fontSize: 14, color: "#333333", fontWeight: "600", marginBottom: 4 }}>
                No history yet
              </Text>
              <Text style={{ fontSize: 12, color: "#2A2A2A" }}>
                Complete a month to see your stats
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
