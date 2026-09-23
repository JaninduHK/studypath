import Link from "next/link";
import { Search } from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { ScholarshipCard } from "@/components/scholarships/scholarship-card";
import { FiltersSidebar } from "@/components/scholarships/filters-sidebar";
import { CompareTray } from "@/components/scholarships/compare-tray";
import { DirectoryFaq } from "@/components/scholarships/directory-faq";
import { HiddenFilterInputs } from "@/components/scholarships/filter-form-inputs";
import { SortSelect } from "@/components/scholarships/sort-select";
import {
  PER_PAGE,
  buildHref,
  computeFilterGroups,
  filterAndSort,
  hasActiveFilters,
  parseFilterState,
  toggleValue,
} from "@/lib/scholarships/filters";
import { getAllScholarships, getCurrentStudentProfile, getSavedScholarshipIds } from "@/lib/scholarships/queries";
import { cn } from "@/lib/utils";

const POPULAR_CHIPS = [
  { group: "funding", value: "Fully funded" },
  { group: "status", value: "Closing soon" },
  { group: "level", value: "Master's" },
  { group: "level", value: "PhD" },
  { group: "field", value: "Engineering" },
] as const;

export const metadata = {
  title: "Scholarships in Germany for international students | Studienpfad",
  description:
    "Verified scholarships for Bachelor, Master, PhD and postdoc study in Germany — DAAD, political foundations, Deutschlandstipendium and university awards. Filter by degree, field, nationality and deadline.",
};

