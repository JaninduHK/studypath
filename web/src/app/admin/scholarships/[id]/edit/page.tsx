import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ScholarshipForm } from "@/components/admin/scholarship-form";
import { updateScholarshipAction } from "@/lib/scholarships/admin-actions";
import { db } from "@/lib/db";
import { scholarships } from "@/lib/db/schema";

export default async function EditScholarshipPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [scholarship] = await db.select().from(scholarships).where(eq(scholarships.id, id)).limit(1);
  if (!scholarship) notFound();

  return (
    <div className="mx-auto max-w-[860px] px-7 py-10">
      <h1 className="font-display text-[28px] font-semibold tracking-[-0.02em]">Edit {scholarship.name}</h1>
      <div className="mt-6 rounded-2xl border border-border bg-card p-7">
        <ScholarshipForm action={updateScholarshipAction} scholarship={scholarship} />
      </div>
    </div>
  );
}
