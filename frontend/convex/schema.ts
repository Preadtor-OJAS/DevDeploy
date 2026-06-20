import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  applications: defineTable({
    name: v.string(),
    repositoryUrl: v.string(),
    branch: v.string(),
    userId: v.string(),
    status: v.optional(v.string()), // Active, Building, Failed
  }).index("by_user", ["userId"]),

  deployments: defineTable({
    applicationId: v.id("applications"),
    userId: v.string(),
    status: v.string(), // "Building", "Active", "Failed"
    createdAt: v.number(),
  }).index("by_application", ["applicationId"]),

  logs: defineTable({
    deploymentId: v.id("deployments"),
    applicationId: v.id("applications"),
    message: v.string(),
    level: v.string(), // "INFO", "SUCCESS", "ERROR"
    timestamp: v.number(),
  }).index("by_deployment", ["deploymentId"])
    .index("by_application", ["applicationId"]),
});
