"use client";

import type { FormEvent } from "react";
import { SORT_OPTIONS, type SortKey } from "@/lib/scholarships/filters";

export function SortSelect({ defaultValue }: { defaultValue: SortKey }) {
  return (
    <select
      name="sort"
      defaultValue={defaultValue}
      onChange={(e: FormEvent<HTMLSelectElement>) => e.currentTarget.form?.requestSubmit()}
      className="cursor-pointer appearance-none border-none bg-transparent font-body text-sm font-bold text-ink outline-none"
    >
      {SORT_OPTIONS.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
