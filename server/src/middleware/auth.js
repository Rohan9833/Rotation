import jwt from "jsonwebtoken";

export const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET).id;

export function requireAuth(req, res, next) {
  const h = req.headers.authorization || "";
  try {
    req.userId = verifyToken(h.startsWith("Bearer ") ? h.slice(7) : "");
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}
