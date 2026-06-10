import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalMutation } from "./_generated/server";

const ROOM_BATCH_SIZE = 10;
const PROFILE_BATCH_SIZE = 100;
const MAX_ROOM_MEMBERS = 20;

function previousUtcMonth() {
  const now = new Date();
  const previous = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  return `${previous.getUTCFullYear()}-${String(previous.getUTCMonth() + 1).padStart(2, "0")}`;
}

export const startMonthlyFreeze = internalMutation({
  args: {},
  handler: async (ctx) => {
    await ctx.scheduler.runAfter(0, internal.snapshots.processMonthlyRoomBatch, {
      month: previousUtcMonth(),
      cursor: null,
    });
    return null;
  },
});

export const processMonthlyRoomBatch = internalMutation({
  args: {
    month: v.string(),
    cursor: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("rooms")
      .paginate({ numItems: ROOM_BATCH_SIZE, cursor: args.cursor });

    for (const room of result.page) {
      const memberships = await ctx.db
        .query("roomMembers")
        .withIndex("by_room", (q) => q.eq("roomId", room._id))
        .take(MAX_ROOM_MEMBERS);
      const profiles = (await Promise.all(
        memberships.map((membership) => ctx.db.get(membership.userId)),
      )).filter((profile) => profile !== null);
      profiles.sort((a, b) =>
        b.monthlyPoints !== a.monthlyPoints
          ? b.monthlyPoints - a.monthlyPoints
          : b.currentStreak - a.currentStreak,
      );

      for (let index = 0; index < profiles.length; index++) {
        const profile = profiles[index];
        const rankInRoom = index + 1;
        const existing = await ctx.db
          .query("monthlySnapshots")
          .withIndex("by_user_and_month", (q) =>
            q.eq("userId", profile._id).eq("month", args.month),
          )
          .unique();
        if (existing) {
          if (rankInRoom < existing.rankInRoom) {
            await ctx.db.patch(existing._id, { rankInRoom });
          }
        } else {
          await ctx.db.insert("monthlySnapshots", {
            userId: profile._id,
            month: args.month,
            totalPoints: profile.monthlyPoints,
            finalStreak: profile.currentStreak,
            rankInRoom,
            createdAt: Date.now(),
          });
        }
      }
    }

    if (!result.isDone) {
      await ctx.scheduler.runAfter(0, internal.snapshots.processMonthlyRoomBatch, {
        month: args.month,
        cursor: result.continueCursor,
      });
    } else {
      await ctx.scheduler.runAfter(0, internal.snapshots.resetMonthlyPointsBatch, {
        cursor: null,
      });
    }
    return null;
  },
});

export const resetMonthlyPointsBatch = internalMutation({
  args: { cursor: v.union(v.string(), v.null()) },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("profiles")
      .paginate({ numItems: PROFILE_BATCH_SIZE, cursor: args.cursor });
    for (const profile of result.page) {
      if (profile.monthlyPoints !== 0) {
        await ctx.db.patch(profile._id, { monthlyPoints: 0 });
      }
    }
    if (!result.isDone) {
      await ctx.scheduler.runAfter(0, internal.snapshots.resetMonthlyPointsBatch, {
        cursor: result.continueCursor,
      });
    }
    return null;
  },
});
