import dotenv from "dotenv";
import { app } from "./app";
import { prisma } from "./config/prisma";
import { seedAdmin } from "./config/seed";
import { checkCloudinaryConnection } from "./config/cloudinary";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("✔ Database connection established");

    await checkCloudinaryConnection(); // Verify Cloudinary
    await seedAdmin(); // Auto-seed admin if not exists

    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`✔ Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("✘ Database connection failed:", error);
    process.exit(1);
  }
};

startServer();
