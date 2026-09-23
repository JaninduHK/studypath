import { guidesColumnA, guidesColumnB, guidesFeatured } from "@/lib/data/homepage";
import type { GuideCard } from "@/lib/data/homepage";

function GuideLink({ guide }: { guide: GuideCard }) {
  return (
    <a
      href="/guides"
      className="flex flex-1 flex-col rounded-[20px] border border-border bg-card p-[22px] text-ink transition-colors hover:border-ink"
    >
      <div className="text-[11.5px] font-extrabold tracking-[0.1em] text-crimson">
        {guide.kicker}
      </div>
      <div className="flex-1" />
      <div className="text-balance text-lg font-bold leading-[1.3]">{guide.title}</div>
      <div className="mt-2 text-[13px] text-muted-foreground">{guide.meta}</div>
    </a>
  );
}

export function ApplicationGuides() {
  return (
    <section id="guides" className="px-7 pb-[84px]">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-[12.5px] font-extrabold tracking-[0.12em] text-crimson">
              APPLICATION GUIDES
            </div>
            <h2 className="mt-3 font-display text-[clamp(30px,3.3vw,42px)] font-semibold leading-[1.12] tracking-[-0.03em]">
              Written by people who&rsquo;ve read the rejection letters
            </h2>
          </div>
          <a href="/guides" className="text-[14.5px] font-bold text-ink hover:text-crimson">
            All guides →
          </a>
        </div>

        <div className="mt-[34px] grid grid-cols-[repeat(auto-fit,minmax(262px,1fr))] gap-5">
          <a
            href="/guides"
            className="flex min-h-[270px] flex-col rounded-[20px] bg-ink p-[30px] text-white transition-shadow hover:shadow-[0_20px_44px_rgba(20,20,26,0.24)]"
          >
            <span className="self-start rounded-full bg-gold px-[11px] py-1.5 text-[11.5px] font-extrabold text-ink">
              {guidesFeatured.kicker}
            </span>
            <div className="flex-1" />
            <div className="font-display text-[clamp(24px,2.4vw,29px)] font-semibold leading-[1.16] tracking-[-0.028em]">
              {guidesFeatured.title}
            </div>
            <div className="mt-3 text-sm text-white/[0.72]">{guidesFeatured.meta}</div>
          </a>

          <div className="flex flex-col gap-5">
            {guidesColumnA.map((g) => (
              <GuideLink key={g.title} guide={g} />
            ))}
          </div>
          <div className="flex flex-col gap-5">
            {guidesColumnB.map((g) => (
              <GuideLink key={g.title} guide={g} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
