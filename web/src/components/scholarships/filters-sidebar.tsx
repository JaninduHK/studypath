import Link from "next/link";
import { buildHref, toggleValue, type FilterGroup, type FilterState } from "@/lib/scholarships/filters";
import { cn } from "@/lib/utils";

export function FiltersSidebar({
  groups,
  state,
  resultCount,
}: {
  groups: FilterGroup[];
  state: FilterState;
  resultCount: number;
}) {
  return (
    <aside className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto rounded-[20px] border border-border bg-card p-1.5">
      <div className="flex items-center justify-between px-3.5 pb-2.5 pt-3.5">
        <span className="text-[15px] font-extrabold">Filters</span>
        <Link href="/scholarships" className="text-[13px] font-bold text-crimson">
          Clear all
        </Link>
      </div>

      {groups.map((g) => {
        const selected = state[g.key];
        return (
          <details key={g.key} open className="group border-t border-border [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center gap-2.5 px-3.5 py-3.5">
              <span className="flex-1 text-[13.5px] font-bold text-ink">{g.title}</span>
              {selected.length > 0 && (
                <span className="rounded-full bg-crimson px-[7px] py-0.5 text-[11px] font-extrabold text-white">
                  {selected.length}
                </span>
              )}
              <span className="hidden text-[13px] font-bold text-muted-foreground group-open:inline">{"−"}</span>
              <span className="text-[13px] font-bold text-muted-foreground group-open:hidden">+</span>
            </summary>
            <div className="flex flex-col gap-2 px-3.5 pb-3.5">
              {g.options.map((o) => {
                const on = selected.includes(o.label);
                const href = buildHref(state, { [g.key]: toggleValue(selected, o.label), page: 1 } as Partial<FilterState>);
                return (
                  <Link
                    key={o.label}
                    href={href}
                    className="flex w-full items-center gap-2.5 text-left"
                  >
                    <span
                      className={cn(
                        "flex h-[17px] w-[17px] flex-shrink-0 items-center justify-center rounded-[5px] border text-[11px] font-black text-white",
                        on ? "border-crimson bg-crimson" : "border-input bg-card",
                      )}
                    >
                      {on ? "✓" : ""}
                    </span>
                    <span className={cn("flex-1 text-[13.5px] text-ink", on ? "font-bold" : "font-medium")}>
                      {o.label}
                    </span>
                    <span className="text-xs text-muted-foreground">{o.count}</span>
                  </Link>
                );
              })}
            </div>
          </details>
        );
      })}

      <div className="border-t border-border p-3.5">
        <div className="rounded-xl bg-ink py-3 text-center text-sm font-bold text-white">
          Showing {resultCount} results
        </div>
      </div>
    </aside>
  );
}
