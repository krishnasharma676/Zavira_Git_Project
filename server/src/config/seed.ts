import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
    const adminPhone = process.env.ADMIN_PHONE || "9999999999";

    const normalizedEmail = adminEmail.toLowerCase();

    const existingAdmin = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedEmail, isDeleted: false },
          { role: "SUPER_ADMIN", isDeleted: false }
        ]
      }
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      await prisma.user.create({
        data: {
          name: "Super Admin",
          email: normalizedEmail,
          password: hashedPassword,
          phoneNumber: adminPhone,
          role: "SUPER_ADMIN",
          status: "ACTIVE",
          isEmailVerified: true,
          cart: { create: {} },
          wishlist: { create: {} },
        }
      });
      console.log(`✔ Default Super Admin created: ${normalizedEmail}`);
    } else {
       // Check if email sync is needed
       if (existingAdmin.email !== normalizedEmail) {
          await prisma.user.update({
             where: { id: existingAdmin.id },
             data: { email: normalizedEmail }
          });
          console.log(`✔ Updated Super Admin email to match .env: ${normalizedEmail}`);
       } else {
          console.log(`ℹ Super Admin verified: ${normalizedEmail}`);
       }
    }
  } catch (error) {
    console.error("✘ Error seeding admin:", error);
  }
};
