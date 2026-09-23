import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";

export default async function AdminOverviewPage() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-[720px] px-7 py-16">
      <div className="text-[12.5px] font-extrabold tracking-[0.12em] text-crimson">ADMIN OVERVIEW</div>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.02em]">
        Welcome, {user?.name ?? user?.email}
      </h1>
      <p className="mt-4 text-ink-2">
        Staff role <strong className="font-semibold">{user?.staffRole ?? "unassigned"}</strong>. Scholarship
        moderation is live; adviser verification, orders, disputes and reports queues are still ahead.
      </p>
      <Link
        href="/admin/scholarships"
        className="mt-6 inline-block rounded-full bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-crimson"
      >
        Manage scholarships
      </Link>
    </div>
  );
}