export default async function ScholarshipDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const state = parseFilterState(sp);

  const [all, profile, savedIds] = await Promise.all([
    getAllScholarships(),
    getCurrentStudentProfile(),
    getSavedScholarshipIds(),
  ]);

  const filtered = filterAndSort(all, state, profile);
  const groups = computeFilterGroups(all);
  const active = hasActiveFilters(state);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const page = Math.min(state.page, pageCount);
  const start = (page - 1) * PER_PAGE;
  const pageItems = filtered.slice(start, start + PER_PAGE);

  const compareItems = all.filter((s) => state.compare.includes(s.id));

  const activePillEntries: { key: string; label: string; href: string }[] = [];
  for (const key of ["level", "field", "nat", "funding", "status", "deadline", "provider", "lang", "gpa", "work"] as const) {
    for (const value of state[key]) {
      activePillEntries.push({
        key: `${key}:${value}`,
        label: value,
        href: buildHref(state, { [key]: toggleValue(state[key], value), page: 1 } as never),
      });
    }
  }
  if (state.amount > 0) {
    activePillEntries.push({ key: "amount", label: `≥ €${state.amount}/mo`, href: buildHref(state, { amount: 0, page: 1 }) });
  }

  return (
    <div className="min-h-screen bg-background pb-[120px]">
      <SiteHeader />

      <div className="mx-auto max-w-[1320px] px-7 pt-[22px]">
        <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
          <Link href="/" className="font-semibold">
            Home
          </Link>
          <span>/</span>
          <span className="font-bold text-ink">Scholarships</span>
        </div>

        <div className="mt-[22px] grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-start gap-8">
          <div>
            <h1 className="font-display text-[clamp(32px,3.6vw,46px)] font-semibold leading-[1.08] tracking-[-0.032em]">
              Scholarships in Germany for international students
            </h1>
            <p className="mt-3.5 max-w-[640px] text-balance text-base leading-[1.62] text-ink-2">
              {all.length} verified scholarships for Bachelor, Master, PhD and postdoc study in Germany — DAAD,
              political foundations, Deutschlandstipendium and university awards. Every listing is checked against
              the funder&rsquo;s official page, with the verification date shown on the card.
            </p>
          </div>
          {profile ? (
            <div className="max-w-[420px] justify-self-end rounded-[18px] bg-ink p-[22px] text-white">
              <div className="text-xs font-extrabold tracking-[0.1em] text-gold">MATCH MODE IS ON</div>
              <div className="mt-2 text-[15.5px] font-bold leading-[1.4]">
                Match scores use your profile{profile.nationality ? ` — ${profile.nationality}` : ""}
                {profile.targetDegreeLevel ? `, ${profile.targetDegreeLevel}` : ""}.
              </div>
              <div className="mt-3.5 flex flex-wrap gap-2.5">
                <Link href="/dashboard" className="rounded-full bg-gold px-3.5 py-2 text-[13.5px] font-extrabold text-ink">
                  View profile
                </Link>
              </div>
            </div>
          ) : (
            <div className="max-w-[420px] justify-self-end rounded-[18px] border border-dashed border-border bg-card p-[22px]">
              <div className="text-xs font-extrabold tracking-[0.1em] text-crimson">PERSONALISED MATCHING</div>
              <div className="mt-2 text-[15.5px] font-bold leading-[1.4]">
                Sign in to see your match score on every scholarship below.
              </div>
              <Link
                href="/signup"
                className="mt-3.5 inline-block rounded-full bg-ink px-3.5 py-2 text-[13.5px] font-extrabold text-white"
              >
                Create free account
              </Link>
            </div>
          )}
        </div>

        <form action="/scholarships" method="GET" className="mt-[26px] flex flex-nowrap items-center gap-1.5 rounded-[18px] border border-border bg-card p-2 shadow-[0_12px_30px_rgba(20,20,26,0.07)]">
          <HiddenFilterInputs state={state} except={["q"]} />
          <label className="flex min-w-0 flex-1 cursor-text items-center gap-[11px] rounded-[13px] px-3.5 py-2.5">
            <Search size={18} strokeWidth={2.2} className="flex-shrink-0 text-crimson" />
            <input
              type="text"
              name="q"
              defaultValue={state.q}
              placeholder="Search scholarship, provider or field — e.g. DAAD, engineering"
              className="w-full border-none bg-transparent font-body text-[15.5px] font-semibold text-ink outline-none"
            />
          </label>
          <button
            type="submit"
            aria-label="Search scholarships"
            className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-[13px] bg-ink transition-colors hover:bg-crimson"
          >
            <Search size={20} strokeWidth={2.4} className="text-white" />
          </button>
        </form>

        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <span className="text-[13px] font-bold text-muted-foreground">Popular:</span>
          {POPULAR_CHIPS.map((c) => {
            const on = (state[c.group] as string[]).includes(c.value);
            return (
              <Link
                key={`${c.group}:${c.value}`}
                href={buildHref(state, { [c.group]: toggleValue(state[c.group] as string[], c.value), page: 1 } as never)}
                className={cn(
                  "rounded-full border px-[13px] py-[7px] text-[13px] font-bold transition-colors",
                  on ? "border-ink bg-ink text-white" : "border-input bg-card text-ink hover:border-ink",
                )}
              >
                {c.value}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mx-auto mt-[26px] flex max-w-[1320px] flex-wrap items-center justify-between gap-3 px-7">
        <div className="text-[15px] text-ink-2">
          <strong className="font-extrabold text-ink">{filtered.length}</strong> scholarships match
          {active ? " your filters" : ` — ${all.length} in the full database`}
        </div>
        <form action="/scholarships" method="GET" className="flex items-center gap-2.5 rounded-full border border-input bg-card px-3.5 py-2.5">
          <HiddenFilterInputs state={state} except={["sort"]} />
          <span className="whitespace-nowrap text-[13px] font-bold text-muted-foreground">Sort by</span>
          <SortSelect defaultValue={state.sort} />
        </form>
      </div>

      <div className="mx-auto mt-[22px] grid max-w-[1320px] items-start gap-6 px-7 [grid-template-columns:minmax(240px,286px)_minmax(0,1fr)]">
        <FiltersSidebar groups={groups} state={state} resultCount={filtered.length} />

        <div>
          {activePillEntries.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {activePillEntries.map((p) => (
                <Link
                  key={p.key}
                  href={p.href}
                  className="flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-[13px] font-bold text-white transition-colors hover:bg-crimson"
                >
                  {p.label}
                  <span className="text-sm text-gold">{"×"}</span>
                </Link>
              ))}
            </div>
          )}

          <div className="grid grid-cols-[repeat(auto-fit,minmax(330px,1fr))] gap-[18px]">
            {pageItems.map(({ scholarship, match }) => (
              <ScholarshipCard
                key={scholarship.id}
                scholarship={scholarship}
                match={match}
                saved={savedIds.has(scholarship.id)}
                filterState={state}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="rounded-[20px] border border-dashed border-input bg-card p-11 text-center">
              <div className="font-display text-[22px] font-semibold tracking-[-0.02em]">
                No scholarships match those filters
              </div>
              <p className="mx-auto mt-2.5 max-w-[380px] text-[14.5px] text-ink-2">
                Try removing the nationality or deadline filter — or let an adviser run an eligibility check.
              </p>
              <Link
                href="/scholarships"
                className="mt-4 inline-block rounded-full bg-ink px-[22px] py-3 text-sm font-bold text-white"
              >
                Clear all filters
              </Link>
            </div>
          )}

          {filtered.length > 0 && (
            <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
              <div className="text-[13.5px] text-muted-foreground">
                Showing {start + 1}–{Math.min(start + PER_PAGE, filtered.length)} of {filtered.length}
              </div>
              <div className="flex items-center gap-1.5">
                <Link
                  href={buildHref(state, { page: Math.max(1, page - 1) })}
                  aria-label="Previous page"
                  className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border border-input bg-card text-sm font-bold text-ink"
                >
                  {"←"}
                </Link>
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={buildHref(state, { page: p })}
                    className={cn(
                      "flex h-[38px] min-w-[38px] items-center justify-center rounded-[10px] border px-2.5 text-sm font-bold",
                      p === page ? "border-ink bg-ink text-white" : "border-input bg-card text-ink",
                    )}
                  >
                    {p}
                  </Link>
                ))}
                <Link
                  href={buildHref(state, { page: Math.min(pageCount, page + 1) })}
                  aria-label="Next page"
                  className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border border-input bg-card text-sm font-bold text-ink"
                >
                  {"→"}
                </Link>
              </div>
            </div>
          )}

          <section className="mt-11">
            <h2 className="mb-4 font-display text-2xl font-semibold tracking-[-0.028em]">
              Related scholarship categories
            </h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(215px,1fr))] gap-3">
              {[
                { label: "Fully funded Master's", href: buildHref(state, { level: ["Master's"], funding: ["Fully funded"], page: 1 }) },
                { label: "PhD scholarships", href: buildHref(state, { level: ["PhD"], page: 1 }) },
                { label: "No IELTS required", href: buildHref(state, { lang: ["German"], page: 1 }) },
                { label: "Engineering scholarships", href: buildHref(state, { field: ["Engineering"], page: 1 }) },
                { label: "Closing in 30 days", href: buildHref(state, { deadline: ["Next 30 days"], page: 1 }) },
                { label: "DAAD programmes", href: buildHref(state, { provider: ["DAAD"], page: 1 }) },
              ].map((c) => (
                <Link
                  key={c.label}
                  href={c.href}
                  className="flex items-center justify-between gap-2.5 rounded-[14px] border border-border bg-card px-[17px] py-[15px] text-ink transition-colors hover:border-ink"
                >
                  <span className="text-sm font-bold">{c.label}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-10 rounded-[22px] border border-border bg-card p-[clamp(24px,3vw,36px)]">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8">
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-[-0.028em]">
                  How scholarship funding works in Germany
                </h2>
                <p className="mt-3.5 text-balance text-[14.5px] leading-[1.68] text-ink-2">
                  German public universities charge little or no tuition, so scholarships here mostly cover living
                  costs — roughly €950 a month is what DAAD and the political foundations pay, close to what the
                  immigration office expects to see in a blocked account.
                </p>
                <p className="mt-3.5 text-balance text-[14.5px] leading-[1.68] text-ink-2">
                  Funding splits into four groups: DAAD programmes tied to specific courses, political foundations
                  with their own values-based selection, the Deutschlandstipendium awarded by each university, and
                  research funding paid as an employment contract rather than a grant.
                </p>
                <div className="mt-5 flex flex-col gap-2.5">
                  <div className="text-xs font-extrabold tracking-[0.1em] text-crimson">HELPFUL GUIDES</div>
                  {[
                    { title: "The DAAD application, page by page", meta: "18 min" },
                    { title: "Master's funding in Germany: the 9 routes", meta: "12 min" },
                    { title: "Applying from Nigeria: APS, visa, funding", meta: "9 min" },
                  ].map((g) => (
                    <Link
                      key={g.title}
                      href="/#guides"
                      className="flex items-center gap-2.5 text-[14.5px] font-bold text-ink hover:text-crimson"
                    >
                      <span className="text-crimson">{"→"}</span>
                      {g.title}
                      <span className="text-[12.5px] font-semibold text-muted-foreground">{g.meta}</span>
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="mb-4 font-display text-2xl font-semibold tracking-[-0.028em]">
                  Frequently asked questions
                </h2>
                <DirectoryFaq />
              </div>
            </div>
          </section>
        </div>
      </div>

      <CompareTray items={compareItems} state={state} />
      <SiteFooter />
    </div>
  );
}
