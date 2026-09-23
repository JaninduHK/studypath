"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { signInAction } from "@/lib/auth/actions";

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "";
  const [state, formAction, pending] = useActionState(signInAction, undefined);

  return (
    <>
      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <input type="hidden" name="next" value={next} />

        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-ink">Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-ink"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-ink">Password</span>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-ink"
          />
        </label>

        {state?.error && (
          <p className="text-[13px] font-semibold text-crimson">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-1 rounded-full bg-crimson py-3 text-sm font-bold text-white transition-colors hover:bg-ink disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-5 text-center text-[13px] text-ink-2">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-crimson">
          Create a free account
        </Link>
      </p>
    </>
  );
}
