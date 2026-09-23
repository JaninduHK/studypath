"use client";

import { useState } from "react";
import { faqs, testimonials } from "@/lib/data/homepage";
import { cn } from "@/lib/utils";

export function TestimonialsFaq({ openFirstFaq = true }: { openFirstFaq?: boolean }) {
  const [t, setT] = useState(0);
  const [openFaq, setOpenFaq] = useState<number>(openFirstFaq ? 0 : -1);

  const testimonial = testimonials[t];

  return (
    <section className="px-7 pb-[84px]">
      <div className="mx-auto grid max-w-[1240px] grid-cols-[repeat(auto-fit,minmax(340px,1fr))] items-start gap-12">
        <div>
          <div className="text-[12.5px] font-extrabold tracking-[0.12em] text-crimson">
            VERIFIED REVIEWS
          </div>
          <h2 className="mb-[22px] mt-3 font-display text-[clamp(30px,3.3vw,42px)] font-semibold leading-[1.12] tracking-[-0.03em]">
            They applied. They got in.
          </h2>

          <div className="flex min-h-[246px] flex-col rounded-[22px] border border-border bg-card p-[30px] shadow-[0_16px_36px_rgba(20,20,26,0.07)]">
            <div className="text-[15px] tracking-[0.1em] text-gold">★★★★★</div>
            <div className="mt-3.5 text-balance font-display text-[22px] font-medium leading-[1.45] tracking-[-0.015em]">
              &ldquo;{testimonial.quote}&rdquo;
            </div>
            <div className="flex-1" />
            <div className="mt-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted font-display text-lg">
                {testimonial.initials}
              </div>
              <div>
                <div className="text-[14.5px] font-bold">{testimonial.name}</div>
                <div className="mt-0.5 text-[13px] text-muted-foreground">
                  {testimonial.detail}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-[18px] flex items-center gap-3.5">
            <button
              onClick={() => setT((i) => (i - 1 + testimonials.length) % testimonials.length)}
              aria-label="Previous testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-input bg-card text-[15px] font-bold text-ink transition-colors hover:border-ink"
            >
              ←
            </button>
            <button
              onClick={() => setT((i) => (i + 1) % testimonials.length)}
              aria-label="Next testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-input bg-card text-[15px] font-bold text-ink transition-colors hover:border-ink"
            >
              →
            </button>
            <div className="ml-1.5 flex gap-[7px]">
              {testimonials.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === t ? "w-6 bg-crimson" : "w-2 bg-ink/20",
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="text-[12.5px] font-extrabold tracking-[0.12em] text-crimson">
            FAQ
          </div>
          <h2 className="mb-[22px] mt-3 font-display text-[clamp(30px,3.3vw,42px)] font-semibold leading-[1.12] tracking-[-0.03em]">
            Questions students ask first
          </h2>

          <div className="flex flex-col gap-2.5">
            {faqs.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={f.q}
                  className="overflow-hidden rounded-2xl border border-border bg-card"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : i)}
                    className="flex w-full items-center gap-3.5 px-5 py-[18px] text-left font-body"
                  >
                    <span className="flex-1 text-[15.5px] font-bold text-ink">{f.q}</span>
                    <span
                      className={cn(
                        "flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-full text-[15px] font-bold",
                        isOpen ? "bg-ink text-white" : "bg-muted text-ink",
                      )}
                    >
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-[14.5px] leading-[1.6] text-ink-2">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
