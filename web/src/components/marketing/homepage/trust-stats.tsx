import { trustStats } from "@/lib/data/homepage";

export function TrustStats() {
  return (
    <section className="border-y border-border bg-ink text-white">
      <div className="mx-auto grid max-w-[1240px] grid-cols-[repeat(auto-fit,minmax(180px,1fr))] items-center gap-6 px-7 py-[26px]">
        {trustStats.map((s) => (
          <div key={s.label} className="flex flex-col gap-1">
            <div className="font-display text-[34px] leading-none text-gold">
              {s.value}
            </div>
            <div className="text-[13.5px] text-white/[0.72]">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
