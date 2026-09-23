import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts, try again later" },
});

// No sign-up: users are created by an admin via `npm run create-user`
router.post("/login", loginLimiter, async (req, res) => {
  const username = String(req.body?.username || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  const user = await User.findOne({ username });
  const ok = user && (await bcrypt.compare(password, user.passwordHash));
  if (!ok) return res.status(401).json({ error: "Invalid username or password" });

  const token = jwt.sign({ id: String(user._id) }, process.env.JWT_SECRET, { expiresIn: "30d" });
  res.json({ token, user: { username: user.username } });
});

router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.userId).select("username");
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  res.json({ user: { username: user.username } });
});

export default router;
