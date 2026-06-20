import { query } from "./_generated/server";
import { v } from "convex/values";

export const getByApplication = query({
  args: { applicationId: v.id("applications") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("logs")
      .withIndex("by_application", (q) => q.eq("applicationId", args.applicationId))
      .order("asc")
      .collect();
  },
});
