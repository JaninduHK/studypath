import type { Scholarship } from "@/lib/db/schema";
import { computeMatch, type MatchResult } from "./match";
import { daysUntil, deriveStatus, statusLabel } from "./status";
import type { StudentProfile } from "@/lib/db/schema";

export const SORT_OPTIONS = [
  "Deadline (soonest)",
  "Best match",
  "Funding (highest)",
  "Recently verified",
] as const;
export type SortKey = (typeof SORT_OPTIONS)[number];

export const FILTER_GROUP_KEYS = [
  "level",
  "field",
  "nat",
  "funding",
  "status",
  "deadline",
  "provider",
  "lang",
  "gpa",
  "work",
] as const;
export type FilterGroupKey = (typeof FILTER_GROUP_KEYS)[number];

export interface FilterState {
  q: string;
  level: string[];
  field: string[];
  nat: string[];
  funding: string[];
  status: string[];
  deadline: string[];
  provider: string[];
  lang: string[];
  gpa: string[];
  work: string[];
  amount: number;
  sort: SortKey;
  page: number;
  compare: string[];
}

const DEADLINE_BUCKETS = ["Next 14 days", "Next 30 days", "Next 3 months", "Later than 3 months"] as const;
const GPA_BUCKETS = ["No minimum stated", "Good degree (2.5)", "Strong degree (2.0)", "Top of cohort (1.5)"] as const;
const WORK_BUCKETS = ["Not required", "1+ years", "2+ years"] as const;
const PROVIDER_BUCKETS = ["DAAD", "Foundations & societies", "Max Planck", "European Commission", "Universities"] as const;

export const PER_PAGE = 6;

function toArray(v: string | string[] | undefined): string[] {
  if (!v) return [];
  const raw = Array.isArray(v) ? v[0] : v;
  return raw.split(",").filter(Boolean);
}

export function parseFilterState(sp: Record<string, string | string[] | undefined>): FilterState {
  const sort = (Array.isArray(sp.sort) ? sp.sort[0] : sp.sort) as SortKey | undefined;
  return {
    q: (Array.isArray(sp.q) ? sp.q[0] : sp.q) ?? "",
    level: toArray(sp.level),
    field: toArray(sp.field),
    nat: toArray(sp.nat),
    funding: toArray(sp.funding),
    status: toArray(sp.status),
    deadline: toArray(sp.deadline),
    provider: toArray(sp.provider),
    lang: toArray(sp.lang),
    gpa: toArray(sp.gpa),
    work: toArray(sp.work),
    amount: Number(Array.isArray(sp.amount) ? sp.amount[0] : sp.amount) || 0,
    sort: sort && SORT_OPTIONS.includes(sort) ? sort : "Deadline (soonest)",
    page: Math.max(1, Number(Array.isArray(sp.page) ? sp.page[0] : sp.page) || 1),
    compare: toArray(sp.compare).slice(0, 3),
  };
}

/** Builds the query string for a copy of the state with one field overridden — used by every filter link. */
export function buildHref(state: FilterState, overrides: Partial<FilterState>): string {
  const next: FilterState = { ...state, ...overrides };
  const params = new URLSearchParams();
  if (next.q) params.set("q", next.q);
  for (const key of FILTER_GROUP_KEYS) {
    const values = next[key];
    if (values.length) params.set(key, values.join(","));
  }
  if (next.amount > 0) params.set("amount", String(next.amount));
  if (next.sort !== "Deadline (soonest)") params.set("sort", next.sort);
  if (next.page > 1) params.set("page", String(next.page));
  if (next.compare.length) params.set("compare", next.compare.join(","));
  const qs = params.toString();
  return qs ? `/scholarships?${qs}` : "/scholarships";
}

