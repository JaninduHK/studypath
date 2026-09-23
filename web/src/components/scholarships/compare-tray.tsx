import Link from "next/link";
import type { Scholarship } from "@/lib/db/schema";
import { buildHref, type FilterState } from "@/lib/scholarships/filters";
import { initialsOf } from "@/lib/scholarships/format";

export function CompareTray({ items, state }: { items: Scholarship[]; state: FilterState }) {
  if (items.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] bg-ink/[0.97] px-7 py-3.5 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-4">
        <div className="whitespace-nowrap text-[13px] font-extrabold tracking-[0.08em] text-gold">
          COMPARE {items.length}/3
        </div>
        <div className="flex min-w-[200px] flex-1 flex-wrap gap-2.5">
          {items.map((s) => (
            <Link
              key={s.id}
              href={buildHref(state, { compare: state.compare.filter((id) => id !== s.id) })}
              className="flex items-center gap-2.5 rounded-[11px] border border-white/20 bg-white/10 px-3 py-2.5 text-[13px] font-bold text-white transition-colors hover:border-gold"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-white/15 text-[11px] font-extrabold">
                {initialsOf(s.name)}
              </span>
              {s.name.length > 26 ? `${s.name.slice(0, 24)}…` : s.name}
              <span className="text-sm text-gold">{"×"}</span>
            </Link>
          ))}
        </div>
        <Link href={buildHref(state, { compare: [] })} className="text-[13.5px] font-bold text-white/70">
          Clear
        </Link>
      </div>
    </div>
  );
}
