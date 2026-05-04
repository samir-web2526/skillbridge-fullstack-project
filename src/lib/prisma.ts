import { PrismaClient } from "../generated";
import { envVars } from "../config/env";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: envVars.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export { prisma };

