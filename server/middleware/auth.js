import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (request, response, next) => {
  const header = request.headers.authorization;
  if (!header?.startsWith("Bearer ")) return response.status(401).json({ message: "Authentication required" });
  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    request.user = await User.findById(payload.id).select("-passwordHash");
    if (!request.user) return response.status(401).json({ message: "User no longer exists" });
    next();
  } catch {
    return response.status(401).json({ message: "Invalid or expired token" });
  }
});

export const requireRole = (...roles) => (request, response, next) => {
  if (!request.user || !roles.includes(request.user.role)) return response.status(403).json({ message: "You do not have permission for this action" });
  next();
};
