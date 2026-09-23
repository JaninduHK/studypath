import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { SignOutButton } from "@/lib/auth/sign-out-button";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/scholarships", label: "Scholarships" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user || user.accountType !== "staff") redirect("/login?next=/admin");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-6 px-7 py-4">
          <Link href="/admin" className="font-display text-lg font-semibold tracking-[-0.02em]">
            Studienpfad Admin
          </Link>
          <nav className="flex gap-5">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="text-sm font-semibold text-ink-2 hover:text-ink">
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
