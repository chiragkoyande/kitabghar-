import mongoose from "mongoose";
const adminSchema = new mongoose.Schema({ userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true }, permissions: [String] }, { timestamps: true });
export const Admin = mongoose.model("Admin", adminSchema);
