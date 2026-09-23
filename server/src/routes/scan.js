import { Router } from "express";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

// every order of cards 1,2,3
const VALID = new Set(["123", "132", "213", "231", "312", "321"]);

export default function scanRoutes(io) {
  const router = Router();

  // Phone posts the detected order -> pushed to that user's display(s)
  router.post("/", requireAuth, async (req, res) => {
    const sequence = String(req.body?.sequence || "");
    if (!VALID.has(sequence)) return res.status(400).json({ error: "Invalid sequence" });

    await User.updateOne(
      { _id: req.userId },
      { currentSequence: sequence, sequenceUpdatedAt: new Date() }
    );

    const room = `user:${req.userId}`;
    io.to(room).emit("sequence", { sequence });

    const sockets = await io.in(room).fetchSockets();
    const displays = sockets.filter((s) => s.data.role === "display").length;
    res.json({ ok: true, displays });
  });

  return router;
}
