import "dotenv/config";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { connectDatabase } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import rentalRoutes from "./routes/rentalRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { runSubscriptionReminders } from "./utils/subscriptionReminders.js";

const app = express();
const port = Number(process.env.PORT || 5000);

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(",") || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 200, standardHeaders: "draft-7", legacyHeaders: false }));

app.get("/api/health", (_request, response) => response.json({ status: "ok", service: "kitabghar-api", database: "mongodb" }));
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/orders", orderRoutes);
app.use(notFound);
app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  connectDatabase().then(async () => {
    await runSubscriptionReminders();
    setInterval(() => runSubscriptionReminders().catch((error) => console.error("Subscription reminder failed", error.message)), 60 * 60 * 1000).unref();
    app.listen(port, () => console.log(`Kitab Ghar API listening on port ${port}`));
  }).catch((error) => { console.error("Database connection failed", error.message); process.exitCode = 1; });
}

export default app;
