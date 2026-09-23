import "dotenv/config";
import http from "http";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.js";
import scanRoutes from "./routes/scan.js";
import { setupSocket } from "./socket.js";

const { MONGO_URI, JWT_SECRET, PORT = 5000 } = process.env;

if (!MONGO_URI || !JWT_SECRET) {
  console.error("Missing MONGO_URI or JWT_SECRET in .env");
  process.exit(1);
}

const app = express();

app.set("trust proxy", 1);

// Security headers
app.use(helmet());

// CORS
// Using "*" temporarily for local + ngrok testing.
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "10kb" }));

// HTTP server
const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Socket authentication / rooms / presence
setupSocket(io);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/scan", scanRoutes(io));

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err);

  res.status(500).json({
    error: "Server error",
  });
});

// MongoDB
try {
  await mongoose.connect(MONGO_URI);
  console.log("MongoDB connected");
} catch (error) {
  console.error("MongoDB connection failed:", error);
  process.exit(1);
}

// Start server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`API + sockets on :${PORT}`);
});
