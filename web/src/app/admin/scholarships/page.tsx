import Link from "next/link";
import { reverifyScholarshipAction } from "@/lib/scholarships/admin-actions";
import { getAllScholarships } from "@/lib/scholarships/queries";
import { deriveStatus, formatDate, isStale, statusLabel } from "@/lib/scholarships/status";
import { cn } from "@/lib/utils";

export default async function AdminScholarshipsPage() {
  const all = await getAllScholarships();
  const staleCount = all.filter((s) => isStale(s.lastVerifiedAt)).length;

  return (
    <div className="mx-auto max-w-[1240px] px-7 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[28px] font-semibold tracking-[-0.02em]">Scholarships</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {all.length} listings · {staleCount} not re-verified in the last 45 days
          </p>
        </div>
        <Link href="/admin/scholarships/new" className="rounded-full bg-crimson px-5 py-2.5 text-sm font-bold text-white hover:bg-ink">
          + New scholarship
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Deadline</th>
              <th className="px-4 py-3">Last verified</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {all.map((s) => {
              const status = deriveStatus(s);
              const stale = isStale(s.lastVerifiedAt);
              return (
                <tr key={s.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3">
                    <div className="font-bold">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.providerName}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-extrabold",
                        status === "closing_soon" && "bg-danger-bg text-crimson",
                        status === "closed" && "bg-muted text-muted-foreground",
                        status === "open" && "bg-success-bg text-success",
                      )}
                    >
                      {statusLabel(status)}
                    </span>
                  </td>
                  <td className="px-4 py-3">{s.closeDate ? formatDate(s.closeDate) : "Rolling"}</td>
                  <td className={cn("px-4 py-3", stale && "font-bold text-crimson")}>
                    {formatDate(s.lastVerifiedAt.toISOString().slice(0, 10))}
                    {stale && " ⚠"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <form action={reverifyScholarshipAction}>
                        <input type="hidden" name="id" value={s.id} />
                        <button type="submit" className="rounded-full border border-input px-3 py-1.5 text-xs font-bold hover:border-ink">
                          Mark re-verified
                        </button>
                      </form>
                      <Link
                        href={`/admin/scholarships/${s.id}/edit`}
                        className="rounded-full border border-input px-3 py-1.5 text-xs font-bold hover:border-ink"
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
