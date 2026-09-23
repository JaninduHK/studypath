import type { FilterState } from "@/lib/scholarships/filters";

/**
 * Replicates the current filter state as hidden inputs inside a plain GET
 * form, so submitting one control (search text, sort) doesn't drop every
 * other active filter — no client JS required.
 */
export function HiddenFilterInputs({ state, except = [] }: { state: FilterState; except?: (keyof FilterState)[] }) {
  const skip = new Set<keyof FilterState>(["page", ...except]);
  const entries: [string, string][] = [];

  if (!skip.has("q") && state.q) entries.push(["q", state.q]);
  for (const key of ["level", "field", "nat", "funding", "status", "deadline", "provider", "lang", "gpa", "work"] as const) {
    if (!skip.has(key) && state[key].length) entries.push([key, state[key].join(",")]);
  }
  if (!skip.has("amount") && state.amount > 0) entries.push(["amount", String(state.amount)]);
  if (!skip.has("sort") && state.sort !== "Deadline (soonest)") entries.push(["sort", state.sort]);
  if (!skip.has("compare") && state.compare.length) entries.push(["compare", state.compare.join(",")]);

  return (
    <>
      {entries.map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
    </>
  );
}
