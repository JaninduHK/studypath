"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function DocumentsChecklist({ documents }: { documents: { label: string; note: string }[] }) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const doneCount = Object.values(checked).filter(Boolean).length;
  const pct = documents.length ? Math.round((doneCount / documents.length) * 100) : 0;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-2xl font-semibold tracking-[-0.028em]">Required documents</h2>
        <div className="text-[13.5px] font-bold text-muted-foreground">
          {doneCount} of {documents.length} ready
        </div>
      </div>
      <div className="mt-2.5 h-[7px] overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-[linear-gradient(90deg,#C8102E,#FFCE00)] transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(270px,1fr))] gap-2.5">
        {documents.map((d, i) => {
          const on = !!checked[i];
          return (
            <button
              key={d.label}
              type="button"
              onClick={() => setChecked((s) => ({ ...s, [i]: !s[i] }))}
              className={cn(
                "flex items-start gap-2.5 rounded-[13px] border p-3.5 text-left transition-colors",
                on ? "border-success-border bg-success-bg" : "border-border bg-card",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-[19px] w-[19px] flex-shrink-0 items-center justify-center rounded-[6px] border text-[11px] font-black text-white",
                  on ? "border-success bg-success" : "border-input bg-card",
                )}
              >
                {on ? "✓" : ""}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-ink">{d.label}</span>
                <span className="mt-0.5 block text-[12.5px] leading-[1.45] text-muted-foreground">{d.note}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
