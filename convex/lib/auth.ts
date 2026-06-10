import { ConvexError } from "convex/values";
import { Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";

type AuthCtx = Pick<QueryCtx | MutationCtx, "auth" | "db">;

export async function requireProfile(ctx: AuthCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("Not authenticated");
  }

  const userId = identity.subject as Id<"users">;
  const profile = await ctx.db
    .query("profiles")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .unique();

  if (!profile) {
    throw new ConvexError("Profile not found");
  }

  return { identity, profile, userId };
}

export async function getOptionalProfile(ctx: AuthCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  const userId = identity.subject as Id<"users">;
  const profile = await ctx.db
    .query("profiles")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .unique();

  return profile ? { identity, profile, userId } : null;
}

export async function requireRoomMembership(
  ctx: AuthCtx,
  roomId: Id<"rooms">,
) {
  const { identity, profile, userId } = await requireProfile(ctx);
  const membership = await ctx.db
    .query("roomMembers")
    .withIndex("by_room_and_user", (q) =>
      q.eq("roomId", roomId).eq("userId", profile._id),
    )
    .unique();

  if (!membership) {
    throw new ConvexError("Room access denied");
  }

  return { identity, profile, userId, membership };
}
