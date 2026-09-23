"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { signUpAction } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signUpAction, undefined);
  const [accountType, setAccountType] = useState<"student" | "adviser">("student");

  return (
    <>
      <h1 className="font-display text-2xl font-semibold tracking-[-0.02em]">
        Create your free account
      </h1>
      <p className="mt-1.5 text-sm text-ink-2">
        Four minutes of setup. Matched scholarships, adviser quotes and
        deadline alerts from day one.
      </p>

      <div className="mt-5 flex gap-2 rounded-full bg-muted p-[5px]">
        {(["student", "adviser"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setAccountType(type)}
            className={cn(
              "flex-1 rounded-full py-2.5 text-[13.5px] font-bold transition-colors",
              accountType === type ? "bg-ink text-white" : "text-ink-2",
            )}
          >
            {type === "student" ? "I'm a student" : "I'm an adviser"}
          </button>
        ))}
      </div>

      <form action={formAction} className="mt-5 flex flex-col gap-4">
        <input type="hidden" name="accountType" value={accountType} />

        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-ink">Full name</span>
          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            className="rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-ink"
          />
        </label>

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
            minLength={8}
            autoComplete="new-password"
            className="rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-ink"
          />
          <span className="text-xs text-muted-foreground">
            At least 8 characters, with a letter and a number.
          </span>
        </label>

        {state?.error && (
          <p className="text-[13px] font-semibold text-crimson">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-1 rounded-full bg-crimson py-3 text-sm font-bold text-white transition-colors hover:bg-ink disabled:opacity-60"
        >
          {pending ? "Creating account…" : "Create Free Account"}
        </button>
      </form>

      <p className="mt-5 text-center text-[13px] text-ink-2">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-crimson">
          Sign in
        </Link>
      </p>
    </>
  );
}
