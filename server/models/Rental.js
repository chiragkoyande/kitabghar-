import mongoose from "mongoose";
const rentalSchema = new mongoose.Schema({ userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true }, orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" }, rentedAt: { type: Date, default: Date.now }, dueDate: Date, returnedAt: Date, status: { type: String, enum: ["active", "returned", "overdue"], default: "active" } }, { timestamps: true });
export const Rental = mongoose.model("Rental", rentalSchema);
