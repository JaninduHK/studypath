import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { SignOutButton } from "@/lib/auth/sign-out-button";

export default async function AdminOverviewPage() {
  const user = await getCurrentUser();
  if (!user || user.accountType !== "staff") redirect("/login");

  return (
    <div className="mx-auto max-w-[720px] px-7 py-16">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[12.5px] font-extrabold tracking-[0.12em] text-crimson">
            ADMIN OVERVIEW
          </div>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.02em]">
            Welcome, {user.name ?? user.email}
          </h1>
        </div>
        <SignOutButton />
      </div>
      <p className="mt-4 text-ink-2">
        This is the Stage-1 foundation stub for the admin console
        (scholarship moderation, adviser verification, orders, disputes,
        reports). Signed in as{" "}
        <strong className="font-semibold">{user.email}</strong> · staff role{" "}
        <strong className="font-semibold">{user.staffRole ?? "unassigned"}</strong>.
      </p>
    </div>
  );
}
