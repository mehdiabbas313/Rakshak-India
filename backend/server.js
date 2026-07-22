import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import emergencyContactRoutes from "./routes/emergencyContactRoutes.js";
import emergencyRoutes from "./routes/emergencyRoutes.js";
import firRoutes from "./routes/firRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import womenSafetyRoutes from "./routes/womenSafetyRoutes.js";
import policeRequestRoutes from "./routes/policeRequestRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import mapRoutes from "./routes/mapRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import notFoundMiddleware from "./middleware/notFoundMiddleware.js";
import lawyerRoutes from "./routes/lawyerRoutes.js";

import {
  apiRateLimiter,
  authRateLimiter,
  helmetMiddleware,
  hppMiddleware,
} from "./middleware/securityMiddleware.js";
dotenv.config();

const app = express();

app.disable("x-powered-by");

app.use(helmetMiddleware);
app.use(hppMiddleware);
app.use("/api", apiRateLimiter);
app.use("/api/auth", authRateLimiter);

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
      "http://localhost:5177",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

app.use(
  express.urlencoded({
    extended: true,
  })
);

// Connect MongoDB
connectDB();

// Test Route
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Rakshak India API is running",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/emergency-contacts", emergencyContactRoutes);
app.use("/api/emergencies", emergencyRoutes);
app.use("/api/women-safety", womenSafetyRoutes);
app.use("/api/police-requests", policeRequestRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/maps", mapRoutes);
app.use("/api/firs", firRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/lawyers", lawyerRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});