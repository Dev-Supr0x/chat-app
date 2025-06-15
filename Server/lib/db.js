import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("✅ Database Connected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB Error:", err);
    });

    await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`, {
      dbName: "chat-app", // optional but explicit
    });

  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    throw error;
  }
};
