import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  profiles: defineTable({
    userId: v.id("users"),
    displayName: v.string(),
    avatarUrl: v.optional(v.string()),
    roomCount: v.number(),
    currentStreak: v.number(),
    longestStreak: v.number(),
    monthlyPoints: v.number(),
    lastLogDate: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  rooms: defineTable({
    name: v.string(),
    inviteCode: v.string(),
    description: v.optional(v.string()),
    goal: v.optional(v.string()),
    isPublic: v.boolean(),
    memberLimit: v.number(),
    weeklyRequirement: v.number(),
    createdBy: v.id("profiles"),
    memberCount: v.number(),
    createdAt: v.number(),
  }).index("by_inviteCode", ["inviteCode"]),

  roomMembers: defineTable({
    roomId: v.id("rooms"),
    userId: v.id("profiles"),
    joinedAt: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_user", ["userId"])
    .index("by_room_and_user", ["roomId", "userId"]),

  workoutLogs: defineTable({
    userId: v.id("profiles"),
    workoutKey: v.string(),
    level: v.union(v.literal("beginner"), v.literal("medium"), v.literal("advanced")),
    points: v.number(),
    logDate: v.string(),
    loggedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_date", ["userId", "logDate"])
    .index("by_user_and_date_and_workoutKey", ["userId", "logDate", "workoutKey"]),

  monthlySnapshots: defineTable({
    userId: v.id("profiles"),
    month: v.string(),
    totalPoints: v.number(),
    finalStreak: v.number(),
    rankInRoom: v.number(),
    createdAt: v.number(),
  })
    .index("by_user_and_month", ["userId", "month"]),

  rateLimits: defineTable({
    key: v.string(),
    windowStart: v.number(),
    count: v.number(),
  }).index("by_key", ["key"]),
});
