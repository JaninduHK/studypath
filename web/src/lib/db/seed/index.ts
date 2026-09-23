import { db } from "@/lib/db";
import { scholarshipChangeHistory, scholarships } from "@/lib/db/schema";
import { scholarshipSeeds } from "./scholarships";

async function main() {
  console.log(`Seeding ${scholarshipSeeds.length} scholarships...`);

  await db.delete(scholarshipChangeHistory);
  await db.delete(scholarships);

  for (const seed of scholarshipSeeds) {
    const { daysAgoVerified, ...row } = seed;
    const lastVerifiedAt = new Date();
    lastVerifiedAt.setUTCDate(lastVerifiedAt.getUTCDate() - daysAgoVerified);

    const [inserted] = await db
      .insert(scholarships)
      .values({ ...row, lastVerifiedAt })
      .returning({ id: scholarships.id });

    await db.insert(scholarshipChangeHistory).values({
      scholarshipId: inserted.id,
      field: "listing",
      oldValue: null,
      newValue: "created",
      changedAt: lastVerifiedAt,
    });
  }

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
