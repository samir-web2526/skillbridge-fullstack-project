import app from "./app.js";
import { prisma } from "./lib/prisma.js";
const PORT = process.env.PORT || 5000;
async function main() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is connected on Port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
