import { Book } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

export const listBooks = asyncHandler(async (request, response) => {
  const { search, category, availability } = request.query;
  const query = { status: "active" };
  if (category) query.category = category;
  if (availability === "available") query.availableCopies = { $gt: 0 };
  if (availability === "unavailable") query.availableCopies = 0;
  if (search) query.$text = { $search: search };
  const books = await Book.find(query).sort(search ? { score: { $meta: "textScore" } } : { createdAt: -1 });
  response.json({ count: books.length, books });
});

export const getBook = asyncHandler(async (request, response) => {
  if (!mongoose.isValidObjectId(request.params.id)) return response.status(400).json({ message: "Invalid book ID" });
  const book = await Book.findById(request.params.id);
  if (!book) return response.status(404).json({ message: "Book not found" });
  response.json(book);
});
