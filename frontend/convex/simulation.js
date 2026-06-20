import { action, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

// Wait utility
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const writeLog = internalMutation({
  args: {
    deploymentId: v.id("deployments"),
    applicationId: v.id("applications"),
    message: v.string(),
    level: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("logs", {
      deploymentId: args.deploymentId,
      applicationId: args.applicationId,
      message: args.message,
      level: args.level,
      timestamp: Date.now(),
    });
  },
});

export const updateStatus = internalMutation({
  args: {
    applicationId: v.id("applications"),
    deploymentId: v.id("deployments"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.applicationId, { status: args.status });
    await ctx.db.patch(args.deploymentId, { status: args.status });
  },
});

export const runDeployment = action({
  args: {
    applicationId: v.id("applications"),
    deploymentId: v.id("deployments"),
    appName: v.string(),
  },
  handler: async (ctx, args) => {
    const log = async (msg, level = "INFO") => {
      await ctx.runMutation(internal.simulation.writeLog, {
        deploymentId: args.deploymentId,
        applicationId: args.applicationId,
        message: msg,
        level: level,
      });
    };

    await log(`Starting deployment for ${args.appName}`);
    await delay(2000);
    
    await log(`Cloning repository from GitHub...`);
    await delay(3000);
    
    await log(`Repository cloned successfully. Analyzing dependencies...`);
    await delay(2000);
    
    await log(`Building Docker image...`);
    await delay(5000);
    
    await log(`Docker image built successfully!`);
    await delay(1000);
    
    await log(`Pushing image to registry...`);
    await delay(3000);
    
    await log(`Image pushed successfully.`);
    await delay(2000);
    
    await log(`Creating Kubernetes deployment...`);
    await delay(2000);
    
    await log(`Deployment created. Waiting for pods to be ready...`);
    await delay(3000);
    
    await log(`All pods are running. Securing custom domain...`);
    await delay(2000);
    
    await log(`Deployment completed successfully!`, "SUCCESS");
    
    // Update status to Active
    await ctx.runMutation(internal.simulation.updateStatus, {
      applicationId: args.applicationId,
      deploymentId: args.deploymentId,
      status: "Active",
    });
  },
});
