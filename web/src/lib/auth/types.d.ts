import type { DefaultSession } from "next-auth";
import type { AccountType, StaffRole } from "@/lib/db/schema";

declare module "next-auth" {
  interface User {
    accountType: AccountType;
    staffRole: StaffRole | null;
  }

  interface Session {
    user: {
      id: string;
      accountType: AccountType;
      staffRole: StaffRole | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accountType?: AccountType;
    staffRole?: StaffRole | null;
  }
}
