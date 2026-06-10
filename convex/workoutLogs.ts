import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getOptionalProfile, requireProfile } from "./lib/auth";
import { enforceRateLimit } from "./lib/rateLimit";
import { assertDateString, utcDateString } from "./lib/validation";

const VALID_WORKOUT_KEYS = new Set([
  "pushups",
  "squats",
  "plank",
  "mountain_climbers",
  "burpees",
  "lunges",
  "pullups",
  "dips",
  "jumping_jacks",
  "situps",
]);
const POINTS_BY_LEVEL = { beginner: 10, medium: 20, advanced: 30 } as const;
const MAX_DAILY_WORKOUTS = VALID_WORKOUT_KEYS.size;

export const getTodayLogs = query({
  args: {},
  handler: async (ctx) => {
    const current = await getOptionalProfile(ctx);
    if (!current) return [];
    return await ctx.db
      .query("workoutLogs")
      .withIndex("by_user_and_date", (q) =>
        q.eq("userId", current.profile._id).eq("logDate", utcDateString()),
      )
      .take(MAX_DAILY_WORKOUTS);
  },
});

export const getLogsByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    assertDateString(args.date);
    const current = await getOptionalProfile(ctx);
    if (!current) return [];
    return await ctx.db
      .query("workoutLogs")
      .withIndex("by_user_and_date", (q) =>
        q.eq("userId", current.profile._id).eq("logDate", args.date),
      )
      .take(MAX_DAILY_WORKOUTS);
  },
});

export const logWorkout = mutation({
  args: {
    workoutKey: v.string(),
    level: v.union(
      v.literal("beginner"),
      v.literal("medium"),
      v.literal("advanced"),
    ),
  },
  handler: async (ctx, args) => {
    const { identity, profile } = await requireProfile(ctx);
    const workoutKey = args.workoutKey.toLowerCase().trim();
    if (!VALID_WORKOUT_KEYS.has(workoutKey)) throw new ConvexError("Invalid workout");

    await enforceRateLimit(ctx, `logWorkout:${identity.tokenIdentifier}`, 15, 60_000);
    const today = utcDateString();
    const duplicate = await ctx.db
      .query("workoutLogs")
      .withIndex("by_user_and_date_and_workoutKey", (q) =>
        q
          .eq("userId", profile._id)
          .eq("logDate", today)
          .eq("workoutKey", workoutKey),
      )
      .unique();
    if (duplicate) throw new ConvexError("Already logged this workout today");

    const points = POINTS_BY_LEVEL[args.level];
    let currentStreak = profile.currentStreak;
    if (!profile.lastLogDate) {
      currentStreak = 1;
    } else if (profile.lastLogDate !== today) {
      assertDateString(profile.lastLogDate);
      const lastTime = Date.parse(`${profile.lastLogDate}T00:00:00.000Z`);
      const todayTime = Date.parse(`${today}T00:00:00.000Z`);
      currentStreak =
        Math.round((todayTime - lastTime) / 86_400_000) === 1
          ? profile.currentStreak + 1
          : 1;
    }

    await ctx.db.insert("workoutLogs", {
      userId: profile._id,
      workoutKey,
      level: args.level,
      points,
      logDate: today,
      loggedAt: Date.now(),
    });
    await ctx.db.patch(profile._id, {
      monthlyPoints: profile.monthlyPoints + points,
      currentStreak,
      longestStreak: Math.max(profile.longestStreak, currentStreak),
      lastLogDate: today,
    });
    return { success: true, points, newStreak: currentStreak };
  },
});
