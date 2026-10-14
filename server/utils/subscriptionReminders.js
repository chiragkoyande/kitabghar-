import { Notification, Rental, Subscription } from "../models/index.js";

export async function runSubscriptionReminders() {
  const now = new Date();
  const activeSubscriptions = await Subscription.find({ status: "active" });
  for (const subscription of activeSubscriptions) {
    const daysLeft = Math.ceil((subscription.endDate - now) / (24 * 60 * 60 * 1000));
    if (daysLeft <= 0) {
      subscription.status = "expired";
      await subscription.save();
      const exists = await Notification.exists({ userId: subscription.userId, title: "Membership ended", createdAt: { $gte: subscription.endDate } });
      if (!exists) await Notification.create({ type: "system", title: "Membership ended", message: "Your Kitab Ghar membership has ended. Renew to continue renting books.", userId: subscription.userId });
    } else if (daysLeft <= 3) {
      const exists = await Notification.exists({ userId: subscription.userId, title: "Membership renewal reminder", createdAt: { $gte: new Date(subscription.endDate.getTime() - 3 * 24 * 60 * 60 * 1000) } });
      if (!exists) await Notification.create({ type: "system", title: "Membership renewal reminder", message: `Your ${subscription.planName} membership ends in ${daysLeft} day${daysLeft === 1 ? "" : "s"}. Renew to keep your reading queue active.`, userId: subscription.userId });
    }
  }
  const rentals = await Rental.find({ status: "active" }).populate("bookId", "title");
  for (const rental of rentals) {
    const daysLeft = Math.ceil((rental.dueDate - now) / (24 * 60 * 60 * 1000));
    if (daysLeft <= 0) rental.status = "overdue";
    if (daysLeft <= 3) {
      const exists = await Notification.exists({ userId: rental.userId, title: "Return reminder", createdAt: { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) }, message: { $regex: rental.bookId?.title || "book" } });
      if (!exists) await Notification.create({ type: "rental", title: "Return reminder", message: daysLeft <= 0 ? `${rental.bookId?.title || "Your book"} is overdue. Please return it to keep your account in good standing.` : `${rental.bookId?.title || "Your book"} is due in ${daysLeft} day${daysLeft === 1 ? "" : "s"}.`, userId: rental.userId });
    }
    if (rental.isModified()) await rental.save();
  }
}
