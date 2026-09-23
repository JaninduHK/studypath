import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-7 py-16">
      <Link href="/" className="mb-8 flex items-center gap-2.5 text-ink">
        <span className="flex h-[26px] w-[26px] flex-col overflow-hidden rounded-[7px] shadow-[0_1px_0_rgba(20,20,26,0.15)]">
          <span className="flex-1 bg-ink" />
          <span className="flex-1 bg-crimson" />
          <span className="flex-1 bg-gold" />
        </span>
        <span className="font-display text-xl font-semibold tracking-[-0.025em]">
          Studienpfad
        </span>
      </Link>
      <div className="w-full max-w-[420px] rounded-[20px] border border-border bg-card p-8 shadow-[0_18px_44px_rgba(20,20,26,0.06)]">
        {children}
      </div>
    </div>
  );
}
