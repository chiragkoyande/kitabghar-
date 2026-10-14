import mongoose from "mongoose";

let connectionPromise;

export async function connectDatabase() {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not configured");
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (connectionPromise) return connectionPromise;
  mongoose.set("strictQuery", true);
  connectionPromise = mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log(`MongoDB connected: ${mongoose.connection.name}`);
      return mongoose.connection;
    })
    .catch((error) => {
      connectionPromise = undefined;
      throw error;
    });
  return connectionPromise;
}
