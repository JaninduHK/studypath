import { adviserServices, featuredAdvisers } from "@/lib/data/homepage";

function VerifiedBadgeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#C8102E" className="flex-shrink-0">
      <path d="M12 2l2.3 2.1 3.1-.3.9 3 2.7 1.6-1.2 2.9 1.2 2.9-2.7 1.6-.9 3-3.1-.3L12 22l-2.3-2.1-3.1.3-.9-3L3 15.6l1.2-2.9L3 9.8l2.7-1.6.9-3 3.1.3z" />
      <path d="M8.8 12.4l2.2 2.2 4.2-4.4" stroke="#fff" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function AdviserMarketplace() {
  return (
    <section id="advisers" className="px-7 pb-[84px]">
      <div className="mx-auto max-w-[1240px]">
        <div className="max-w-[620px]">
          <div className="text-[12.5px] font-extrabold tracking-[0.12em] text-crimson">
            ADVISER SERVICES
          </div>
          <h2 className="mt-3 font-display text-[clamp(30px,3.3vw,42px)] font-semibold leading-[1.12] tracking-[-0.03em]">
            Hire a vetted freelance adviser for one job — not a package you
            don&rsquo;t need
          </h2>
        </div>

        <div className="mt-[38px] grid grid-cols-[repeat(auto-fit,minmax(290px,1fr))] gap-[18px]">
          {adviserServices.map((sv) => (
            <a
              key={sv.title}
              href="#advisers"
              className="flex flex-col gap-2.5 rounded-2xl border border-border bg-card p-[22px] text-ink transition-all hover:border-crimson hover:shadow-[0_14px_30px_rgba(200,16,46,0.1)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-gold font-display text-lg font-normal">
                {sv.icon}
              </div>
              <div className="text-[16.5px] font-bold">{sv.title}</div>
              <div className="text-sm leading-[1.55] text-ink-2">{sv.body}</div>
              <div className="mt-1.5 flex items-center justify-between text-[13px] font-bold">
                <span className="text-crimson">{sv.price}</span>
                <span className="text-muted-foreground">{sv.count}</span>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-end justify-between gap-6">
          <h3 className="font-display text-[clamp(26px,2.6vw,32px)] font-semibold tracking-[-0.03em]">
            Top-rated advisers this month
          </h3>
          <a href="/advisers" className="text-[14.5px] font-bold text-ink hover:text-crimson">
            See all 214 advisers →
          </a>
        </div>

        <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[18px]">
          {featuredAdvisers.map((a) => (
            <div
              key={a.name}
              className="flex flex-col overflow-hidden rounded-[20px] border border-border bg-card transition-all hover:border-ink hover:shadow-[0_16px_34px_rgba(20,20,26,0.09)]"
            >
              <div className="h-1.5 bg-[linear-gradient(90deg,#14141A_33%,#C8102E_33%_66%,#FFCE00_66%)]" />
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-muted font-display text-xl">
                    {a.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-[15.5px] font-bold">
                      {a.name}
                      <VerifiedBadgeIcon />
                    </div>
                    <div className="mt-0.5 text-[12.5px] text-muted-foreground">
                      {a.role}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[13px]">
                  <span className="font-extrabold">★ {a.rating}</span>
                  <span className="text-muted-foreground">({a.reviews} reviews)</span>
                </div>
                <div className="text-[13px] leading-[1.5] text-ink-2">{a.langs}</div>
                <div className="flex-1" />
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <div>
                    <div className="text-[11.5px] font-bold text-muted-foreground">
                      FROM
                    </div>
                    <div className="text-base font-extrabold">{a.price}</div>
                  </div>
                  <a
                    href="/advisers"
                    className="rounded-[10px] bg-ink px-3.5 py-2.5 text-[13.5px] font-bold text-white transition-colors hover:bg-crimson"
                  >
                    View Profile
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
