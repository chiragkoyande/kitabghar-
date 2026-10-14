import { Book, Rental, Subscription } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listMyRentals = asyncHandler(async (request, response) => response.json(await Rental.find({ userId: request.user._id }).populate("bookId").sort({ rentedAt: -1 })));
export const listRentals = asyncHandler(async (_request, response) => response.json(await Rental.find().populate("userId", "name email").populate("bookId", "title author").sort({ rentedAt: -1 })));
export const getRental = asyncHandler(async (request, response) => {
  const rental = await Rental.findById(request.params.id).populate("bookId").populate("userId", "name email");
  if (!rental) return response.status(404).json({ message: "Rental not found" });
  if (request.user.role !== "admin" && rental.userId._id.toString() !== request.user._id.toString()) return response.status(403).json({ message: "You cannot view this rental" });
  response.json(rental);
});
export const createRental = asyncHandler(async (request, response) => {
  const { bookId } = request.body;
  if (!bookId) return response.status(400).json({ message: "bookId is required" });
  const subscription = await Subscription.findOne({ userId: request.user._id, status: "active", endDate: { $gt: new Date() } }).sort({ endDate: -1 });
  if (!subscription) return response.status(403).json({ message: "An active membership is required before renting a book" });
  const activeRentals = await Rental.countDocuments({ userId: request.user._id, status: "active" });
  if (activeRentals >= subscription.maxActiveRentals) return response.status(409).json({ message: "Your membership rental limit has been reached" });
  const book = await Book.findOneAndUpdate({ _id: bookId, status: "active", availableCopies: { $gt: 0 } }, { $inc: { availableCopies: -1 } }, { new: true });
  if (!book) return response.status(409).json({ message: "Book is unavailable or does not exist" });
  const rental = await Rental.create({ userId: request.user._id, bookId: book._id, dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), status: "active" });
  response.status(201).json(await rental.populate("bookId"));
});
export const returnRental = asyncHandler(async (request, response) => {
  const rental = await Rental.findById(request.params.id);
  if (!rental) return response.status(404).json({ message: "Rental not found" });
  if (rental.userId.toString() !== request.user._id.toString() && request.user.role !== "admin") return response.status(403).json({ message: "You cannot return this rental" });
  if (rental.status === "returned") return response.status(400).json({ message: "Rental is already returned" });
  rental.status = "returned"; rental.returnedAt = new Date(); await rental.save();
  await Book.findByIdAndUpdate(rental.bookId, { $inc: { availableCopies: 1 } });
  response.json(rental);
});
export const deleteRental = asyncHandler(async (request, response) => {
  const rental = await Rental.findByIdAndDelete(request.params.id);
  if (!rental) return response.status(404).json({ message: "Rental not found" });
  response.json({ message: "Rental deleted" });
});
