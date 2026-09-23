import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { id } from "./common";
import { orders } from "./orders";
import { users } from "./users";

export const documentKindEnum = pgEnum("document_kind", [
  "cv",
  "academic_transcript",
  "degree_certificate",
  "language_certificate",
  "recommendation_letter",
  "motivation_letter",
  "identification",
  "research_proposal",
  "work_experience_letter",
  "other",
]);

export const virusScanStatusEnum = pgEnum("virus_scan_status", [
  "pending",
  "clean",
  "infected",
  "error",
]);

export const documentAccessActionEnum = pgEnum("document_access_action", [
  "view",
  "download",
]);

/**
 * A document's bytes are never referenced by the app directly — only
 * `storageKey` into private, EU-region object storage. Access is opt-in
 * per grant (see `documentAccessGrants`); an adviser never gets implicit
 * access just by being messaged or assigned an order.
 */
export const documents = pgTable("document", {
  id: id(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  kind: documentKindEnum("kind").notNull(),
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  storageKey: text("storage_key").notNull(),
  checksumSha256: text("checksum_sha256").notNull(),
  virusScanStatus: virusScanStatusEnum("virus_scan_status").notNull().default("pending"),
  currentVersion: integer("current_version").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const documentVersions = pgTable("document_version", {
  id: id(),
  documentId: uuid("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  versionNumber: integer("version_number").notNull(),
  storageKey: text("storage_key").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * The student explicitly grants one adviser access to one document for one
 * order, optionally time-boxed. Revoking sets `revokedAt` immediately.
 */
export const documentAccessGrants = pgTable("document_access_grant", {
  id: id(),
  documentId: uuid("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  granteeUserId: text("grantee_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  grantedByUserId: text("granted_by_user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const documentAccessLogs = pgTable("document_access_log", {
  id: id(),
  documentId: uuid("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  accessedByUserId: text("accessed_by_user_id")
    .notNull()
    .references(() => users.id),
  action: documentAccessActionEnum("action").notNull(),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const documentsRelations = relations(documents, ({ one, many }) => ({
  owner: one(users, { fields: [documents.ownerId], references: [users.id] }),
  versions: many(documentVersions),
  accessGrants: many(documentAccessGrants),
}));

export const documentAccessGrantsRelations = relations(documentAccessGrants, ({ one }) => ({
  document: one(documents, {
    fields: [documentAccessGrants.documentId],
    references: [documents.id],
  }),
  order: one(orders, { fields: [documentAccessGrants.orderId], references: [orders.id] }),
  grantee: one(users, {
    fields: [documentAccessGrants.granteeUserId],
    references: [users.id],
  }),
}));

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;
