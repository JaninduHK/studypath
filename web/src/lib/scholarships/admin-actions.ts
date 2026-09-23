"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { scholarshipChangeHistory, scholarships } from "@/lib/db/schema";
import type { NewScholarship } from "@/lib/db/schema";

async function requireStaff() {
  const user = await getCurrentUser();
  if (!user || user.accountType !== "staff") {
    redirect("/login?next=/admin/scholarships");
  }
  return user;
}

/** Fields tracked in scholarship_change_history, per the spec's data-freshness requirement. */
const TRACKED_FIELDS = [
  "closeDate",
  "openDate",
  "fundingAmountLabel",
  "status",
  "officialApplicationUrl",
] as const satisfies (keyof NewScholarship)[];

/** Structured nested content — staff enter these as JSON arrays. */
const JSON_FIELDS = [
  "overview",
  "fundingBreakdown",
  "eligibilityRequirements",
  "requiredDocuments",
  "applicationSteps",
  "officialSources",
  "languageRequirements",
  "importantDatesExtra",
] as const;

/** Simple flat lists — staff enter these comma-separated. */
const COMMA_LIST_FIELDS = ["coveredExpenses", "degreeLevels", "subjects"] as const;

const ARRAY_OR_ALL_FIELDS = ["eligibleNationalities"] as const;

function parseFormToScholarship(formData: FormData): Partial<NewScholarship> {
  const get = (name: string) => (formData.get(name) as string | null)?.trim() || null;

  const row: Record<string, unknown> = {
    slug: get("slug"),
    name: get("name"),
    providerName: get("providerName"),
    universityName: get("universityName"),
    summary: get("summary"),
    fundingType: get("fundingType"),
    fundingAmountLabel: get("fundingAmountLabel"),
    fundingAmountMin: get("fundingAmountMin"),
    fundingAmountMax: get("fundingAmountMax"),
    fundingCurrency: get("fundingCurrency") || "EUR",
    fundingTotalValueLabel: get("fundingTotalValueLabel"),
    fundingTotalPeriodLabel: get("fundingTotalPeriodLabel"),
    countryOfResidenceRestriction: get("countryOfResidenceRestriction"),
    eligibleCountriesLabel: get("eligibleCountriesLabel"),
    gpaRequirement: get("gpaRequirement"),
    gpaRequirementMaxGerman: get("gpaRequirementMaxGerman"),
    workExperienceRequirement: get("workExperienceRequirement"),
    workExperienceMinYears: get("workExperienceMinYears"),
    openDate: get("openDate"),
    closeDate: get("closeDate"),
    isRollingDeadline: formData.get("isRollingDeadline") === "on",
    studyLocationLabel: get("studyLocationLabel"),
    applicationMethodLabel: get("applicationMethodLabel"),
    applicationProcessNote: get("applicationProcessNote"),
    applicationProcess: get("applicationProcess"),
    officialApplicationUrl: get("officialApplicationUrl"),
    applicationsPerYearLabel: get("applicationsPerYearLabel"),
    placesAvailableLabel: get("placesAvailableLabel"),
    status: get("status") || "open",
  };

  for (const field of JSON_FIELDS) {
    const raw = get(field);
    if (raw === null) {
      row[field] = [];
      continue;
    }
    try {
      row[field] = JSON.parse(raw);
    } catch {
      throw new Error(`Invalid JSON in "${field}" field.`);
    }
  }

  for (const field of COMMA_LIST_FIELDS) {
    const raw = get(field);
    row[field] = raw ? raw.split(",").map((s) => s.trim()).filter(Boolean) : [];
  }

  for (const field of ARRAY_OR_ALL_FIELDS) {
    const raw = get(field);
    if (!raw || raw.trim().toLowerCase() === "all") {
      row[field] = "all";
    } else {
      try {
        row[field] = JSON.parse(raw);
      } catch {
        row[field] = raw.split(",").map((s) => s.trim()).filter(Boolean);
      }
    }
  }

  return row as Partial<NewScholarship>;
}

export async function createScholarshipAction(formData: FormData) {
  const user = await requireStaff();
  const row = parseFormToScholarship(formData);

  const [inserted] = await db
    .insert(scholarships)
    .values({
      ...(row as NewScholarship),
      lastVerifiedAt: new Date(),
      lastVerifiedByUserId: user.id,
    })
    .returning({ id: scholarships.id });

  await db.insert(scholarshipChangeHistory).values({
    scholarshipId: inserted.id,
    field: "listing",
    oldValue: null,
    newValue: "created",
    changedByUserId: user.id,
  });

  revalidatePath("/admin/scholarships");
  revalidatePath("/scholarships");
  redirect("/admin/scholarships");
}

export async function updateScholarshipAction(formData: FormData) {
  const user = await requireStaff();
  const id = formData.get("id") as string;
  const row = parseFormToScholarship(formData);

  const [existing] = await db.select().from(scholarships).where(eq(scholarships.id, id)).limit(1);
  if (!existing) throw new Error("Scholarship not found.");

  const changeRows = TRACKED_FIELDS.filter((f) => String(existing[f] ?? "") !== String(row[f] ?? "")).map(
    (f) => ({
      scholarshipId: id,
      field: f,
      oldValue: existing[f] === null || existing[f] === undefined ? null : String(existing[f]),
      newValue: row[f] === null || row[f] === undefined ? null : String(row[f]),
      changedByUserId: user.id,
    }),
  );

  await db
    .update(scholarships)
    .set({ ...row, lastVerifiedAt: new Date(), lastVerifiedByUserId: user.id })
    .where(eq(scholarships.id, id));

  if (changeRows.length > 0) {
    await db.insert(scholarshipChangeHistory).values(changeRows);
  }

  revalidatePath("/admin/scholarships");
  revalidatePath("/scholarships");
  revalidatePath(`/scholarships/${row.slug ?? existing.slug}`);
  redirect("/admin/scholarships");
}

export async function reverifyScholarshipAction(formData: FormData) {
  const user = await requireStaff();
  const id = formData.get("id") as string;

  const [existing] = await db.select({ slug: scholarships.slug }).from(scholarships).where(eq(scholarships.id, id)).limit(1);
  if (!existing) return;

  await db
    .update(scholarships)
    .set({ lastVerifiedAt: new Date(), lastVerifiedByUserId: user.id })
    .where(eq(scholarships.id, id));

  await db.insert(scholarshipChangeHistory).values({
    scholarshipId: id,
    field: "verification",
    oldValue: null,
    newValue: "Re-verified, no changes",
    changedByUserId: user.id,
  });

  revalidatePath("/admin/scholarships");
  revalidatePath("/scholarships");
  revalidatePath(`/scholarships/${existing.slug}`);
}
