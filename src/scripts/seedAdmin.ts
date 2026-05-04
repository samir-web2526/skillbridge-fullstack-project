import { prisma } from "../lib/prisma";
import { userRole } from "../app/middlewares/auth";
import bcrypt from "bcrypt";
import { envVars } from "../config/env";

async function seedAdmin() {
  try {
    const adminName = envVars.ADMIN_NAME;
    const adminEmail = envVars.ADMIN_EMAIL;
    const adminPass = envVars.ADMIN_PASSWORD;

    if (!adminEmail || !adminPass || !adminName) {
      throw new Error("Admin credentials not set in .env");
    }

    const exitingUser = await prisma.user.findUnique({
      where: {
        email: adminEmail,
      },
    });

    if (exitingUser) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPass, Number(envVars.BCRYPT_SALT_ROUNDS || 12));

    await prisma.user.create({
        data: {
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: userRole.ADMIN,
        }
    });

    console.log("Admin created successfully");
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
