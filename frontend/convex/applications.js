import { query, mutation } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

export const get = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const apps = await ctx.db
      .query("applications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Join deployments count
    return await Promise.all(
      apps.map(async (app) => {
        const deployments = await ctx.db
          .query("deployments")
          .withIndex("by_application", (q) => q.eq("applicationId", app._id))
          .collect();
        return { ...app, deployments };
      })
    );
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    repositoryUrl: v.string(),
    branch: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if name already exists
    const existing = await ctx.db
      .query("applications")
      .filter((q) => q.eq(q.field("name"), args.name))
      .first();

    if (existing) {
      throw new Error("Application name already in use");
    }

    const appId = await ctx.db.insert("applications", {
      name: args.name,
      repositoryUrl: args.repositoryUrl,
      branch: args.branch,
      userId: args.userId,
      status: "Building",
    });

    const deploymentId = await ctx.db.insert("deployments", {
      applicationId: appId,
      userId: args.userId,
      status: "Building",
      createdAt: Date.now(),
    });

    // Spawn the simulation engine!
    await ctx.scheduler.runAfter(0, api.simulation.runDeployment, {
      applicationId: appId,
      deploymentId: deploymentId,
      appName: args.name,
    });

    return appId;
  },
});
