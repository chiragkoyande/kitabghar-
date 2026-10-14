import { User } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createToken } from "../utils/createToken.js";

export const register = asyncHandler(async (request, response) => {
  const { name, email, password, mobile, dob, address, city = "Badlapur", pincode } = request.body;
  if (!name || !email || !password) return response.status(400).json({ message: "Name, email and password are required" });
  if (password.length < 8) return response.status(400).json({ message: "Password must contain at least 8 characters" });
  if (await User.findOne({ email: email.toLowerCase() })) return response.status(409).json({ message: "An account with this email already exists" });
  const passwordHash = await User.hashPassword(password);
  const user = await User.create({ name, email, passwordHash, mobile, dob, address, city, pincode });
  response.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token: createToken(user) });
});

export const login = asyncHandler(async (request, response) => {
  const { email, password } = request.body;
  const user = await User.findOne({ email: email?.toLowerCase() }).select("+passwordHash");
  if (!user || !(await user.comparePassword(password || ""))) return response.status(401).json({ message: "Invalid email or password" });
  response.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token: createToken(user) });
});

export const getMe = asyncHandler(async (request, response) => response.json({ user: request.user }));

