import { relations } from "drizzle-orm";
import { integer, jsonb, numeric, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { id, timestamps } from "./common";
import { users } from "./users";

export const serviceTypeEnum = pgEnum("service_type", [
  "eligibility_assessment",
  "scholarship_shortlist",
  "cv_review",
  "cv_creation",
  "motivation_letter_coaching",
  "document_review",
  "interview_preparation",
  "other",
]);

export const servicePackageStatusEnum = pgEnum("service_package_status", [
  "draft",
  "pending_review",
  "active",
  "paused",
]);

export const servicePackages = pgTable("service_package", {
  id: id(),
  adviserId: text("adviser_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  slug: text("slug").notNull().unique(),

  title: text("title").notNull(),
  serviceType: serviceTypeEnum("service_type").notNull(),
  summary: text("summary").notNull(),

  whatIsIncluded: jsonb("what_is_included").$type<string[]>().notNull().default([]),
  whatIsExcluded: jsonb("what_is_excluded").$type<string[]>().notNull().default([]),
  deliverables: jsonb("deliverables").$type<string[]>().notNull().default([]),
  studentPrerequisites: jsonb("student_prerequisites").$type<string[]>().notNull().default([]),
  processSteps: jsonb("process_steps")
    .$type<{ title: string; description: string; dayOffset: number }[]>()
    .notNull()
    .default([]),

  revisionsIncluded: integer("revisions_included").notNull().default(0),
  deliveryDays: integer("delivery_days").notNull(),

  priceAmount: numeric("price_amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("EUR"),

  cancellationPolicy: text("cancellation_policy"),
  refundPolicy: text("refund_policy"),

  status: servicePackageStatusEnum("status").notNull().default("draft"),

  ...timestamps,
});

export const servicePackagesRelations = relations(servicePackages, ({ one }) => ({
  adviser: one(users, { fields: [servicePackages.adviserId], references: [users.id] }),
}));

export type ServicePackage = typeof servicePackages.$inferSelect;
export type NewServicePackage = typeof servicePackages.$inferInsert;
