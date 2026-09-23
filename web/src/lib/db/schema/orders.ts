import { relations } from "drizzle-orm";
import { jsonb, numeric, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { id, timestamps } from "./common";
import { scholarships } from "./scholarships";
import { servicePackages } from "./services";
import { users } from "./users";

export const orderStatusEnum = pgEnum("order_status", [
  "pending_payment",
  "active",
  "delivered",
  "revision_requested",
  "completed",
  "cancelled",
  "disputed",
  "refunded",
]);

export const orderEventTypeEnum = pgEnum("order_event_type", [
  "created",
  "paid",
  "delivered",
  "revision_requested",
  "revision_delivered",
  "completed",
  "cancelled",
  "disputed",
  "dispute_resolved",
  "refunded",
  "message",
]);

export const payoutStatusEnum = pgEnum("payout_status", ["pending", "paid", "failed"]);

/**
 * `packageSnapshot` freezes the service package's terms at purchase time so
 * later edits by the adviser never retroactively change an existing order.
 */
export const orders = pgTable("order", {
  id: id(),
  studentId: text("student_id")
    .notNull()
    .references(() => users.id),
  adviserId: text("adviser_id")
    .notNull()
    .references(() => users.id),
  servicePackageId: uuid("service_package_id")
    .notNull()
    .references(() => servicePackages.id),
  relatedScholarshipId: uuid("related_scholarship_id").references(() => scholarships.id),

  packageSnapshot: jsonb("package_snapshot").notNull().$type<{
    title: string;
    serviceType: string;
    summary: string;
    whatIsIncluded: string[];
    whatIsExcluded: string[];
    deliverables: string[];
    revisionsIncluded: number;
    deliveryDays: number;
    priceAmount: string;
    currency: string;
    cancellationPolicy: string | null;
    refundPolicy: string | null;
  }>(),

  priceAmount: numeric("price_amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("EUR"),
  platformCommissionAmount: numeric("platform_commission_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),

  status: orderStatusEnum("status").notNull().default("pending_payment"),
  revisionsUsed: numeric("revisions_used", { precision: 3, scale: 0 }).notNull().default("0"),
  deliveryDueAt: timestamp("delivery_due_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),

  stripePaymentIntentId: text("stripe_payment_intent_id"),

  ...timestamps,
});

export const orderEvents = pgTable("order_event", {
  id: id(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  type: orderEventTypeEnum("type").notNull(),
  actorUserId: text("actor_user_id").references(() => users.id),
  payload: jsonb("payload").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const payouts = pgTable("payout", {
  id: id(),
  adviserId: text("adviser_id")
    .notNull()
    .references(() => users.id),
  orderId: uuid("order_id").references(() => orders.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("EUR"),
  status: payoutStatusEnum("status").notNull().default("pending"),
  stripeTransferId: text("stripe_transfer_id"),
  ...timestamps,
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  student: one(users, { fields: [orders.studentId], references: [users.id] }),
  adviser: one(users, { fields: [orders.adviserId], references: [users.id] }),
  servicePackage: one(servicePackages, {
    fields: [orders.servicePackageId],
    references: [servicePackages.id],
  }),
  relatedScholarship: one(scholarships, {
    fields: [orders.relatedScholarshipId],
    references: [scholarships.id],
  }),
  events: many(orderEvents),
}));

export const orderEventsRelations = relations(orderEvents, ({ one }) => ({
  order: one(orders, { fields: [orderEvents.orderId], references: [orders.id] }),
}));

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
