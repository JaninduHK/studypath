import Link from "next/link";

export function FinalCta() {
  return (
    <section id="cta" className="px-7 pb-[90px]">
      <div className="relative mx-auto overflow-hidden rounded-[28px] bg-crimson px-6 py-[clamp(40px,5vw,64px)] text-center text-white [padding-inline:clamp(24px,4vw,52px)] max-w-[1240px]">
        <div className="absolute inset-x-0 bottom-0 flex h-[10px]">
          <span className="flex-1 bg-ink" />
          <span className="flex-1 bg-crimson" />
          <span className="flex-1 bg-gold" />
        </div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(600px 240px at 50% -10%, rgba(255,206,0,0.35), transparent 70%)",
          }}
        />
        <div className="relative">
          <h2 className="mx-auto max-w-[720px] text-balance font-display text-[clamp(32px,3.9vw,50px)] font-semibold leading-[1.08] tracking-[-0.032em]">
            Create your free scholarship profile
          </h2>
          <p className="mx-auto mt-4 max-w-[540px] text-[17px] text-white/85">
            Four minutes of setup. Matched scholarships, adviser quotes and
            deadline alerts from day one.
          </p>
          <div className="mt-[30px] flex flex-wrap justify-center gap-3">
            <Link
              href="/signup"
              className="rounded-full bg-white px-[30px] py-4 text-[15.5px] font-extrabold text-crimson transition-colors hover:bg-gold hover:text-ink"
            >
              Create Free Account
            </Link>
            <a
              href="#advisers"
              className="rounded-full border-[1.5px] border-white/60 px-7 py-4 text-[15.5px] font-bold text-white transition-colors hover:border-ink hover:bg-ink"
            >
              Talk to an adviser
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
