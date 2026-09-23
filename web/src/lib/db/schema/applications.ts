import { relations } from "drizzle-orm";
import { boolean, date, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { id, timestamps } from "./common";
import { documents } from "./documents";
import { scholarships } from "./scholarships";
import { users } from "./users";

export const applicationStageEnum = pgEnum("application_stage", [
  "interested",
  "preparing",
  "ready_for_review",
  "submitted",
  "interview",
  "awarded",
  "rejected",
  "withdrawn",
  "archived",
]);

export const applications = pgTable("application", {
  id: id(),
  studentId: text("student_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  scholarshipId: uuid("scholarship_id").references(() => scholarships.id),

  stage: applicationStageEnum("stage").notNull().default("interested"),
  progressPercent: integer("progress_percent").notNull().default(0),
  notes: text("notes"),
  deadline: date("deadline"),
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
  resultDecidedAt: timestamp("result_decided_at", { withTimezone: true }),

  ...timestamps,
});

export const applicationTasks = pgTable("application_task", {
  id: id(),
  applicationId: uuid("application_id")
    .notNull()
    .references(() => applications.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  done: boolean("done").notNull().default(false),
  dueDate: date("due_date"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const applicationDocuments = pgTable("application_document", {
  id: id(),
  applicationId: uuid("application_id")
    .notNull()
    .references(() => applications.id, { onDelete: "cascade" }),
  documentId: uuid("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  student: one(users, { fields: [applications.studentId], references: [users.id] }),
  scholarship: one(scholarships, {
    fields: [applications.scholarshipId],
    references: [scholarships.id],
  }),
  tasks: many(applicationTasks),
  documents: many(applicationDocuments),
}));

export const applicationTasksRelations = relations(applicationTasks, ({ one }) => ({
  application: one(applications, {
    fields: [applicationTasks.applicationId],
    references: [applications.id],
  }),
}));

export type Application = typeof applications.$inferSelect;
