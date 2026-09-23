import { matchReasons, profileChecklist, profileCompleteness } from "@/lib/data/homepage";
import { cn } from "@/lib/utils";

export function MatchingPromo() {
  return (
    <section id="match" className="px-7 pb-[84px]">
      <div className="relative mx-auto grid max-w-[1240px] grid-cols-[repeat(auto-fit,minmax(340px,1fr))] items-center gap-11 overflow-hidden rounded-[28px] bg-ink p-[clamp(28px,4vw,52px)] text-white">
        <div
          className="pointer-events-none absolute -right-[90px] -top-[90px] h-80 w-80 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,206,0,0.28), transparent 68%)",
          }}
        />
        <div className="relative">
          <div className="text-[12.5px] font-extrabold tracking-[0.12em] text-gold">
            PERSONALISED MATCHING
          </div>
          <h2 className="mt-3.5 font-display text-[clamp(30px,3.3vw,42px)] font-semibold leading-[1.12] tracking-[-0.03em]">
            Stop reading 1,800 listings. See the 12 you can actually win.
          </h2>
          <p className="mt-4 max-w-[460px] text-[16.5px] leading-[1.6] text-white/[0.76]">
            We compare your degree, GPA, nationality, language level and
            intake against every listing&rsquo;s real eligibility rules — and
            tell you why each one matched.
          </p>

          <div className="mt-[26px] rounded-2xl border border-white/[0.14] bg-white/[0.06] p-[18px]">
            <div className="text-[12.5px] font-extrabold tracking-[0.06em] text-gold">
              WHY THIS MATCHED
            </div>
            <div className="mt-3 flex flex-col gap-2.5">
              {matchReasons.map((r) => (
                <div key={r.text} className="flex items-center gap-2.5 text-sm text-white/90">
                  <span className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full bg-gold text-[11px] font-black text-ink">
                    ✓
                  </span>
                  {r.text}
                </div>
              ))}
            </div>
          </div>

          <a
            href="#cta"
            className="mt-[26px] inline-block rounded-full bg-crimson px-[26px] py-[15px] text-[15px] font-bold text-white transition-colors hover:bg-gold hover:text-ink"
          >
            Get My Matches
          </a>
        </div>

        <div className="relative rounded-2xl bg-white p-6 text-ink shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between">
            <div className="text-[15px] font-extrabold">Profile completeness</div>
            <div className="text-[15px] font-extrabold text-crimson">
              {profileCompleteness}%
            </div>
          </div>
          <div className="mt-3 h-[9px] overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-[linear-gradient(90deg,#C8102E,#FFCE00)]"
              style={{ width: `${profileCompleteness}%` }}
            />
          </div>
          <div className="mt-5 flex flex-col gap-2.5">
            {profileChecklist.map((p) => (
              <div
                key={p.label}
                className="flex items-center gap-3 rounded-xl border border-border px-3.5 py-3"
              >
                <span
                  className={cn(
                    "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-black",
                    p.done ? "bg-success text-white" : "bg-gold text-ink",
                  )}
                >
                  {p.mark}
                </span>
                <span className="flex-1 text-sm font-semibold">{p.label}</span>
                <span className="text-[12.5px] font-bold text-muted-foreground">
                  {p.hint}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
