import { ScholarshipForm } from "@/components/admin/scholarship-form";
import { createScholarshipAction } from "@/lib/scholarships/admin-actions";

export default function NewScholarshipPage() {
  return (
    <div className="mx-auto max-w-[860px] px-7 py-10">
      <h1 className="font-display text-[28px] font-semibold tracking-[-0.02em]">New scholarship</h1>
      <div className="mt-6 rounded-2xl border border-border bg-card p-7">
        <ScholarshipForm action={createScholarshipAction} />
      </div>
    </div>
  );
}
