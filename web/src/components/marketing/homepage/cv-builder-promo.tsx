import { Check } from "lucide-react";
import { cvBlocks, cvPoints } from "@/lib/data/homepage";

export function CvBuilderPromo() {
  return (
    <section id="cv" className="px-7 pb-[84px]">
      <div className="mx-auto grid max-w-[1240px] grid-cols-[repeat(auto-fit,minmax(340px,1fr))] items-center gap-11 rounded-[28px] border border-border bg-card p-[clamp(26px,3.5vw,48px)]">
        <div className="relative">
          <div className="rounded-2xl border border-border bg-background p-[26px] shadow-[0_18px_40px_rgba(20,20,26,0.08)]">
            <div className="flex items-start justify-between border-b-2 border-ink pb-3">
              <div>
                <div className="font-display text-[22px] font-semibold leading-none tracking-[-0.02em]">
                  Amara Okonjo
                </div>
                <div className="mt-[5px] text-[11.5px] tracking-[0.04em] text-muted-foreground">
                  MSc CANDIDATE · RENEWABLE ENERGY
                </div>
              </div>
              <div className="text-right text-[10.5px] leading-[1.6] text-muted-foreground">
                Lagos, NG
                <br />
                amara@mail.com
                <br />
                +234 ···· 118
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3.5">
              {cvBlocks.map((b) => (
                <div key={b.heading}>
                  <div className="text-[10.5px] font-extrabold tracking-[0.12em] text-crimson">
                    {b.heading}
                  </div>
                  <div className="mt-[7px] flex flex-col gap-1.5">
                    {b.lines.map((ln, i) => (
                      <div
                        key={i}
                        className="h-2 rounded-full bg-ink/[0.13]"
                        style={{ width: ln.w }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -bottom-[18px] -left-4 rounded-xl bg-ink px-[15px] py-[11px] text-[12.5px] font-extrabold text-white shadow-[0_14px_30px_rgba(20,20,26,0.24)]">
            ATS score 94/100
          </div>
        </div>

        <div>
          <div className="text-[12.5px] font-extrabold tracking-[0.12em] text-crimson">
            CV BUILDER
          </div>
          <h2 className="mt-3 font-display text-[clamp(30px,3.3vw,42px)] font-semibold leading-[1.12] tracking-[-0.03em]">
            A German-format CV that machines and committees both read
          </h2>
          <p className="mt-4 text-[16.5px] leading-[1.6] text-ink-2">
            Structured for DAAD and university panels, parsed cleanly by
            applicant tracking systems. Fill once, export for every
            application.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            {cvPoints.map((p) => (
              <div key={p.title} className="flex items-start gap-3">
                <span className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full bg-gold">
                  <Check size={12} strokeWidth={3} />
                </span>
                <div className="text-[15px] leading-[1.5] text-ink">
                  <strong className="font-bold">{p.title}</strong> — {p.body}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="/cv-builder"
              className="rounded-full bg-crimson px-6 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-ink"
            >
              Build Your CV
            </a>
            <a
              href="/cv-builder"
              className="rounded-full border-[1.5px] border-input px-[22px] py-3.5 text-[15px] font-bold text-ink transition-colors hover:border-ink"
            >
              PDF · DOCX export
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
