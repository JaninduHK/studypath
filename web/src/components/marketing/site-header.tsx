"use client";

import Link from "next/link";
import { Globe, Search } from "lucide-react";
import { useState } from "react";

const LANGUAGES = ["EN", "DE", "FR", "ES"] as const;

const NAV_LINKS = [
  { href: "#scholarships", label: "Scholarships" },
  { href: "#advisers", label: "Find an Adviser" },
  { href: "#cv", label: "CV Builder" },
  { href: "#guides", label: "Application Guides" },
];

export function SiteHeader() {
  const [langIdx, setLangIdx] = useState(0);
  const lang = LANGUAGES[langIdx];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/88 backdrop-blur-md">
      <div className="mx-auto flex min-h-[72px] max-w-[1240px] flex-wrap items-center gap-x-[22px] gap-y-3 px-7 py-3">
        <Link href="#top" className="flex items-center gap-2.5 text-ink">
          <span className="flex h-[26px] w-[26px] flex-col overflow-hidden rounded-[7px] shadow-[0_1px_0_rgba(20,20,26,0.15)]">
            <span className="flex-1 bg-ink" />
            <span className="flex-1 bg-crimson" />
            <span className="flex-1 bg-gold" />
          </span>
          <span className="font-display text-xl font-semibold tracking-[-0.025em]">
            Studienpfad
          </span>
        </Link>

        <nav className="ml-auto flex flex-wrap items-center justify-end gap-x-5 gap-y-2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-[14.5px] font-semibold text-ink transition-colors hover:text-crimson"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-shrink-0 items-center gap-2.5">
          <button
            aria-label="Search"
            title="Search"
            className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-full border border-input bg-card transition-colors hover:border-ink hover:bg-gold"
          >
            <Search size={16} strokeWidth={2.2} className="text-ink" />
          </button>
          <button
            onClick={() => setLangIdx((i) => (i + 1) % LANGUAGES.length)}
            aria-label={`Language: ${lang}`}
            title={`Language: ${lang}`}
            className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-full border border-input bg-card transition-colors hover:border-ink hover:bg-gold"
          >
            <Globe size={17} strokeWidth={1.9} className="text-ink" />
          </button>
          <Link
            href="/login"
            className="whitespace-nowrap text-[14.5px] font-semibold text-ink"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="whitespace-nowrap rounded-full bg-crimson px-[18px] py-[11px] text-[14.5px] font-bold text-white shadow-[0_6px_16px_rgba(200,16,46,0.28)] transition-colors hover:bg-ink"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </header>
  );
}
