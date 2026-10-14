import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2 }, email: { type: String, required: true, unique: true, lowercase: true, trim: true }, mobile: { type: String, trim: true }, passwordHash: { type: String, required: true, select: false }, dob: Date, address: String, city: { type: String, default: "Badlapur" }, pincode: String, role: { type: String, enum: ["customer", "admin"], default: "customer" }, profileImage: String,
}, { timestamps: true });

userSchema.methods.comparePassword = function comparePassword(password) { return bcrypt.compare(password, this.passwordHash); };
userSchema.statics.hashPassword = (password) => bcrypt.hash(password, 12);
export const User = mongoose.model("User", userSchema);
