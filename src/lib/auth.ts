import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "sqlite", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins:[process.env.APP_URL!],
    emailAndPassword:{
        enabled:true,
        requireEmailVerification:false
    },
    user:{
        additionalFields:{
            role:{
                type:"string",
                defaultValue:"STUDENT",
                required:false
            },
            status:{
                type:"string",
                defaultValue:"ACTIVE",
                required:false
            },
            phone:{
                type:"string",
                required:false
            }
        }
    }
});