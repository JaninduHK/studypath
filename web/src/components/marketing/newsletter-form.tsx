"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe() {
    if (!email.trim()) return;
    setSubscribed(true);
  }

  if (subscribed) {
    return (
      <div className="flex items-center rounded-[11px] border border-gold/40 bg-gold/10 px-4 py-3.5 text-sm font-semibold text-gold">
        You&rsquo;re on the list — watch for Monday&rsquo;s digest.
      </div>
    );
  }

  return (
    <div className="flex gap-2.5">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@university.edu"
        className="min-w-0 flex-1 rounded-[11px] border border-white/20 bg-white/[0.08] px-4 py-[13px] font-body text-sm text-white outline-none placeholder:text-white/50"
      />
      <button
        onClick={handleSubscribe}
        className="rounded-[11px] bg-gold px-[22px] py-[13px] font-body text-sm font-extrabold text-ink transition-colors hover:bg-white"
      >
        Subscribe
      </button>
    </div>
  );
}
