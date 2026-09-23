import { Router } from "express";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

// Every order of cards 1,2,3
const VALID = new Set(["123", "132", "213", "231", "312", "321"]);

const VALID_MOVEMENTS = new Set(["LEFT", "RIGHT", "UP", "DOWN"]);

const VALID_ROTATIONS = new Set(["0-90", "90-180", "180-270", "270-360"]);

export default function scanRoutes(io) {
  const router = Router();

  // =========================================================
  // SEQUENCE
  // Phone posts the detected order -> pushed to display(s)
  // =========================================================

  router.post("/", requireAuth, async (req, res) => {
    try {
      const sequence = String(req.body?.sequence || "");

      if (!VALID.has(sequence)) {
        return res.status(400).json({
          error: "Invalid sequence",
        });
      }

      await User.updateOne(
        { _id: req.userId },
        {
          currentSequence: sequence,
          sequenceUpdatedAt: new Date(),
        },
      );

      const room = `user:${req.userId}`;

      io.to(room).emit("sequence", {
        sequence,
      });

      const sockets = await io.in(room).fetchSockets();

      const displays = sockets.filter(
        (socket) => socket.data.role === "display",
      ).length;

      return res.json({
        ok: true,
        displays,
      });
    } catch (error) {
      console.error("Sequence scan error:", error);

      return res.status(500).json({
        error: "Failed to send sequence",
      });
    }
  });

  // =========================================================
  // CARD ACTION
  // Rotation / Swipe -> pushed to display(s)
  // =========================================================

  router.post("/action", requireAuth, async (req, res) => {
    try {
      const action = req.body;

      if (!action || typeof action !== "object") {
        return res.status(400).json({
          error: "Invalid card action",
        });
      }

      // -------------------------------------------------------
      // MOVEMENT
      // LEFT / RIGHT / UP / DOWN
      // -------------------------------------------------------

      if (action.type === "MOVEMENT") {
        if (!VALID_MOVEMENTS.has(action.direction)) {
          return res.status(400).json({
            error: "Invalid movement direction",
          });
        }
      }

      // -------------------------------------------------------
      // ROTATION
      // 0-90 / 90-180 / 180-270 / 270-360
      // -------------------------------------------------------
      else if (action.type === "ROTATION") {
        if (!VALID_ROTATIONS.has(action.range)) {
          return res.status(400).json({
            error: "Invalid rotation range",
          });
        }

        if (action.degree !== undefined && typeof action.degree !== "number") {
          return res.status(400).json({
            error: "Invalid rotation degree",
          });
        }
      }

      // -------------------------------------------------------
      // UNKNOWN ACTION
      // -------------------------------------------------------
      else {
        return res.status(400).json({
          error: "Invalid card action type",
        });
      }

      const room = `user:${req.userId}`;

      // Send action to every device in this user's room
      io.to(room).emit("cardAction", action);

      const sockets = await io.in(room).fetchSockets();

      const displays = sockets.filter(
        (socket) => socket.data.role === "display",
      ).length;

      return res.json({
        ok: true,
        displays,
        action,
      });
    } catch (error) {
      console.error("Card action error:", error);

      return res.status(500).json({
        error: "Failed to send card action",
      });
    }
  });

  return router;
}
