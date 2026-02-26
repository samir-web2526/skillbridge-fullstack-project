import express, { Application } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { bookingRouter } from "./modules/booking/booking.router";
import { categoryRouter } from "./modules/category/category.router";
import { tutorRouter } from "./modules/tutor/tutor.router";
import { reviewRouter } from "./modules/review/review.router";
const app:Application = express();

const allowedOrigins = [
  process.env.APP_URL || "http://localhost:3000",
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Check if origin is in allowedOrigins or matches Vercel preview pattern
      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin); // Any Vercel deployment

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  }),
);

app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/tutors", tutorRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/reviews", reviewRouter);
app.get("/", (req, res) => {
  res.send("Hello Skill Bridge Backend!!!");
});

export default app;
