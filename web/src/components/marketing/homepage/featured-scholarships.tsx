"use client";

import { useState } from "react";
import { Check, Clock } from "lucide-react";
import {
  scholarshipTabs,
  scholarshipsByTab,
  type ScholarshipTabKey,
} from "@/lib/data/homepage";
import { cn } from "@/lib/utils";

export function FeaturedScholarships({
  defaultTab = "closing",
}: {
  defaultTab?: ScholarshipTabKey;
}) {
  const [tab, setTab] = useState<ScholarshipTabKey>(defaultTab);
  const scholarships = scholarshipsByTab[tab];

  return (
    <section id="scholarships" className="px-7 pb-[84px] pt-2.5">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-[12.5px] font-extrabold tracking-[0.12em] text-crimson">
              FEATURED SCHOLARSHIPS
            </div>
            <h2 className="mt-3 font-display text-[clamp(30px,3.3vw,42px)] font-semibold leading-[1.12] tracking-[-0.03em]">
              Verified funding, checked this month
            </h2>
          </div>
          <div className="flex gap-1.5 rounded-full bg-muted p-[5px]">
            {scholarshipTabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "rounded-full px-4 py-2.5 font-body text-[13.5px] font-bold transition-colors",
                  tab === t.key ? "bg-ink text-white" : "bg-transparent text-ink-2",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-[34px] grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
          {scholarships.map((s) => (
            <div
              key={s.slug}
              className="flex flex-col gap-3.5 rounded-[20px] border border-border bg-card p-[22px] transition-all hover:-translate-y-[3px] hover:border-ink hover:shadow-[0_16px_34px_rgba(20,20,26,0.09)]"
            >
              <div className="flex items-start gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-[13px] bg-muted font-display text-[19px]">
                  {s.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-balance text-[16.5px] font-bold leading-[1.3]">
                    {s.name}
                  </div>
                  <div className="mt-1 text-[13px] text-muted-foreground">{s.org}</div>
                </div>
                <span className="inline-flex items-center gap-[5px] whitespace-nowrap rounded-full border border-success-border bg-success-bg px-[9px] py-[5px] text-[11.5px] font-extrabold text-success">
                  <Check size={11} strokeWidth={3} />
                  Verified
                </span>
              </div>

              <div className="flex flex-wrap gap-[7px]">
                <span className="rounded-lg bg-muted px-2.5 py-1.5 text-xs font-bold text-ink">
                  {s.level}
                </span>
                <span className="rounded-lg bg-muted px-2.5 py-1.5 text-xs font-bold text-ink">
                  {s.field}
                </span>
                <span className="rounded-lg bg-gold px-2.5 py-1.5 text-xs font-extrabold text-ink">
                  {s.funding}
                </span>
              </div>

              <div className="h-px bg-border" />

              <div className="flex items-center justify-between gap-2.5">
                <div>
                  <div className="text-[11.5px] font-bold tracking-[0.05em] text-muted-foreground">
                    AWARD
                  </div>
                  <div className="mt-0.5 text-[15px] font-extrabold">{s.amount}</div>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-[11px] py-[7px] text-xs font-extrabold",
                    s.urgent ? "bg-danger-bg text-crimson" : "bg-muted text-ink-2",
                  )}
                >
                  <Clock size={12} strokeWidth={2.4} />
                  {s.deadlineLabel}
                </span>
              </div>

              <a
                href={`/scholarships/${s.slug}`}
                className="mt-0.5 rounded-[11px] border-[1.5px] border-ink py-[11px] text-center text-sm font-bold text-ink transition-colors hover:bg-ink hover:text-white"
              >
                View details
              </a>
            </div>
          ))}
        </div>

        <div className="mt-7 flex justify-center">
          <a
            href="/scholarships"
            className="rounded-full border-[1.5px] border-input bg-card px-6 py-[13px] text-[14.5px] font-bold text-ink transition-colors hover:border-ink"
          >
            Browse all 1,842 scholarships
          </a>
        </div>
      </div>
    </section>
  );
}
