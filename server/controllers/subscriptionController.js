import { Notification, Payment, Plan, Subscription } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listMySubscriptions = asyncHandler(async (request, response) => response.json(await Subscription.find({ userId: request.user._id }).sort({ createdAt: -1 })));
export const listSubscriptions = asyncHandler(async (_request, response) => response.json(await Subscription.find().populate("userId", "name email").sort({ createdAt: -1 })));
export const createSubscription = asyncHandler(async (request, response) => {
  const plan = await Plan.findOne({ _id: request.body.planId, active: true });
  if (!plan) return response.status(404).json({ message: "Active membership plan not found" });
  const paymentMethod = request.body.paymentMethod === "upi" ? "upi" : "demo";
  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  const pending = paymentMethod === "upi";
  const subscription = await Subscription.create({ userId: request.user._id, planId: plan._id, planName: plan.name, amount: plan.amount, startDate, endDate, maxActiveRentals: plan.maxActiveRentals, status: pending ? "pending" : "active" });
  const payment = await Payment.create({ userId: request.user._id, subscriptionId: subscription._id, amount: plan.amount, currency: plan.currency, method: paymentMethod, transactionReference: `${pending ? "UPI" : "DEMO"}-${Date.now()}`, status: pending ? "pending" : "simulated", paidAt: pending ? undefined : startDate });
  subscription.paymentId = payment._id; await subscription.save();
  if (pending) {
    await Notification.create({ type: "payment", title: "UPI payment awaiting verification", message: `${request.user.name} submitted a ₹${plan.amount} ${plan.name} membership payment. Verify the UPI reference before activating it.`, paymentId: payment._id, userId: request.user._id });
  }
  response.status(201).json({ subscription, payment, upiId: process.env.UPI_ID || "kitabghar@upi", paymentStatus: pending ? "pending_verification" : "simulated" });
});
export const updateSubscription = asyncHandler(async (request, response) => {
  const subscription = await Subscription.findByIdAndUpdate(request.params.id, { status: request.body.status }, { new: true, runValidators: true });
  if (!subscription) return response.status(404).json({ message: "Subscription not found" });
  response.json(subscription);
});
