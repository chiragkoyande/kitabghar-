import mongoose from "mongoose";
const planSchema = new mongoose.Schema({ name: { type: String, required: true, unique: true }, amount: { type: Number, required: true, min: 0 }, currency: { type: String, default: "INR" }, maxActiveRentals: { type: Number, required: true, min: 1 }, benefits: [String], active: { type: Boolean, default: true } }, { timestamps: true });
export const Plan = mongoose.model("Plan", planSchema);
