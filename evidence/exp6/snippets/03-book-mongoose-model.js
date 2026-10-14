import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true }, author: { type: String, required: true, trim: true }, description: { type: String, required: true }, isbn: { type: String, trim: true }, category: { type: String, required: true, trim: true }, language: { type: String, default: "English" }, publicationYear: Number, coverImage: String, totalCopies: { type: Number, required: true, min: 0 }, availableCopies: { type: Number, required: true, min: 0 }, status: { type: String, enum: ["active", "archived"], default: "active" },
}, { timestamps: true });
bookSchema.index({ title: "text", author: "text", category: "text" });
export const Book = mongoose.model("Book", bookSchema);
