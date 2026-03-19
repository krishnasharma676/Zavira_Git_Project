import { seedAdmin } from "../src/config/seed";
import { prisma } from "../src/config/prisma";

async function main() {
  console.log("Starting manual seed test...");
  await seedAdmin();
  console.log("Seed test finished.");
  await prisma.$disconnect();
}

main().catch(err => {
  console.error("Manual seed failed:", err);
  process.exit(1);
});
