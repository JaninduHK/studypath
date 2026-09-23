import type { Scholarship } from "@/lib/db/schema";

export type DisplayStatus = "open" | "closing_soon" | "closed" | "archived";

const CLOSING_SOON_WINDOW_DAYS = 21;

export function daysUntil(date: string | null): number | null {
  if (!date) return null;
  const target = new Date(`${date}T23:59:00`).getTime();
  const diffMs = target - Date.now();
  return Math.ceil(diffMs / 86_400_000);
}

export function deriveStatus(scholarship: Pick<Scholarship, "status" | "closeDate" | "isRollingDeadline">): DisplayStatus {
  // Staff can force "archived" or an early "closed" (e.g. quota filled) ahead of the
  // real deadline; every other status is derived live from closeDate so it never goes stale.
  if (scholarship.status === "archived" || scholarship.status === "closed") return scholarship.status;
  if (scholarship.isRollingDeadline || !scholarship.closeDate) return "open";

  const days = daysUntil(scholarship.closeDate);
  if (days === null) return "open";
  if (days < 0) return "closed";
  if (days <= CLOSING_SOON_WINDOW_DAYS) return "closing_soon";
  return "open";
}

export function statusLabel(status: DisplayStatus): string {
  switch (status) {
    case "closing_soon":
      return "Closing soon";
    case "closed":
      return "Closed";
    case "archived":
      return "Archived";
    default:
      return "Open";
  }
}

export function deadlineLabel(scholarship: Pick<Scholarship, "closeDate" | "isRollingDeadline">): string {
  if (scholarship.isRollingDeadline || !scholarship.closeDate) return "Rolling intake";
  const days = daysUntil(scholarship.closeDate);
  if (days === null) return "Rolling intake";
  if (days < 0) {
    return `Closed ${formatDate(scholarship.closeDate)}`;
  }
  if (days === 0) return "Closes today";
  if (days <= 45) return `${days} day${days === 1 ? "" : "s"} left`;
  return formatDate(scholarship.closeDate);
}

export function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const STALE_AFTER_DAYS = 45;

export function isStale(lastVerifiedAt: Date): boolean {
  return lastVerifiedAt.getTime() < Date.now() - STALE_AFTER_DAYS * 86_400_000;
}

export function formatDateTime(date: Date): string {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