export function toggleValue(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function categorizeProvider(providerName: string): (typeof PROVIDER_BUCKETS)[number] {
  const p = providerName.toLowerCase();
  if (p.includes("daad")) return "DAAD";
  if (p.includes("max planck")) return "Max Planck";
  if (p.includes("european commission")) return "European Commission";
  if (p.includes("stiftung") || p.includes("foundation") || p.includes("kaad")) return "Foundations & societies";
  return "Universities";
}

function gpaBucket(scholarship: Scholarship): (typeof GPA_BUCKETS)[number] {
  const max = scholarship.gpaRequirementMaxGerman ? Number.parseFloat(scholarship.gpaRequirementMaxGerman) : null;
  if (max === null) return "No minimum stated";
  if (max < 2.0) return "Top of cohort (1.5)";
  if (max < 2.5) return "Strong degree (2.0)";
  return "Good degree (2.5)";
}

function workBucket(scholarship: Scholarship): (typeof WORK_BUCKETS)[number] {
  const years = scholarship.workExperienceMinYears ? Number.parseFloat(scholarship.workExperienceMinYears) : 0;
  if (years >= 2) return "2+ years";
  if (years >= 1) return "1+ years";
  return "Not required";
}

function deadlineBucket(scholarship: Scholarship): (typeof DEADLINE_BUCKETS)[number] | null {
  const days = daysUntil(scholarship.closeDate);
  if (days === null || days < 0) return days === null ? "Later than 3 months" : null;
  if (days <= 14) return "Next 14 days";
  if (days <= 30) return "Next 30 days";
  if (days <= 92) return "Next 3 months";
  return "Later than 3 months";
}

export interface FilterGroupOption {
  label: string;
  count: number;
}

export interface FilterGroup {
  key: FilterGroupKey;
  title: string;
  hasRange?: boolean;
  options: FilterGroupOption[];
}

function matchesQuery(s: Scholarship, q: string): boolean {
  if (!q.trim()) return true;
  const haystack = `${s.name} ${s.providerName} ${s.subjects.join(" ")} ${s.degreeLevels.join(" ")}`.toLowerCase();
  return haystack.includes(q.trim().toLowerCase());
}

function matchesGroup(values: string[], candidate: string | string[]): boolean {
  if (values.length === 0) return true;
  const candidates = Array.isArray(candidate) ? candidate : [candidate];
  return values.some((v) => candidates.includes(v));
}

function passesFilters(s: Scholarship, state: FilterState): boolean {
  if (!matchesQuery(s, state.q)) return false;
  if (!matchesGroup(state.level, s.degreeLevels)) return false;
  if (!matchesGroup(state.field, s.subjects)) return false;
  if (state.nat.length) {
    const isAll = s.eligibleNationalities === "all";
    if (!isAll && !state.nat.some((n) => (s.eligibleNationalities as string[]).includes(n))) return false;
  }
  if (!matchesGroup(state.funding, s.fundingType === "fully_funded" ? "Fully funded" : "Partially funded")) return false;
  if (!matchesGroup(state.status, statusLabel(deriveStatus(s)))) return false;
  const db = deadlineBucket(s);
  if (state.deadline.length && (!db || !state.deadline.includes(db))) return false;
  if (!matchesGroup(state.provider, categorizeProvider(s.providerName))) return false;
  if (state.lang.length) {
    const langs = s.languageRequirements.map((l) => l.language);
    if (!state.lang.some((l) => langs.includes(l))) return false;
  }
  if (!matchesGroup(state.gpa, gpaBucket(s))) return false;
  if (!matchesGroup(state.work, workBucket(s))) return false;
  if (state.amount > 0) {
    const min = s.fundingAmountMin ? Number.parseFloat(s.fundingAmountMin) : 0;
    if (min < state.amount) return false;
  }
  return true;
}

export interface ScholarshipWithMatch {
  scholarship: Scholarship;
  match: MatchResult;
}

export function filterAndSort(
  all: Scholarship[],
  state: FilterState,
  profile: StudentProfile | null,
): ScholarshipWithMatch[] {
  const withMatch = all
    .filter((s) => passesFilters(s, state))
    .map((scholarship) => ({ scholarship, match: computeMatch(profile, scholarship) }));

  withMatch.sort((a, b) => {
    switch (state.sort) {
      case "Best match":
        return (b.match.percent ?? -1) - (a.match.percent ?? -1);
      case "Funding (highest)": {
        const av = a.scholarship.fundingAmountMin ? Number.parseFloat(a.scholarship.fundingAmountMin) : 0;
        const bv = b.scholarship.fundingAmountMin ? Number.parseFloat(b.scholarship.fundingAmountMin) : 0;
        return bv - av;
      }
      case "Recently verified":
        return b.scholarship.lastVerifiedAt.getTime() - a.scholarship.lastVerifiedAt.getTime();
      default: {
        const ad = daysUntil(a.scholarship.closeDate);
        const bd = daysUntil(b.scholarship.closeDate);
        const an = ad === null || ad < 0 ? 999_999 : ad;
        const bn = bd === null || bd < 0 ? 999_999 : bd;
        return an - bn;
      }
    }
  });

  return withMatch;
}

export function computeFilterGroups(all: Scholarship[]): FilterGroup[] {
  const count = (predicate: (s: Scholarship) => boolean) => all.filter(predicate).length;

  return [
    {
      key: "level" as const,
      title: "Degree level",
      options: ["Bachelor", "Master's", "PhD", "Postdoc"].map((label) => ({
        label,
        count: count((s) => s.degreeLevels.some((l) => l.includes(label.replace("'s", "")))),
      })),
    },
    {
      key: "field" as const,
      title: "Field of study",
      options: ["Engineering", "Natural Sciences", "Social Sciences", "Business", "STEM", "Any field"].map((label) => ({
        label,
        count: count((s) => s.subjects.some((f) => f.includes(label)) || s.subjects.includes("Any field")),
      })),
    },
    {
      key: "nat" as const,
      title: "Student nationality",
      options: ["Nigeria", "India", "Pakistan", "Brazil", "Kenya"].map((label) => ({
        label,
        count: count((s) => s.eligibleNationalities === "all" || s.eligibleNationalities.includes(label)),
      })),
    },
    {
      key: "funding" as const,
      title: "Funding type",
      options: ["Fully funded", "Partially funded"].map((label) => ({
        label,
        count: count((s) => (label === "Fully funded" ? s.fundingType === "fully_funded" : s.fundingType === "partial")),
      })),
    },
    {
      key: "status" as const,
      title: "Application status",
      options: ["Open", "Closing soon", "Closed"].map((label) => ({
        label,
        count: count((s) => statusLabel(deriveStatus(s)) === label),
      })),
    },
    {
      key: "deadline" as const,
      title: "Deadline",
      options: DEADLINE_BUCKETS.map((label) => ({
        label,
        count: count((s) => deadlineBucket(s) === label),
      })),
    },
    {
      key: "provider" as const,
      title: "Provider",
      options: PROVIDER_BUCKETS.map((label) => ({
        label,
        count: count((s) => categorizeProvider(s.providerName) === label),
      })),
    },
    {
      key: "lang" as const,
      title: "Language requirements",
      options: ["English", "German"].map((label) => ({
        label,
        count: count((s) => s.languageRequirements.some((l) => l.language.includes(label))),
      })),
    },
    {
      key: "gpa" as const,
      title: "GPA requirement",
      options: GPA_BUCKETS.map((label) => ({ label, count: count((s) => gpaBucket(s) === label) })),
    },
    {
      key: "work" as const,
      title: "Work experience",
      options: WORK_BUCKETS.map((label) => ({ label, count: count((s) => workBucket(s) === label) })),
    },
  ].map((g) => ({ ...g, options: g.options.filter((o) => o.count > 0) }));
}

export function hasActiveFilters(state: FilterState): boolean {
  return (
    FILTER_GROUP_KEYS.some((k) => state[k].length > 0) || state.amount > 0 || state.q.trim().length > 0
  );
}
