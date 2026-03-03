import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
    const adminPhone = process.env.ADMIN_PHONE || "9999999999";

    const existingAdmin = await prisma.user.findFirst({
      where: {
        OR: [
          { email: adminEmail },
          { role: "SUPER_ADMIN" }
        ]
      }
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      await prisma.user.create({
        data: {
          name: "Super Admin",
          email: adminEmail,
          password: hashedPassword,
          phoneNumber: adminPhone,
          role: "SUPER_ADMIN",
          status: "ACTIVE",
          isEmailVerified: true,
          cart: { create: {} },
          wishlist: { create: {} },
        }
      });
      console.log("✔ Default Super Admin created successfully");
    } else {
      console.log("ℹ Super Admin already exists in database");
    }
  } catch (error) {
    console.error("✘ Error seeding admin:", error);
  }
};
