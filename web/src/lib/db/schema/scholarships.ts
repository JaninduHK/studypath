import { relations, sql } from "drizzle-orm";
import {
  boolean,
  date,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { id, timestamps } from "./common";
import { users } from "./users";

export const fundingTypeEnum = pgEnum("funding_type", [
  "fully_funded",
  "partial",
]);

export const scholarshipStatusEnum = pgEnum("scholarship_status", [
  "open",
  "closing_soon",
  "closed",
  "archived",
]);

export const scholarships = pgTable("scholarship", {
  id: id(),
  slug: text("slug").notNull().unique(),

  name: text("name").notNull(),
  providerName: text("provider_name").notNull(),
  universityName: text("university_name"),

  degreeLevels: jsonb("degree_levels").$type<string[]>().notNull().default([]),
  subjects: jsonb("subjects").$type<string[]>().notNull().default([]),

  summary: text("summary").notNull(),
  overview: jsonb("overview").$type<string[]>().notNull().default([]),
  applicationsPerYearLabel: text("applications_per_year_label"),
  placesAvailableLabel: text("places_available_label"),

  fundingType: fundingTypeEnum("funding_type").notNull(),
  fundingAmountLabel: text("funding_amount_label").notNull(),
  fundingAmountMin: numeric("funding_amount_min", { precision: 10, scale: 2 }),
  fundingAmountMax: numeric("funding_amount_max", { precision: 10, scale: 2 }),
  fundingCurrency: text("funding_currency").notNull().default("EUR"),
  coveredExpenses: jsonb("covered_expenses").$type<string[]>().notNull().default([]),

  eligibleNationalities: jsonb("eligible_nationalities")
    .$type<"all" | string[]>()
    .notNull()
    .default(sql`'"all"'::jsonb`),
  eligibleCountriesLabel: text("eligible_countries_label"),
  countryOfResidenceRestriction: text("country_of_residence_restriction"),
  eligibilityRequirements: jsonb("eligibility_requirements")
    .$type<{ title: string; detail: string }[]>()
    .notNull()
    .default([]),
  languageRequirements: jsonb("language_requirements")
    .$type<{ language: string; test: string; minScore: string }[]>()
    .notNull()
    .default([]),
  gpaRequirement: text("gpa_requirement"),
  gpaRequirementMaxGerman: numeric("gpa_requirement_max_german", { precision: 3, scale: 2 }),
  workExperienceRequirement: text("work_experience_requirement"),
  workExperienceMinYears: numeric("work_experience_min_years", { precision: 4, scale: 1 }),
  requiredDocuments: jsonb("required_documents")
    .$type<{ label: string; note: string }[]>()
    .notNull()
    .default([]),

  openDate: date("open_date"),
  closeDate: date("close_date"),
  isRollingDeadline: boolean("is_rolling_deadline").notNull().default(false),
  importantDatesExtra: jsonb("important_dates_extra")
    .$type<{ label: string; value: string }[]>()
    .notNull()
    .default([]),

  studyLocationLabel: text("study_location_label"),
  applicationMethodLabel: text("application_method_label"),
  applicationProcessNote: text("application_process_note"),
  applicationSteps: jsonb("application_steps")
    .$type<{ title: string; dateLabel: string; body: string }[]>()
    .notNull()
    .default([]),
  applicationProcess: text("application_process"),
  officialApplicationUrl: text("official_application_url"),
  officialSources: jsonb("official_sources")
    .$type<{ tag: string; title: string; url: string }[]>()
    .notNull()
    .default([]),

  fundingBreakdown: jsonb("funding_breakdown")
    .$type<{ label: string; value: string; status: "covered" | "partial" | "not_covered" }[]>()
    .notNull()
    .default([]),
  fundingTotalValueLabel: text("funding_total_value_label"),
  fundingTotalPeriodLabel: text("funding_total_period_label"),

  status: scholarshipStatusEnum("status").notNull().default("open"),
  lastVerifiedAt: timestamp("last_verified_at", { withTimezone: true }).notNull().defaultNow(),
  lastVerifiedByUserId: text("last_verified_by_user_id").references(() => users.id),

  supersededByScholarshipId: uuid("superseded_by_scholarship_id"),

  ...timestamps,
});

export const scholarshipChangeHistory = pgTable("scholarship_change_history", {
  id: id(),
  scholarshipId: uuid("scholarship_id")
    .notNull()
    .references(() => scholarships.id, { onDelete: "cascade" }),
  field: text("field").notNull(),
  oldValue: text("old_value"),
  newValue: text("new_value"),
  changedByUserId: text("changed_by_user_id").references(() => users.id),
  changedAt: timestamp("changed_at", { withTimezone: true }).notNull().defaultNow(),
});

export const savedScholarships = pgTable("saved_scholarship", {
  id: id(),
  studentId: text("student_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  scholarshipId: uuid("scholarship_id")
    .notNull()
    .references(() => scholarships.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const scholarshipsRelations = relations(scholarships, ({ many }) => ({
  changeHistory: many(scholarshipChangeHistory),
  savedBy: many(savedScholarships),
}));

export const scholarshipChangeHistoryRelations = relations(
  scholarshipChangeHistory,
  ({ one }) => ({
    scholarship: one(scholarships, {
      fields: [scholarshipChangeHistory.scholarshipId],
      references: [scholarships.id],
    }),
  }),
);

export const savedScholarshipsRelations = relations(savedScholarships, ({ one }) => ({
  scholarship: one(scholarships, {
    fields: [savedScholarships.scholarshipId],
    references: [scholarships.id],
  }),
  student: one(users, { fields: [savedScholarships.studentId], references: [users.id] }),
}));

export type Scholarship = typeof scholarships.$inferSelect;
export type NewScholarship = typeof scholarships.$inferInsert;
