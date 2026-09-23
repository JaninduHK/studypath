import type { AccountType } from "@/lib/db/schema";

export function homeForAccountType(accountType: AccountType): string {
  if (accountType === "adviser") return "/adviser";
  if (accountType === "staff") return "/admin";
  return "/dashboard";
}
