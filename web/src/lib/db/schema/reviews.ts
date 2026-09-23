import { relations } from "drizzle-orm";
import { integer, jsonb, numeric, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { id } from "./common";
import { orders } from "./orders";
import { servicePackages } from "./services";
import { users } from "./users";

export const disputeStatusEnum = pgEnum("dispute_status", [
  "open",
  "under_review",
  "resolved",
  "rejected",
]);

/** One review per order, only issuable once the order is `completed`. */
export const reviews = pgTable("review", {
  id: id(),
  orderId: uuid("order_id")
    .notNull()
    .unique()
    .references(() => orders.id, { onDelete: "cascade" }),
  studentId: text("student_id")
    .notNull()
    .references(() => users.id),
  adviserId: text("adviser_id")
    .notNull()
    .references(() => users.id),
  servicePackageId: uuid("service_package_id")
    .notNull()
    .references(() => servicePackages.id),

  ratingCommunication: integer("rating_communication").notNull(),
  ratingTimeliness: integer("rating_timeliness").notNull(),
  ratingQuality: integer("rating_quality").notNull(),
  ratingAccuracy: integer("rating_accuracy").notNull(),

  comment: text("comment"),
  adviserResponse: text("adviser_response"),
  adviserRespondedAt: timestamp("adviser_responded_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const disputes = pgTable("dispute", {
  id: id(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  raisedByUserId: text("raised_by_user_id")
    .notNull()
    .references(() => users.id),
  reason: text("reason").notNull(),
  status: disputeStatusEnum("status").notNull().default("open"),
  evidence: jsonb("evidence").$type<{ note: string; documentId: string | null }[]>().default([]),
  resolutionNotes: text("resolution_notes"),
  resolvedByUserId: text("resolved_by_user_id").references(() => users.id),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  refundAmount: numeric("refund_amount", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
  order: one(orders, { fields: [reviews.orderId], references: [orders.id] }),
  student: one(users, { fields: [reviews.studentId], references: [users.id] }),
  adviser: one(users, { fields: [reviews.adviserId], references: [users.id] }),
}));

export const disputesRelations = relations(disputes, ({ one }) => ({
  order: one(orders, { fields: [disputes.orderId], references: [orders.id] }),
  raisedBy: one(users, { fields: [disputes.raisedByUserId], references: [users.id] }),
}));

export type Review = typeof reviews.$inferSelect;
