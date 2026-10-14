import { Notification } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listNotifications = asyncHandler(async (_request, response) => response.json(await Notification.find().populate("userId", "name email").populate("paymentId", "amount status transactionReference").sort({ createdAt: -1 }).limit(100)));
export const listMyNotifications = asyncHandler(async (request, response) => response.json(await Notification.find({ userId: request.user._id }).sort({ createdAt: -1 }).limit(100)));
export const markNotificationRead = asyncHandler(async (request, response) => {
  const filter = request.user.role === "admin" ? { _id: request.params.id } : { _id: request.params.id, userId: request.user._id };
  const notification = await Notification.findOneAndUpdate(filter, { read: true }, { new: true });
  if (!notification) return response.status(404).json({ message: "Notification not found" });
  response.json(notification);
});
