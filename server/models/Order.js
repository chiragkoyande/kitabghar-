import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  title: { type: String, required: true },
  author: String,
  coverImage: String,
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: { type: [orderItemSchema], required: true, validate: (items) => items.length > 0 },
  address: {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    line1: { type: String, required: true },
    city: { type: String, required: true, default: "Badlapur" },
    pincode: { type: String, required: true },
  },
  status: { type: String, enum: ["pending", "confirmed", "packed", "out_for_delivery", "delivered", "cancelled"], default: "pending" },
  deliveryOption: { type: String, enum: ["home_delivery", "pickup"], default: "home_delivery" },
  deliveryEta: Date,
  adminNote: String,
  deliveredAt: Date,
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);
