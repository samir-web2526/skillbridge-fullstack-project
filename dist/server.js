import app from "./app";
import { prisma } from "./lib/prisma";
const PORT = process.env.PORT || 5000;
async function main() {
    try {
        await prisma.$connect();
        console.log("Database connected successfully");
        app.listen(PORT, () => {
            console.log(`Server is connected on Port ${PORT}`);
        });
    }
    catch (error) {
        console.log(error);
        await prisma.$disconnect();
        process.exit(1);
    }
}
main();
//# sourceMappingURL=server.js.map