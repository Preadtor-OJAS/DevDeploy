import { mutation } from "./_generated/server";

export const fixOldApps = mutation({
  args: {},
  handler: async (ctx) => {
    const apps = await ctx.db
      .query("applications")
      .filter((q) => q.eq(q.field("status"), "Building"))
      .collect();

    for (const app of apps) {
      await ctx.db.patch(app._id, { status: "Active" });

      // Check if it has any deployments
      const existingDeployments = await ctx.db
        .query("deployments")
        .withIndex("by_application", (q) => q.eq("applicationId", app._id))
        .collect();

      if (existingDeployments.length === 0) {
        const depId = await ctx.db.insert("deployments", {
          applicationId: app._id,
          userId: app.userId,
          status: "Active",
          createdAt: Date.now() - 600000, // 10 minutes ago
        });

        await ctx.db.insert("logs", {
          deploymentId: depId,
          applicationId: app._id,
          message: "Backfilled deployment created successfully.",
          level: "SUCCESS",
          timestamp: Date.now() - 600000,
        });
      }
    }
    return `Fixed ${apps.length} applications!`;
  },
});
