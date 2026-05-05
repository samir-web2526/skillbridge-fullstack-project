import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { IndexRoutes } from "./app/routes";
import { notFound } from "./app/middlewares/notFound";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { PaymentController } from "./app/modules/payment/payment.controller";

const app: Application = express();

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
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

app.use(cookieParser());
app.use('/api/payment/webhook/stripe', express.raw({ type: 'application/json' }), PaymentController.handleStripeWebhook);
app.use('/api/payments/webhook/stripe', express.raw({ type: 'application/json' }), PaymentController.handleStripeWebhook);
app.use('/api/v1/payments/webhook/stripe', express.raw({ type: 'application/json' }), PaymentController.handleStripeWebhook);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", IndexRoutes);

app.get("/", (req, res) => {
  res.send("Hello Skill Bridge Backend!!!");
});

// Global Error & NotFound handlers
app.use(notFound);
app.use(globalErrorHandler);

export default app;
