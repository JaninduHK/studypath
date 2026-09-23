import { howItWorksSteps } from "@/lib/data/homepage";

export function HowItWorks() {
  return (
    <section className="px-7 py-[84px]">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <div className="text-[12.5px] font-extrabold tracking-[0.12em] text-crimson">
              HOW IT WORKS
            </div>
            <h2 className="mt-3 font-display text-[clamp(30px,3.3vw,42px)] font-semibold leading-[1.12] tracking-[-0.03em]">
              Four steps from profile to submitted application
            </h2>
          </div>
          <a href="#cta" className="text-[14.5px] font-bold text-ink hover:text-crimson">
            Start free →
          </a>
        </div>

        <div className="mt-11 grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-5">
          {howItWorksSteps.map((st) => (
            <div
              key={st.n}
              className="flex min-h-[200px] flex-col gap-3 rounded-[18px] border border-border bg-card p-6 transition-all hover:-translate-y-[3px] hover:border-ink hover:shadow-[0_14px_30px_rgba(20,20,26,0.08)]"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-[30px] text-crimson">{st.n}</span>
                <span className="h-1 w-[34px] rounded-full bg-gold" />
              </div>
              <div className="text-[17px] font-bold leading-[1.3]">{st.title}</div>
              <div className="text-sm leading-[1.55] text-ink-2">{st.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
