import express from "express";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import serviceCategoryRoutes from "./routes/admin/services/serviceCategoryRoutes.js";
import serviceRoutes from "./routes/admin/services/serviceTypeRoutes.js";
import bookingRoutes from "./routes/bookings/bookingRoutes.js";

import cookieParser from "cookie-parser";
import path from "path";
import mediaRoutes from "./routes/media/mediaRoutes.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { scheduleBookingReminderJob } from "./controllers/admin/reminderScheduler.js"; // adjust path
import cors from "cors";
import authRoutes from "./routes/auth/authRoutes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve uploads statically
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

scheduleBookingReminderJob();

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // if you're using cookies or auth headers
  })
);

// Allow requests from your frontend
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/media", mediaRoutes);
app.use("/api/v1/booking", bookingRoutes);
app.use("/api/v1/services", serviceCategoryRoutes, serviceRoutes);

app.use(errorMiddleware);
export default app;
