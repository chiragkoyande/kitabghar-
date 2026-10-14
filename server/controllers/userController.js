import { User } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listUsers = asyncHandler(async (_request, response) => response.json(await User.find().select("-passwordHash").sort({ createdAt: -1 })));
export const getUser = asyncHandler(async (request, response) => {
  if (request.user.role !== "admin" && request.user._id.toString() !== request.params.id) return response.status(403).json({ message: "You cannot view this user" });
  const user = await User.findById(request.params.id).select("-passwordHash");
  if (!user) return response.status(404).json({ message: "User not found" });
  response.json(user);
});
export const updateUser = asyncHandler(async (request, response) => {
  if (request.user.role !== "admin" && request.user._id.toString() !== request.params.id) return response.status(403).json({ message: "You cannot update this user" });
  const allowed = (({ name, mobile, dob, address, city, pincode, profileImage }) => ({ name, mobile, dob, address, city, pincode, profileImage }))(request.body);
  const user = await User.findByIdAndUpdate(request.params.id, allowed, { new: true, runValidators: true }).select("-passwordHash");
  if (!user) return response.status(404).json({ message: "User not found" });
  response.json(user);
});
export const deleteUser = asyncHandler(async (request, response) => {
  const user = await User.findByIdAndDelete(request.params.id);
  if (!user) return response.status(404).json({ message: "User not found" });
  response.json({ message: "User deleted" });
});
