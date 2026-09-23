import Link from "next/link";
import { footerColumns, legalLinks, socials } from "@/lib/data/homepage";
import { NewsletterForm } from "./newsletter-form";

export function SiteFooter() {
  return (
    <footer className="bg-ink px-7 pb-8 pt-16 text-white">
      <div className="mx-auto max-w-[1240px]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(178px,1fr))] gap-8">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-[26px] w-[26px] flex-col overflow-hidden rounded-[7px]">
                <span className="flex-1 bg-white" />
                <span className="flex-1 bg-crimson" />
                <span className="flex-1 bg-gold" />
              </span>
              <span className="font-display text-[19px] font-semibold tracking-[-0.02em]">
                Studienpfad
              </span>
            </div>
            <p className="mt-3.5 max-w-[260px] text-[13.5px] leading-[1.6] text-white/60">
              The marketplace for verified German scholarships and
              independent application advisers.
            </p>
            <div className="mt-[18px] flex gap-2">
              {socials.map((s) => (
                <a
                  key={s}
                  href="#top"
                  className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-white/20 text-xs font-extrabold text-white transition-colors hover:border-gold hover:bg-gold hover:text-ink"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {footerColumns.map((c) => (
            <div key={c.title}>
              <div className="text-xs font-extrabold tracking-[0.1em] text-gold">
                {c.title}
              </div>
              <div className="mt-3.5 flex flex-col gap-2.5">
                {c.links.map((l) => (
                  <a
                    key={l.label}
                    href="#top"
                    className="text-[13.5px] text-white/72 transition-colors hover:text-gold"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-11 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-center gap-6 rounded-[18px] border border-white/[0.16] p-6">
          <div>
            <div className="text-[17px] font-bold">Deadline digest, every Monday</div>
            <div className="mt-1 text-[13.5px] text-white/62">
              New verified scholarships and what closes in 14 days.
            </div>
          </div>
          <NewsletterForm />
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.14] pt-[22px]">
          <div className="text-[13px] text-white/50">
            © 2026 Studienpfad GmbH · Berlin. Independent of DAAD and all
            listed funders.
          </div>
          <div className="flex flex-wrap gap-[18px]">
            {legalLinks.map((l) => (
              <Link
                key={l.label}
                href="#top"
                className="text-[13px] text-white/50 transition-colors hover:text-gold"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
