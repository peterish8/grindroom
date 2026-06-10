import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireProfile, requireRoomMembership } from "./lib/auth";
import { enforceRateLimit } from "./lib/rateLimit";
import { cleanOptionalText, cleanText } from "./lib/validation";

const MAX_ROOMS_PER_PROFILE = 10;
const MAX_ROOM_MEMBERS = 20;
const INVITE_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const INVITE_CODE_LENGTH = 6;

async function generateInviteCode(ctx: Parameters<typeof requireProfile>[0]) {
  for (let attempt = 0; attempt < 10; attempt++) {
    const bytes = crypto.getRandomValues(new Uint8Array(INVITE_CODE_LENGTH));
    const code = Array.from(
      bytes,
      (byte) => INVITE_CODE_CHARS[byte % INVITE_CODE_CHARS.length],
    ).join("");
    const existing = await ctx.db
      .query("rooms")
      .withIndex("by_inviteCode", (q) => q.eq("inviteCode", code))
      .unique();
    if (!existing) return code;
  }
  throw new ConvexError("Could not create a unique invite code");
}

export const getMyRooms = query({
  args: {},
  handler: async (ctx) => {
    const { profile } = await requireProfile(ctx);
    const memberships = await ctx.db
      .query("roomMembers")
      .withIndex("by_user", (q) => q.eq("userId", profile._id))
      .order("desc")
      .take(MAX_ROOMS_PER_PROFILE);
    const rooms = await Promise.all(memberships.map((item) => ctx.db.get(item.roomId)));
    return rooms.filter((room) => room !== null);
  },
});

export const getRoomById = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    await requireRoomMembership(ctx, args.roomId);
    return await ctx.db.get(args.roomId);
  },
});

export const getRoomMembers = query({
  args: {
    roomId: v.id("rooms"),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireRoomMembership(ctx, args.roomId);
    const pageSize = Math.max(1, Math.min(Math.floor(args.limit ?? 20), 50));
    const result = await ctx.db
      .query("roomMembers")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .paginate({ numItems: pageSize, cursor: args.cursor ?? null });
    const profiles = await Promise.all(result.page.map((member) => ctx.db.get(member.userId)));

    return {
      items: profiles.filter((profile) => profile !== null),
      hasMore: !result.isDone,
      nextCursor: result.continueCursor,
    };
  },
});

export const createRoom = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    goal: v.optional(v.string()),
    isPublic: v.boolean(),
    memberLimit: v.number(),
    weeklyRequirement: v.number(),
  },
  handler: async (ctx, args) => {
    const { identity, profile } = await requireProfile(ctx);
    await enforceRateLimit(ctx, `createRoom:${identity.tokenIdentifier}`, 3, 60_000);

    const name = cleanText(args.name, "Room name", 50);
    const description = cleanOptionalText(args.description, "Description", 240);
    const goal = cleanOptionalText(args.goal, "Goal", 40);
    const memberLimit = Math.floor(args.memberLimit);
    const weeklyRequirement = Math.floor(args.weeklyRequirement);
    if (memberLimit < 2 || memberLimit > MAX_ROOM_MEMBERS) {
      throw new ConvexError(`Member limit must be between 2 and ${MAX_ROOM_MEMBERS}`);
    }
    if (weeklyRequirement < 1 || weeklyRequirement > 7) {
      throw new ConvexError("Weekly requirement must be between 1 and 7");
    }

    let roomCount = profile.roomCount;
    if (roomCount === undefined) {
      roomCount = (
        await ctx.db
          .query("roomMembers")
          .withIndex("by_user", (q) => q.eq("userId", profile._id))
          .take(MAX_ROOMS_PER_PROFILE)
      ).length;
    }
    if (roomCount >= MAX_ROOMS_PER_PROFILE) {
      throw new ConvexError(`Maximum ${MAX_ROOMS_PER_PROFILE} rooms per user`);
    }

    const inviteCode = await generateInviteCode(ctx);
    const roomId = await ctx.db.insert("rooms", {
      name,
      inviteCode,
      description,
      goal,
      isPublic: args.isPublic,
      memberLimit,
      weeklyRequirement,
      createdBy: profile._id,
      memberCount: 1,
      createdAt: Date.now(),
    });
    await ctx.db.insert("roomMembers", {
      roomId,
      userId: profile._id,
      joinedAt: Date.now(),
    });
    await ctx.db.patch(profile._id, { roomCount: roomCount + 1 });
    return { roomId, inviteCode };
  },
});

