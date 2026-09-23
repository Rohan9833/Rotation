import User from "./models/User.js";
import { verifyToken } from "./middleware/auth.js";

async function broadcastPresence(io, room) {
  const sockets = await io.in(room).fetchSockets();

  const displays = sockets.filter((s) => s.data.role === "display").length;

  io.to(room).emit("presence", {
    displays,
    scanners: sockets.length - displays,
  });
}

export function setupSocket(io) {
  io.use((socket, next) => {
    try {
      const { token, role } = socket.handshake.auth || {};

      socket.data.userId = verifyToken(token);
      socket.data.role = role === "display" ? "display" : "scanner";

      next();
    } catch {
      next(new Error("unauthorized"));
    }
  });

  io.on("connection", async (socket) => {
    const { userId, role } = socket.data;
    const room = `user:${userId}`;

    socket.join(room);

    // Display catches up with the latest sequence
    if (role === "display") {
      const user = await User.findById(userId).select("currentSequence");

      socket.emit("state", {
        sequence: user?.currentSequence ?? null,
      });
    }

    // Scanner can also send card actions directly
    socket.on("cardAction", (action) => {
      if (role !== "scanner") return;

      if (!action || typeof action !== "object") {
        return;
      }

      io.to(room).emit("cardAction", action);
    });

    broadcastPresence(io, room);

    socket.on("disconnect", () => {
      broadcastPresence(io, room);
    });
  });
}
