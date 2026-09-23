"use client";

import { useState } from "react";
import { ArrowRight, ChevronDown, Search } from "lucide-react";
import { degreeLevelOptions, quickSearches } from "@/lib/data/homepage";
import { ImagePlaceholder } from "./image-placeholder";

export function Hero() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<string>("Master's");

  return (
    <section id="top" className="relative px-7 pb-16 pt-20">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 340px at 12% -10%, rgba(255,206,0,0.22), transparent 70%), radial-gradient(700px 320px at 92% 8%, rgba(200,16,46,0.12), transparent 70%)",
        }}
      />
      <div className="relative mx-auto grid max-w-[1240px] items-center gap-12 [grid-template-columns:minmax(320px,60fr)_minmax(280px,40fr)]">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-[9px] rounded-full bg-ink px-3.5 py-[7px] text-[12.5px] font-bold tracking-[0.02em] text-white">
            <span className="h-[7px] w-[7px] rounded-full bg-gold" />
            STUDY IN GERMANY · 2027 INTAKE
          </div>

          <h1 className="mt-[22px] font-display text-[clamp(38px,4.6vw,64px)] font-semibold leading-[1.04] tracking-[-0.035em] text-balance">
            Funded studies in Germany,
            <br />
            <span className="text-crimson">without the guesswork.</span>
          </h1>

          <p className="mt-5 max-w-[520px] text-lg leading-[1.6] text-ink-2 text-balance">
            Search verified German scholarships, hire an approved adviser for
            your application, and build documents that pass the first
            screening — all in one place.
          </p>

          <div className="mt-[30px] flex flex-nowrap items-stretch gap-1.5 rounded-[20px] border border-border bg-card p-2 shadow-[0_18px_44px_rgba(20,20,26,0.09)]">
            <label className="flex min-w-0 flex-[1_1_180px] cursor-text items-center gap-[11px] rounded-[14px] px-3.5 py-2.5 transition-colors hover:bg-background">
              <Search size={18} strokeWidth={2.2} className="flex-shrink-0 text-crimson" />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-[11px] font-extrabold tracking-[0.08em] text-muted-foreground">
                  WHAT DO YOU WANT TO STUDY?
                </span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Mechanical Engineering"
                  className="w-full border-none bg-transparent p-0 font-body text-[15.5px] font-semibold text-ink outline-none"
                />
              </span>
            </label>

            <div className="my-2 w-px flex-shrink-0 bg-border" />

            <label className="flex min-w-0 flex-[0_1_160px] cursor-pointer items-center gap-[11px] rounded-[14px] px-3.5 py-2.5 transition-colors hover:bg-background">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 text-muted-foreground">
                <path d="M4 19V7l4-3 4 3 4-3 4 3v12" />
                <path d="M9 19v-6h6v6" />
              </svg>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-[11px] font-extrabold tracking-[0.08em] text-muted-foreground">
                  DEGREE LEVEL
                </span>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full cursor-pointer appearance-none border-none bg-transparent p-0 font-body text-[15.5px] font-semibold text-ink outline-none"
                >
                  {degreeLevelOptions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </span>
              <ChevronDown size={13} strokeWidth={2.6} className="flex-shrink-0 text-muted-foreground" />
            </label>

            <button
              aria-label="Find scholarships"
              title="Find scholarships"
              className="flex h-[54px] w-[54px] flex-shrink-0 items-center justify-center self-center rounded-[14px] bg-ink text-white transition-colors hover:bg-crimson"
            >
              <ArrowRight size={20} strokeWidth={2.4} />
            </button>
          </div>

          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <span className="text-[13px] font-bold text-muted-foreground">Popular:</span>
            {quickSearches.map((q) => (
              <button
                key={q.label}
                onClick={() => setQuery(q.query)}
                className="rounded-full border border-input bg-card px-[13px] py-[7px] font-body text-[13px] font-semibold text-ink transition-colors hover:border-ink hover:bg-gold"
              >
                {q.label}
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href="#match"
              className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-ink px-5 py-3 text-[14.5px] font-bold text-ink transition-colors hover:border-gold hover:bg-gold"
            >
              Not sure you qualify? Check My Eligibility →
            </a>
            <span className="text-[13.5px] text-muted-foreground">
              Free · no card · 4 minutes
            </span>
          </div>
        </div>

        <div className="relative animate-fade-up [animation-delay:.1s]">
          <div className="absolute inset-[-18px_6px_12px_-6px] rounded-[30px] bg-[linear-gradient(180deg,#FFCE00,#C8102E)] opacity-[0.14] blur-[2px]" />
          <div className="relative aspect-[4/5] w-full min-h-[380px] overflow-hidden rounded-3xl border border-border shadow-[0_30px_70px_rgba(20,20,26,0.14)]">
            <ImagePlaceholder caption="Hero photo — student on a German campus" />
          </div>
          <div className="absolute -bottom-[26px] -right-3.5 animate-float-y rounded-2xl border border-border bg-card px-4 py-3 shadow-[0_16px_36px_rgba(20,20,26,0.12)]">
            <div className="text-xs font-bold tracking-[0.05em] text-muted-foreground">
              DEADLINE
            </div>
            <div className="mt-0.5 text-[15px] font-extrabold">
              DAAD EPOS · 11 days
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
