"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { savedScholarships } from "@/lib/db/schema";

export async function toggleSaveScholarship(formData: FormData) {
  const scholarshipId = formData.get("scholarshipId") as string;
  const redirectTo = formData.get("redirectTo") as string | null;

  const user = await getCurrentUser();
  if (!user || user.accountType !== "student") {
    redirect(`/login?next=${encodeURIComponent(redirectTo ?? "/scholarships")}`);
  }

  const [existing] = await db
    .select({ id: savedScholarships.id })
    .from(savedScholarships)
    .where(and(eq(savedScholarships.studentId, user.id), eq(savedScholarships.scholarshipId, scholarshipId)))
    .limit(1);

  if (existing) {
    await db.delete(savedScholarships).where(eq(savedScholarships.id, existing.id));
  } else {
    await db.insert(savedScholarships).values({ studentId: user.id, scholarshipId });
  }

  if (redirectTo) revalidatePath(redirectTo);
  revalidatePath("/scholarships");
}
