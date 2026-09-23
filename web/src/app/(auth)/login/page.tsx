import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <>
      <h1 className="font-display text-2xl font-semibold tracking-[-0.02em]">
        Sign in
      </h1>
      <p className="mt-1.5 text-sm text-ink-2">
        Continue to your scholarship profile, adviser dashboard, or admin
        console.
      </p>

      <Suspense fallback={<div className="mt-6 h-[220px]" />}>
        <LoginForm />
      </Suspense>
    </>
  );
}