export const joinRoom = mutation({
  args: { inviteCode: v.string() },
  handler: async (ctx, args) => {
    const { identity, profile } = await requireProfile(ctx);
    await enforceRateLimit(ctx, `joinRoom:${identity.tokenIdentifier}`, 10, 60_000);

    const inviteCode = args.inviteCode.trim().toUpperCase();
    if (!/^[A-Z2-9]{6}$/.test(inviteCode)) {
      throw new ConvexError("Invite code must be 6 letters or numbers");
    }
    const room = await ctx.db
      .query("rooms")
      .withIndex("by_inviteCode", (q) => q.eq("inviteCode", inviteCode))
      .unique();
    if (!room) throw new ConvexError("Room not found");

    const existingMembership = await ctx.db
      .query("roomMembers")
      .withIndex("by_room_and_user", (q) =>
        q.eq("roomId", room._id).eq("userId", profile._id),
      )
      .unique();
    if (existingMembership) return { success: true, roomId: room._id };

    let roomCount = profile.roomCount;
    if (roomCount === undefined) {
      roomCount = (
        await ctx.db
          .query("roomMembers")
          .withIndex("by_user", (q) => q.eq("userId", profile._id))
          .take(MAX_ROOMS_PER_PROFILE)
      ).length;
    }
    if (roomCount >= MAX_ROOMS_PER_PROFILE) {
      throw new ConvexError(`Maximum ${MAX_ROOMS_PER_PROFILE} rooms per user`);
    }

    const memberCount =
      room.memberCount ??
      (
        await ctx.db
          .query("roomMembers")
          .withIndex("by_room", (q) => q.eq("roomId", room._id))
          .take(room.memberLimit)
      ).length;
    if (memberCount >= room.memberLimit) throw new ConvexError("Room is full");

    await ctx.db.insert("roomMembers", {
      roomId: room._id,
      userId: profile._id,
      joinedAt: Date.now(),
    });
    await ctx.db.patch(room._id, { memberCount: memberCount + 1 });
    await ctx.db.patch(profile._id, { roomCount: roomCount + 1 });
    return { success: true, roomId: room._id };
  },
});

export const leaveRoom = mutation({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    const { profile, membership } = await requireRoomMembership(ctx, args.roomId);
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new ConvexError("Room not found");
    if (room.createdBy === profile._id) {
      throw new ConvexError("Room owners must delete the room instead");
    }

    await ctx.db.delete(membership._id);
    await ctx.db.patch(room._id, {
      memberCount: Math.max(0, (room.memberCount ?? 1) - 1),
    });
    await ctx.db.patch(profile._id, {
      roomCount: Math.max(0, (profile.roomCount ?? 1) - 1),
    });
    return { success: true };
  },
});

export const deleteRoom = mutation({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    const { profile } = await requireRoomMembership(ctx, args.roomId);
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new ConvexError("Room not found");
    if (room.createdBy !== profile._id) throw new ConvexError("Only the owner can delete this room");

    const memberships = await ctx.db
      .query("roomMembers")
      .withIndex("by_room", (q) => q.eq("roomId", room._id))
      .take(MAX_ROOM_MEMBERS);
    for (const member of memberships) {
      const memberProfile = await ctx.db.get(member.userId);
      if (memberProfile) {
        await ctx.db.patch(memberProfile._id, {
          roomCount: Math.max(0, (memberProfile.roomCount ?? 1) - 1),
        });
      }
      await ctx.db.delete(member._id);
    }
    await ctx.db.delete(room._id);
    return { success: true };
  },
});
