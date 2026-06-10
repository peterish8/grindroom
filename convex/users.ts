import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getOptionalProfile, requireProfile } from "./lib/auth";
import { enforceRateLimit } from "./lib/rateLimit";
import { cleanOptionalText, cleanText } from "./lib/validation";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const current = await getOptionalProfile(ctx);
    return current?.profile ?? null;
  },
});

export const getProfileById = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    const { profile } = await requireProfile(ctx);
    if (profile._id !== args.profileId) {
      throw new ConvexError("Profile access denied");
    }
    return profile;
  },
});

export const updateProfile = mutation({
  args: {
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { profile } = await requireProfile(ctx);
    const patch: { displayName?: string; avatarUrl?: string } = {};

    if (args.displayName !== undefined) {
      patch.displayName = cleanText(args.displayName, "Display name", 30);
    }
    if (args.avatarUrl !== undefined) {
      const avatarUrl = cleanOptionalText(args.avatarUrl, "Avatar URL", 2048);
      if (avatarUrl && !avatarUrl.startsWith("https://")) {
        throw new ConvexError("Avatar URL must use HTTPS");
      }
      patch.avatarUrl = avatarUrl;
    }
    if (Object.keys(patch).length === 0) {
      throw new ConvexError("No profile changes provided");
    }

    await ctx.db.patch(profile._id, patch);
    return null;
  },
});

export const createProfile = mutation({
  args: {
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Not authenticated");

    const userId = identity.subject as Id<"users">;
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (existing) return { profileId: existing._id, created: false };

    await enforceRateLimit(ctx, `createProfile:${identity.tokenIdentifier}`, 5, 60_000);
    const displayName = args.displayName
      ? cleanText(args.displayName, "Display name", 30)
      : "Athlete";
    const avatarUrl = cleanOptionalText(args.avatarUrl, "Avatar URL", 2048);
    if (avatarUrl && !avatarUrl.startsWith("https://")) {
      throw new ConvexError("Avatar URL must use HTTPS");
    }

    const profileId = await ctx.db.insert("profiles", {
      userId,
      displayName,
      avatarUrl,
      roomCount: 0,
      currentStreak: 0,
      longestStreak: 0,
      monthlyPoints: 0,
      createdAt: Date.now(),
    });
    return { profileId, created: true };
  },
});

export const getMonthlyHistory = query({
  args: { limit: v.optional(v.number()), cursor: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const current = await getOptionalProfile(ctx);
    if (!current) return { items: [], hasMore: false, nextCursor: "" };

    const pageSize = Math.max(1, Math.min(Math.floor(args.limit ?? 12), 24));
    const result = await ctx.db
      .query("monthlySnapshots")
      .withIndex("by_user_and_month", (q) => q.eq("userId", current.profile._id))
      .order("desc")
      .paginate({ numItems: pageSize, cursor: args.cursor ?? null });

    return {
      items: result.page,
      hasMore: !result.isDone,
      nextCursor: result.continueCursor,
    };
  },
});
