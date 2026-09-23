import { jsonb, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { id } from "./common";
import { users } from "./users";

export const reportTargetTypeEnum = pgEnum("report_target_type", [
  "adviser_profile",
  "service_package",
  "review",
  "message",
  "scholarship",
]);

export const reportStatusEnum = pgEnum("report_status", [
  "open",
  "under_review",
  "actioned",
  "dismissed",
]);

export const auditLogs = pgTable("audit_log", {
  id: id(),
  actorUserId: text("actor_user_id").references(() => users.id),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reports = pgTable("report", {
  id: id(),
  reporterUserId: text("reporter_user_id")
    .notNull()
    .references(() => users.id),
  targetType: reportTargetTypeEnum("target_type").notNull(),
  targetId: text("target_id").notNull(),
  reason: text("reason").notNull(),
  status: reportStatusEnum("status").notNull().default("open"),
  resolvedByUserId: text("resolved_by_user_id").references(() => users.id),
  resolutionNotes: text("resolution_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
});
