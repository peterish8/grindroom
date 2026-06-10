import { View, Text, ScrollView, Pressable } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Link, useRouter } from "expo-router";
import { useConvexAuth } from "convex/react";
import { useQuery } from "convex/react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { api } from "../../convex/_generated/api";
import { StreakBadge } from "@/components/StreakBadge";
import { FadeIn, AnimatedNumber, Skeleton } from "@/components/animations";

const GOAL = 5;
const R = 72;
const CIRC = 2 * Math.PI * R;
const ARC_FRACTION = 0.75;

export default function HomeScreen() {
  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const profile = useQuery(api.users.getCurrentUser);
  const todayLogs = useQuery(api.workoutLogs.getTodayLogs);
  const myRooms = useQuery(api.rooms.getMyRooms);
  const firstRoomId = myRooms?.[0]?._id;
  const leaderboard = useQuery(
    api.leaderboard.getRoomLeaderboard,
    firstRoomId ? { roomId: firstRoomId } : "skip"
  );

  if (!isAuthenticated) {
    router.replace("/(auth)/splash");
    return null;
  }

  const todayPoints = todayLogs?.reduce((sum, log) => sum + log.points, 0) ?? 0;
  const workoutCount = todayLogs?.length ?? 0;
  const progress = Math.min(workoutCount, GOAL) / GOAL;

  const computeRank = (list: any[], id: string) => {
    const idx = list?.findIndex((p) => p?._id === id);
    return idx >= 0 ? idx + 1 : null;
  };
  const userRank = leaderboard && profile ? computeRank(leaderboard, profile._id) : null;
  const memberCount = leaderboard?.length ?? 0;

  return (
    <View style={{ flex: 1, backgroundColor: "#0e0e0e" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 24,
          paddingTop: insets.top + 16,
          paddingBottom: 16,
        }}
      >
        <View>
          <Text style={{ fontSize: 11, color: "#444444", fontWeight: "600", letterSpacing: 0.5, textTransform: "uppercase" }}>
            Good morning
          </Text>
          <Text style={{ fontSize: 24, fontWeight: "700", color: "#ffffff", letterSpacing: -0.5, marginTop: 2 }}>
            {profile?.displayName ?? "Athlete"}
          </Text>
        </View>
        <StreakBadge streak={profile?.currentStreak ?? 0} size="medium" />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Arc Gauge Card */}
        <FadeIn delay={0}>
          <View
            style={{
              backgroundColor: "#141414",
              borderRadius: 24,
              borderCurve: "continuous",
              borderWidth: 1,
              borderColor: progress > 0 ? "rgba(200,241,53,0.15)" : "#1E1E1E",
              padding: 24,
              marginBottom: 16,
              alignItems: "center",
            }}
          >
            <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", marginBottom: 24 }}>
              <Text style={{ fontSize: 11, color: "#444444", fontWeight: "700", textTransform: "uppercase", letterSpacing: 1 }}>
                Today's Progress
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "700",
                  color: workoutCount >= GOAL ? "#C8F135" : "#444444",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  fontVariant: ["tabular-nums"],
                }}
              >
                {workoutCount}/{GOAL}
              </Text>
            </View>

            {/* SVG Arc */}
            <View style={{ alignItems: "center", justifyContent: "center", height: 160, marginBottom: 16 }}>
              <Svg width={160} height={160} style={{ transform: [{ rotate: "135deg" }] }}>
                <Circle
                  cx={80} cy={80} r={R}
                  stroke="#1E1E1E"
                  strokeWidth={9}
                  fill="none"
                  strokeDasharray={`${CIRC * ARC_FRACTION} ${CIRC * 0.25}`}
                />
                <Circle
                  cx={80} cy={80} r={R}
                  stroke="#C8F135"
                  strokeWidth={9}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${CIRC * ARC_FRACTION} ${CIRC * 0.25}`}
                  strokeDashoffset={CIRC * ARC_FRACTION * (1 - progress)}
                />
              </Svg>
              <View style={{ position: "absolute", alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 36,
                    fontWeight: "800",
                    color: "#ffffff",
                    letterSpacing: -1,
                    fontVariant: ["tabular-nums"],
                  }}
                >
                  {workoutCount}
                </Text>
                <Text style={{ fontSize: 11, color: "#444444", fontWeight: "500" }}>
                  workouts
                </Text>
              </View>
            </View>

            {/* Progress bar */}
            <View
              style={{
                width: "100%",
                height: 3,
                backgroundColor: "#1E1E1E",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: `${Math.min(100, progress * 100)}%`,
                  backgroundColor: "#C8F135",
                  borderRadius: 2,
                }}
              />
            </View>
          </View>
        </FadeIn>

        {/* Stats Row */}
        <FadeIn delay={80}>
          {profile === undefined ? (
            <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
              <Skeleton width="47%" height={88} borderRadius={16} />
              <Skeleton width="47%" height={88} borderRadius={16} />
            </View>
          ) : (
            <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#141414",
                  borderRadius: 16,
                  borderCurve: "continuous",
                  padding: 16,
                  borderWidth: 1,
                  borderColor: "#1E1E1E",
                }}
              >
                <Text style={{ fontSize: 10, color: "#444444", fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
                  Monthly pts
                </Text>
                <AnimatedNumber
                  value={profile?.monthlyPoints ?? 0}
                  style={{
                    fontSize: 24,
                    fontWeight: "800",
                    color: "#ffffff",
                    letterSpacing: -0.5,
                    fontVariant: ["tabular-nums"],
                  }}
                />
                <Text style={{ fontSize: 10, color: "#C8F135", fontWeight: "600", marginTop: 4 }}>
                  +{todayPoints} today
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  backgroundColor: "#141414",
                  borderRadius: 16,
                  borderCurve: "continuous",
                  padding: 16,
                  borderWidth: 1,
                  borderColor: "#1E1E1E",
                }}
              >
                <Text style={{ fontSize: 10, color: "#444444", fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
                  Room rank
                </Text>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "800",
                    color: "#C8F135",
                    letterSpacing: -0.5,
                    fontVariant: ["tabular-nums"],
                  }}
                >
                  {userRank !== null ? `#${userRank}` : memberCount === 0 ? "—" : "..."}
                </Text>
                <Text style={{ fontSize: 10, color: "#444444", fontWeight: "500", marginTop: 4 }}>
                  {memberCount > 0 ? `of ${memberCount}` : "No room"}
                </Text>
              </View>
            </View>
          )}
        </FadeIn>

        {/* Today's Log */}
        <FadeIn delay={160}>
          <View style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <Text style={{ fontSize: 11, color: "#444444", fontWeight: "700", textTransform: "uppercase", letterSpacing: 1 }}>
                Today's log
              </Text>
              <Link href="/(tabs)/log">
                <Text style={{ fontSize: 10, color: "#C8F135", fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Log workout →
                </Text>
              </Link>
            </View>

            {todayLogs && todayLogs.length > 0 ? (
              <View style={{ gap: 8 }}>
                {todayLogs.slice(0, 4).map((log, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 14,
                      backgroundColor: "#141414",
                      borderRadius: 16,
                      borderCurve: "continuous",
                      paddingVertical: 14,
                      paddingHorizontal: 16,
                      borderWidth: 1,
                      borderColor: "#1E1E1E",
                    }}
                  >
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        backgroundColor: "#1e2800",
                        borderRadius: 10,
                        borderCurve: "continuous",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ fontSize: 18 }}>💪</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: "700", color: "#ffffff", letterSpacing: -0.1 }}>
                        {log.workoutKey.charAt(0).toUpperCase() +
                          log.workoutKey.slice(1).replace(/_/g, " ")}
                      </Text>
                      <Text style={{ fontSize: 11, color: "#444444", fontWeight: "500", marginTop: 1 }}>
                        {log.level} · {log.points} pts
                      </Text>
                    </View>
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        backgroundColor: "#C8F135",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ fontSize: 11, fontWeight: "800", color: "#0e0e0e" }}>✓</Text>
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
                  padding: 24,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#1E1E1E",
                  borderStyle: "dashed",
                }}
              >
                <Text style={{ fontSize: 13, color: "#333333", marginBottom: 8 }}>Nothing logged yet</Text>
                <Link href="/(tabs)/log">
                  <Text style={{ fontSize: 13, color: "#C8F135", fontWeight: "700" }}>Log now →</Text>
                </Link>
              </View>
            )}
          </View>
        </FadeIn>

        {/* Quick Actions */}
        <FadeIn delay={240}>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Link href="/(tabs)/log" asChild>
              <Pressable
                style={{
                  flex: 1,
                  backgroundColor: "#141414",
                  borderRadius: 20,
                  borderCurve: "continuous",
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "#1E1E1E",
                }}
              >
                <Text style={{ fontSize: 22, marginBottom: 12 }}>💪</Text>
                <Text style={{ fontSize: 13, fontWeight: "700", color: "#ffffff", marginBottom: 3 }}>Log Workout</Text>
                <Text style={{ fontSize: 11, color: "#444444" }}>Track today's grind</Text>
              </Pressable>
            </Link>
            <Link href="/(tabs)/rooms" asChild>
              <Pressable
                style={{
                  flex: 1,
                  backgroundColor: "#141414",
                  borderRadius: 20,
                  borderCurve: "continuous",
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "#1E1E1E",
                }}
              >
                <Text style={{ fontSize: 22, marginBottom: 12 }}>🏆</Text>
                <Text style={{ fontSize: 13, fontWeight: "700", color: "#ffffff", marginBottom: 3 }}>View Rooms</Text>
                <Text style={{ fontSize: 11, color: "#444444" }}>Check leaderboards</Text>
              </Pressable>
            </Link>
          </View>
        </FadeIn>
      </ScrollView>
    </View>
  );
}
