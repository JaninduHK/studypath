import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { timestamps } from "./common";

/**
 * `accountType` is the primary role that decides which app shell a user
 * lands in. `staffRole` further separates admin-area permissions, per the
 * spec's requirement that a moderator, support agent, scholarship editor,
 * and administrator not all share the same access.
 */
export const accountTypeEnum = pgEnum("account_type", [
  "student",
  "adviser",
  "staff",
]);

export const staffRoleEnum = pgEnum("staff_role", [
  "administrator",
  "moderator",
  "support_agent",
  "scholarship_editor",
]);

export const adviserVerificationStatusEnum = pgEnum("adviser_verification_status", [
  "unsubmitted",
  "pending",
  "approved",
  "rejected",
  "suspended",
]);

// --- Auth.js-compatible core tables -------------------------------------
// Shape matches @auth/drizzle-adapter's DefaultPostgresSchema contract,
// with extra application columns appended (the adapter only reads/writes
// the columns it knows about).

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),

  hashedPassword: text("hashed_password"),
  accountType: accountTypeEnum("account_type").notNull().default("student"),
  staffRole: staffRoleEnum("staff_role"),
  suspendedAt: timestamp("suspended_at", { withTimezone: true }),
  ...timestamps,
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ],
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })],
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (a) => [primaryKey({ columns: [a.userId, a.credentialID] })],
);

// --- Domain profiles ------------------------------------------------------

export const studentProfiles = pgTable("student_profile", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),

  nationality: text("nationality"),
  countryOfResidence: text("country_of_residence"),
  educationLevel: text("education_level"),
  currentQualification: text("current_qualification"),
  gpa: numeric("gpa", { precision: 4, scale: 2 }),
  gpaScale: text("gpa_scale"),
  fieldOfStudy: text("field_of_study"),
  targetDegreeLevel: text("target_degree_level"),
  preferredSubjects: jsonb("preferred_subjects").$type<string[]>().default([]),
  languageQualifications: jsonb("language_qualifications")
    .$type<{ language: string; test: string; score: string }[]>()
    .default([]),
  workExperienceYears: numeric("work_experience_years", { precision: 4, scale: 1 }),
  researchExperience: text("research_experience"),
  preferredUniversities: jsonb("preferred_universities").$type<string[]>().default([]),
  fundingRequirement: text("funding_requirement"),

  consentProcessingAcceptedAt: timestamp("consent_processing_accepted_at", {
    withTimezone: true,
  }),
  marketingOptIn: boolean("marketing_opt_in").notNull().default(false),

  ...timestamps,
});

export const adviserProfiles = pgTable("adviser_profile", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),

  professionalTitle: text("professional_title"),
  bio: text("bio"),
  country: text("country"),
  timezone: text("timezone"),

  verificationStatus: adviserVerificationStatusEnum("verification_status")
    .notNull()
    .default("unsubmitted"),
  identityVerifiedAt: timestamp("identity_verified_at", { withTimezone: true }),
  verificationNotes: text("verification_notes"),

  qualifications: jsonb("qualifications").$type<string[]>().default([]),
  experienceYears: numeric("experience_years", { precision: 4, scale: 1 }),
  languages: jsonb("languages").$type<string[]>().default([]),
  specializationFields: jsonb("specialization_fields").$type<string[]>().default([]),
  supportedDegreeLevels: jsonb("supported_degree_levels").$type<string[]>().default([]),
  portfolioSamples: jsonb("portfolio_samples")
    .$type<{ title: string; description: string; documentId: string | null }[]>()
    .default([]),

  responseTimeHours: numeric("response_time_hours", { precision: 5, scale: 1 }),

  // Denormalized for fast listing/sort; recomputed from reviews/orders.
  ratingAverage: numeric("rating_average", { precision: 3, scale: 2 }),
  ratingCount: integer("rating_count").notNull().default(0),
  completedOrderCount: integer("completed_order_count").notNull().default(0),
  onTimeDeliveryRate: numeric("on_time_delivery_rate", { precision: 5, scale: 2 }),
  repeatClientRate: numeric("repeat_client_rate", { precision: 5, scale: 2 }),

  independenceDisclaimerAcceptedAt: timestamp("independence_disclaimer_accepted_at", {
    withTimezone: true,
  }),

  ...timestamps,
});

export const usersRelations = relations(users, ({ one, many }) => ({
  studentProfile: one(studentProfiles, {
    fields: [users.id],
    references: [studentProfiles.userId],
  }),
  adviserProfile: one(adviserProfiles, {
    fields: [users.id],
    references: [adviserProfiles.userId],
  }),
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const studentProfilesRelations = relations(studentProfiles, ({ one }) => ({
  user: one(users, { fields: [studentProfiles.userId], references: [users.id] }),
}));

export const adviserProfilesRelations = relations(adviserProfiles, ({ one }) => ({
  user: one(users, { fields: [adviserProfiles.userId], references: [users.id] }),
}));

export type AccountType = (typeof accountTypeEnum.enumValues)[number];
export type StaffRole = (typeof staffRoleEnum.enumValues)[number];

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type StudentProfile = typeof studentProfiles.$inferSelect;
export type AdviserProfile = typeof adviserProfiles.$inferSelect;
