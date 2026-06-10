import { v } from "convex/values";
import { query } from "./_generated/server";
import { requireRoomMembership } from "./lib/auth";
import { utcDateString } from "./lib/validation";

const MAX_ROOM_MEMBERS = 20;

export const getRoomLeaderboard = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    await requireRoomMembership(ctx, args.roomId);
    const members = await ctx.db
      .query("roomMembers")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .take(MAX_ROOM_MEMBERS);
    const profiles = await Promise.all(members.map((member) => ctx.db.get(member.userId)));

    return profiles
      .filter((profile) => profile !== null)
      .map((profile) => ({
        _id: profile._id,
        displayName: profile.displayName,
        currentStreak: profile.currentStreak,
        monthlyPoints: profile.monthlyPoints,
      }))
      .sort((a, b) =>
        b.monthlyPoints !== a.monthlyPoints
          ? b.monthlyPoints - a.monthlyPoints
          : b.currentStreak - a.currentStreak,
      );
  },
});

export const getTodayActivity = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    await requireRoomMembership(ctx, args.roomId);
    const members = await ctx.db
      .query("roomMembers")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .take(MAX_ROOM_MEMBERS);
    const profiles = await Promise.all(members.map((member) => ctx.db.get(member.userId)));
    const today = utcDateString();

    return profiles
      .filter((profile) => profile !== null)
      .map((profile) => ({
        profile: {
          _id: profile._id,
          displayName: profile.displayName,
          currentStreak: profile.currentStreak,
        },
        hasLoggedToday: profile.lastLogDate === today,
      }));
  },
});
