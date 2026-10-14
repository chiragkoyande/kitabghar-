import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  type: { type: String, enum: ["payment", "user", "rental", "system"], default: "system" },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export const Notification = mongoose.model("Notification", notificationSchema);
