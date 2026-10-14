import "dotenv/config";
import mongoose from "mongoose";
import { Admin, Book, Category, Plan, User } from "../models/index.js";
import { connectDatabase } from "../config/db.js";
import { catalogue } from "../data/catalogue.js";

const demoAccounts = {
  admin: { name: "Kitab Ghar Admin", email: "admin@kitabghar.local", password: "KitabGhar@2026!", role: "admin" },
  customer: { name: "Demo Reader", email: "reader@kitabghar.local", password: "Reader@2026!", role: "customer" },
};

const categoryDescriptions = {
  Classics: "Enduring stories and literary landmarks.",
  "Literary Fiction": "Character-led stories and contemporary literary voices.",
  "Fantasy & Sci-Fi": "Imaginative worlds, speculative futures and big questions.",
  "Mythology & Fantasy": "Myths, legends and Indian-inspired fantasy adventures.",
  "Mystery & Thriller": "Page-turning mysteries, suspense and detective stories.",
  Romance: "Warm, hopeful stories about relationships and second chances.",
  "Children's & YA": "Curated stories and adventures for younger readers.",
  "Comics & Graphic Novels": "Visual storytelling across graphic novels and comics.",
  Nonfiction: "Ideas, skills and true stories for curious minds.",
  "Nonfiction & Memoir": "Memoirs, journeys and real-life perspectives.",
  Poetry: "Poems about love, life, loss and everything between.",
  "Hindi Literature": "Selected Hindi stories and modern literary voices.",
};

async function upsertDemoUser(account) {
  const passwordHash = await User.hashPassword(account.password);
  let user = await User.findOne({ email: account.email });
  if (!user) user = new User({ email: account.email });
  user.name = account.name;
  user.passwordHash = passwordHash;
  user.role = account.role;
  user.city = "Badlapur";
  user.pincode = "421503";
  await user.save();
  return user;
}

await connectDatabase();

for (const [name, description] of Object.entries(categoryDescriptions)) {
  await Category.updateOne({ name }, { $set: { description } }, { upsert: true });
}

await Promise.all([
  Plan.updateOne({ name: "Basic" }, { $set: { amount: 199, maxActiveRentals: 1, benefits: ["Standard catalogue access", "Basic support"], active: true } }, { upsert: true }),
  Plan.updateOne({ name: "Standard" }, { $set: { amount: 299, maxActiveRentals: 3, benefits: ["Full catalogue access", "Priority reservations"], active: true } }, { upsert: true }),
  Plan.updateOne({ name: "Premium" }, { $set: { amount: 499, maxActiveRentals: 5, benefits: ["Full catalogue access", "Priority reservations", "Premium support"], active: true } }, { upsert: true }),
]);

await Promise.all(catalogue.map((book) => Book.updateOne(
  { title: book.title, author: book.author },
  { $set: book },
  { upsert: true },
)));

const admin = await upsertDemoUser(demoAccounts.admin);
await Admin.updateOne(
  { userId: admin._id },
  { $set: { permissions: ["books:write", "users:read", "rentals:manage", "subscriptions:manage", "payments:read", "reports:read"] } },
  { upsert: true },
);
await upsertDemoUser(demoAccounts.customer);

console.log(`Seeded ${catalogue.length} books with PDF cover images.`);
console.log("Demo admin: admin@kitabghar.local / KitabGhar@2026!");
console.log("Demo customer: reader@kitabghar.local / Reader@2026!");
await mongoose.disconnect();
