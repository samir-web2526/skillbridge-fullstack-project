import { prisma } from "../lib/prisma";
import { userRole } from "../middlewares/auth";
async function seedAdmin() {
    try {
        const adminName = process.env.ADMIN_NAME;
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPass = process.env.ADMIN_PASS;
        if (!adminEmail) {
            throw new Error("Admin email not set in .env");
        }
        const adminData = {
            name: adminName,
            email: adminEmail,
            role: userRole.ADMIN,
            password: adminPass,
        };
        const exitingUser = await prisma.user.findUnique({
            where: {
                email: adminData.email,
            },
        });
        if (exitingUser) {
            throw new Error("Admin already exists");
        }
        ;
        const signUpAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                Origin: "http://localhost:3000",
            },
            body: JSON.stringify(adminData),
        });
        console.log("Admin created successfully");
    }
    catch (error) {
        console.error(error);
    }
}
seedAdmin();
//# sourceMappingURL=seedAdmin.js.map