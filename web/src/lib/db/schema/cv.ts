import { relations } from "drizzle-orm";
import { integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { id, timestamps } from "./common";
import { users } from "./users";

export const cvLanguageEnum = pgEnum("cv_language", ["en", "de"]);
export const cvStatusEnum = pgEnum("cv_status", ["draft", "final"]);

export type CvSection = {
  key: string;
  type:
    | "personal_information"
    | "summary"
    | "education"
    | "employment"
    | "research_experience"
    | "projects"
    | "publications"
    | "awards"
    | "certifications"
    | "skills"
    | "languages"
    | "volunteering"
    | "references"
    | "custom";
  title: string;
  order: number;
  content: unknown;
};

export const cvDocuments = pgTable("cv_document", {
  id: id(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  templateKey: text("template_key").notNull(),
  language: cvLanguageEnum("language").notNull().default("en"),
  status: cvStatusEnum("status").notNull().default("draft"),
  sections: jsonb("sections").$type<CvSection[]>().notNull().default([]),
  ...timestamps,
});

export const cvVersions = pgTable("cv_version", {
  id: id(),
  cvDocumentId: uuid("cv_document_id")
    .notNull()
    .references(() => cvDocuments.id, { onDelete: "cascade" }),
  versionNumber: integer("version_number").notNull(),
  snapshot: jsonb("snapshot").$type<CvSection[]>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const cvDocumentsRelations = relations(cvDocuments, ({ one, many }) => ({
  owner: one(users, { fields: [cvDocuments.ownerId], references: [users.id] }),
  versions: many(cvVersions),
}));

export const cvVersionsRelations = relations(cvVersions, ({ one }) => ({
  cvDocument: one(cvDocuments, {
    fields: [cvVersions.cvDocumentId],
    references: [cvDocuments.id],
  }),
}));

export type CvDocument = typeof cvDocuments.$inferSelect;
