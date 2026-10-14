import { Notification, Payment, Subscription } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listMyPayments = asyncHandler(async (request, response) => response.json(await Payment.find({ userId: request.user._id }).sort({ createdAt: -1 })));
export const listPayments = asyncHandler(async (_request, response) => response.json(await Payment.find().populate("userId", "name email").populate("subscriptionId", "planName maxActiveRentals status").sort({ createdAt: -1 })));
export const submitPaymentProof = asyncHandler(async (request, response) => {
  const payment = await Payment.findOne({ _id: request.params.id, userId: request.user._id, status: "pending" });
  if (!payment) return response.status(404).json({ message: "Pending payment not found" });
  const payerReference = String(request.body.payerReference || "").trim();
  if (payerReference.length < 4) return response.status(400).json({ message: "Enter the UPI transaction reference shown in your payment app" });
  payment.payerReference = payerReference;
  await payment.save();
  await Notification.create({ type: "payment", title: "UPI reference submitted", message: `${request.user.name} submitted UPI reference ${payerReference} for verification.`, paymentId: payment._id, userId: request.user._id });
  response.json(payment);
});
export const updatePayment = asyncHandler(async (request, response) => {
  const status = request.body.status;
  if (!["paid", "failed"].includes(status)) return response.status(400).json({ message: "Payment status must be paid or failed" });
  const payment = await Payment.findById(request.params.id);
  if (!payment) return response.status(404).json({ message: "Payment not found" });
  if (payment.status !== "pending") return response.status(400).json({ message: "Only pending payments can be verified" });
  payment.status = status;
  payment.verifiedBy = request.user._id;
  payment.verifiedAt = new Date();
  payment.paidAt = status === "paid" ? new Date() : undefined;
  await payment.save();
  if (payment.subscriptionId) {
    const subscription = await Subscription.findByIdAndUpdate(payment.subscriptionId, { status: status === "paid" ? "active" : "cancelled" }, { new: true });
    await Notification.create({
      type: "payment",
      title: status === "paid" ? "Membership activated" : "Membership payment rejected",
      message: status === "paid"
        ? `${subscription?.planName || "Your"} membership is active. You can now rent up to ${subscription?.maxActiveRentals || 0} book${(subscription?.maxActiveRentals || 0) > 1 ? "s" : ""}.`
        : `Your ${subscription?.planName || "membership"} payment was not approved. Please contact Kitab Ghar support.`,
      paymentId: payment._id,
      userId: payment.userId,
    });
  }
  response.json(await payment.populate("userId", "name email"));
});
