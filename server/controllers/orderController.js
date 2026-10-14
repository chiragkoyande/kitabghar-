import { Book, Notification, Order, Rental, Subscription } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const allowedStatuses = ["pending", "confirmed", "packed", "out_for_delivery", "delivered", "cancelled"];

export const listMyOrders = asyncHandler(async (request, response) => response.json(await Order.find({ userId: request.user._id }).sort({ createdAt: -1 })));
export const listOrders = asyncHandler(async (_request, response) => response.json(await Order.find().populate("userId", "name email mobile").sort({ createdAt: -1 })));

export const createOrder = asyncHandler(async (request, response) => {
  const { items, address } = request.body;
  if (!Array.isArray(items) || !items.length) return response.status(400).json({ message: "Add at least one book to your cart" });
  if (!address?.name || !address?.mobile || !address?.line1 || !address?.city || !address?.pincode) return response.status(400).json({ message: "Delivery name, mobile, address, city and pincode are required" });
  const subscription = await Subscription.findOne({ userId: request.user._id, status: "active", endDate: { $gt: new Date() } }).sort({ endDate: -1 });
  if (!subscription) return response.status(403).json({ message: "An active membership is required before placing a rental request" });
  const activeRentals = await Rental.countDocuments({ userId: request.user._id, status: "active" });
  if (activeRentals + items.length > subscription.maxActiveRentals) return response.status(409).json({ message: `Your ${subscription.planName} membership allows ${subscription.maxActiveRentals} active rental${subscription.maxActiveRentals > 1 ? "s" : ""}` });
  const uniqueIds = [...new Set(items.map((item) => String(item.bookId)))];
  if (uniqueIds.length !== items.length) return response.status(400).json({ message: "The same book cannot be added twice" });
  const books = await Book.find({ _id: { $in: uniqueIds }, status: "active" });
  if (books.length !== uniqueIds.length || books.some((book) => book.availableCopies < 1)) return response.status(409).json({ message: "One or more selected books are no longer available" });
  const orderItems = books.map((book) => ({ bookId: book._id, title: book.title, author: book.author, coverImage: book.coverImage }));
  for (const book of books) await Book.findOneAndUpdate({ _id: book._id, availableCopies: { $gt: 0 } }, { $inc: { availableCopies: -1 } });
  const order = await Order.create({ userId: request.user._id, items: orderItems, address: { ...address, city: address.city || "Badlapur" } });
  await Notification.create({ type: "rental", title: "New rental request", message: `${request.user.name} requested ${orderItems.length} book${orderItems.length > 1 ? "s" : ""} for delivery in ${address.city}.`, userId: request.user._id });
  response.status(201).json(order);
});

export const updateOrder = asyncHandler(async (request, response) => {
  const order = await Order.findById(request.params.id);
  if (!order) return response.status(404).json({ message: "Order not found" });
  const { status, deliveryOption, deliveryEta, adminNote } = request.body;
  if (status && !allowedStatuses.includes(status)) return response.status(400).json({ message: "Invalid delivery status" });
  if (deliveryOption && !["home_delivery", "pickup"].includes(deliveryOption)) return response.status(400).json({ message: "Invalid delivery option" });
  if (order.status === "delivered" && status && status !== "delivered") return response.status(400).json({ message: "Delivered orders cannot be moved backwards" });
  if (order.status === "cancelled" && status && status !== "cancelled") return response.status(400).json({ message: "Cancelled orders cannot be reopened" });
  if (status === "delivered" && order.status !== "delivered") {
    for (const item of order.items) {
      const exists = await Rental.findOne({ orderId: order._id, bookId: item.bookId });
      if (!exists) await Rental.create({ userId: order.userId, bookId: item.bookId, orderId: order._id, dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), status: "active" });
    }
    order.deliveredAt = new Date();
  }
  if (status === "cancelled" && order.status !== "cancelled" && order.status !== "delivered") {
    for (const item of order.items) await Book.findByIdAndUpdate(item.bookId, { $inc: { availableCopies: 1 } });
  }
  if (status) order.status = status;
  if (deliveryOption) order.deliveryOption = deliveryOption;
  if (deliveryEta) order.deliveryEta = new Date(deliveryEta);
  if (adminNote !== undefined) order.adminNote = adminNote;
  await order.save();
  await Notification.create({ type: "rental", title: status === "delivered" ? "Your books are on the way" : "Rental request updated", message: status === "delivered" ? "Your rental has been delivered. Your 30-day reading period starts now." : `Your rental request is now ${order.status.replaceAll("_", " ")}.`, userId: order.userId });
  response.json(order);
});
