"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { reports } from "@/lib/db/schema";
import { redirect } from "next/navigation";

export async function reportScholarshipIssue(formData: FormData) {
  const scholarshipId = formData.get("scholarshipId") as string;
  const slug = formData.get("slug") as string;
  const reason = formData.get("reason") as string;
  const details = (formData.get("details") as string | null) ?? "";

  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/scholarships/${slug}`)}`);
  }

  await db.insert(reports).values({
    reporterUserId: user.id,
    targetType: "scholarship",
    targetId: scholarshipId,
    reason: details ? `${reason}: ${details}` : reason,
  });

  revalidatePath(`/scholarships/${slug}`);
}
