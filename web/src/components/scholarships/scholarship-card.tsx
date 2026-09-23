import Link from "next/link";
import { Bookmark, Check, Scale } from "lucide-react";
import type { Scholarship } from "@/lib/db/schema";
import { classificationLabel, type MatchResult } from "@/lib/scholarships/match";
import { deadlineLabel, deriveStatus, statusLabel } from "@/lib/scholarships/status";
import { buildHref, type FilterState } from "@/lib/scholarships/filters";
import { toggleSaveScholarship } from "@/lib/scholarships/actions";
import { initialsOf } from "@/lib/scholarships/format";
import { cn } from "@/lib/utils";

export function ScholarshipCard({
  scholarship,
  match,
  saved,
  filterState,
}: {
  scholarship: Scholarship;
  match: MatchResult;
  saved: boolean;
  filterState: FilterState;
}) {
  const status = deriveStatus(scholarship);
  const label = statusLabel(status);
  const statusStyle =
    status === "closing_soon"
      ? "bg-danger-bg text-crimson"
      : status === "closed" || status === "archived"
        ? "bg-muted text-muted-foreground"
        : "bg-success-bg text-success";

  const inCompare = filterState.compare.includes(scholarship.id);
  const compareHref = buildHref(filterState, {
    compare: inCompare
      ? filterState.compare.filter((id) => id !== scholarship.id)
      : filterState.compare.length < 3
        ? [...filterState.compare, scholarship.id]
        : filterState.compare,
  });

  const matchColor =
    match.percent === null
      ? "text-muted-foreground"
      : match.percent >= 80
        ? "text-success"
        : match.percent >= 55
          ? "text-[#B4720A]"
          : "text-muted-foreground";

  return (
    <article
      className={cn(
        "flex flex-col gap-3.5 rounded-[20px] border bg-card p-[22px] transition-shadow hover:shadow-[0_16px_34px_rgba(20,20,26,0.1)]",
        inCompare ? "border-ink" : "border-border",
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-[5px] text-[11.5px] font-extrabold", statusStyle)}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {label}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-success-border bg-success-bg px-2.5 py-1 text-[11.5px] font-extrabold text-success">
          <Check size={11} strokeWidth={3} />
          Verified {scholarship.lastVerifiedAt.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
        </span>
        <form action={toggleSaveScholarship} className="ml-auto">
          <input type="hidden" name="scholarshipId" value={scholarship.id} />
          <input type="hidden" name="redirectTo" value="/scholarships" />
          <button
            type="submit"
            aria-label={saved ? "Unsave scholarship" : "Save scholarship"}
            title={saved ? "Unsave scholarship" : "Save scholarship"}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border transition-colors",
              saved ? "border-crimson bg-danger-bg" : "border-input bg-card",
            )}
          >
            <Bookmark size={14} className={saved ? "fill-crimson text-crimson" : "text-muted-foreground"} />
          </button>
        </form>
      </div>

      <div className="flex items-start gap-3">
        <div className="flex h-[46px] w-[46px] flex-shrink-0 items-center justify-center rounded-xl bg-muted font-display text-base font-semibold">
          {initialsOf(scholarship.name)}
        </div>
        <div className="min-w-0">
          <h2 className="text-balance text-[17px] font-bold leading-[1.28]">{scholarship.name}</h2>
          <div className="mt-1 text-[13px] text-muted-foreground">{scholarship.providerName}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-[7px]">
        <span className="rounded-lg bg-muted px-2.5 py-[5px] text-xs font-bold">{scholarship.degreeLevels.join(" / ")}</span>
        <span className="rounded-lg bg-muted px-2.5 py-[5px] text-xs font-bold">{scholarship.subjects[0]}</span>
        <span className={cn("rounded-lg px-2.5 py-[5px] text-xs font-extrabold", scholarship.fundingType === "fully_funded" ? "bg-gold" : "bg-muted")}>
          {scholarship.fundingType === "fully_funded" ? "Fully funded" : "Partially funded"}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3.5 border-y border-border py-3.5">
        <div className="min-w-[110px] flex-1">
          <div className="text-[11px] font-extrabold tracking-[0.06em] text-muted-foreground">FUNDING</div>
          <div className="mt-0.5 text-[14.5px] font-extrabold">{scholarship.fundingAmountLabel}</div>
        </div>
        <div className="min-w-[110px] flex-1">
          <div className="text-[11px] font-extrabold tracking-[0.06em] text-muted-foreground">DEADLINE</div>
          <div className={cn("mt-0.5 text-[14.5px] font-extrabold", status === "closing_soon" ? "text-crimson" : "text-ink")}>
            {deadlineLabel(scholarship)}
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-[11.5px] font-extrabold text-muted-foreground">
          <span>YOUR MATCH</span>
          <span className={matchColor}>{match.percent === null ? classificationLabel("unknown") : `${match.percent}%`}</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full", match.percent === null ? "bg-transparent" : match.percent >= 80 ? "bg-success" : match.percent >= 55 ? "bg-[#B4720A]" : "bg-muted-foreground")}
            style={{ width: `${match.percent ?? 0}%` }}
          />
        </div>
      </div>

      <div className="mt-0.5 flex items-center gap-2.5">
        <Link href={compareHref} className="flex items-center gap-2">
          <span
            className={cn(
              "flex h-[18px] w-[18px] items-center justify-center rounded-[5px] border text-[11px] font-black text-white",
              inCompare ? "border-ink bg-ink" : "border-input bg-card",
            )}
          >
            {inCompare && <Scale size={11} strokeWidth={3} />}
          </span>
          <span className="text-[13px] font-bold text-ink-2">Compare</span>
        </Link>
        <Link
          href={`/scholarships/${scholarship.slug}`}
          className="ml-auto rounded-[11px] bg-ink px-4 py-2.5 text-[13.5px] font-bold text-white transition-colors hover:bg-crimson"
        >
          View Scholarship
        </Link>
      </div>
    </article>
  );
}
