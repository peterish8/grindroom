import { ConvexError } from "convex/values";
import { MutationCtx } from "../_generated/server";

export async function enforceRateLimit(
  ctx: MutationCtx,
  key: string,
  maxRequests: number,
  windowMs: number,
) {
  const now = Date.now();
  const existing = await ctx.db
    .query("rateLimits")
    .withIndex("by_key", (q) => q.eq("key", key))
    .first();

  if (!existing) {
    await ctx.db.insert("rateLimits", { key, windowStart: now, count: 1 });
    return;
  }

  if (existing.windowStart + windowMs <= now) {
    await ctx.db.patch(existing._id, { windowStart: now, count: 1 });
    return;
  }

  if (existing.count >= maxRequests) {
    const retryAfter = Math.max(
      1,
      Math.ceil((existing.windowStart + windowMs - now) / 1000),
    );
    throw new ConvexError(`Rate limit exceeded. Try again in ${retryAfter} seconds.`);
  }

  await ctx.db.patch(existing._id, { count: existing.count + 1 });
}
