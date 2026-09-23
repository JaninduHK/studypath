import { signOut } from "@/auth";

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button
        type="submit"
        className="rounded-full border-[1.5px] border-input px-5 py-2.5 text-sm font-bold text-ink transition-colors hover:border-ink"
      >
        Sign out
      </button>
    </form>
  );
}
