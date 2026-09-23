import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { savedScholarships, scholarshipChangeHistory, scholarships, studentProfiles } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth/session";

export async function getAllScholarships() {
  return db.select().from(scholarships).orderBy(desc(scholarships.lastVerifiedAt));
}

export async function getScholarshipBySlug(slug: string) {
  const [row] = await db.select().from(scholarships).where(eq(scholarships.slug, slug)).limit(1);
  return row ?? null;
}

export async function getSimilarScholarships(current: { id: string; degreeLevels: string[]; subjects: string[] }, limit = 4) {
  const all = await getAllScholarships();
  return all
    .filter((s) => s.id !== current.id)
    .map((s) => {
      const levelHit = s.degreeLevels.some((l) => current.degreeLevels.includes(l));
      const subjectHit = s.subjects.some((f) => current.subjects.includes(f));
      return { scholarship: s, score: (levelHit ? 1 : 0) + (subjectHit ? 1 : 0) };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.scholarship);
}

export async function getScholarshipChangeHistory(scholarshipId: string) {
  return db
    .select()
    .from(scholarshipChangeHistory)
    .where(eq(scholarshipChangeHistory.scholarshipId, scholarshipId))
    .orderBy(desc(scholarshipChangeHistory.changedAt));
}

export async function getCurrentStudentProfile() {
  const user = await getCurrentUser();
  if (!user || user.accountType !== "student") return null;
  const [profile] = await db
    .select()
    .from(studentProfiles)
    .where(eq(studentProfiles.userId, user.id))
    .limit(1);
  return profile ?? null;
}

export async function getSavedScholarshipIds(): Promise<Set<string>> {
  const user = await getCurrentUser();
  if (!user || user.accountType !== "student") return new Set();
  const rows = await db
    .select({ scholarshipId: savedScholarships.scholarshipId })
    .from(savedScholarships)
    .where(eq(savedScholarships.studentId, user.id));
  return new Set(rows.map((r) => r.scholarshipId));
}
