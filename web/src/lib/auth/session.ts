import { cache } from "react";
import { auth } from "@/auth";

/**
 * Data Access Layer entry point: the one place route/data code should ask
 * "who is this?". Proxy-level checks are optimistic (cookie only); this
 * re-verifies against the real session on the server for anything that
 * touches data.
 */
export const getCurrentUser = cache(async () => {
  const session = await auth();
  return session?.user ?? null;
});
