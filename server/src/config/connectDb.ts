import mongoose from "mongoose";

export async function connectDb() {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    throw new Error("DATABASE_URL not found");
  }

  try {
    await mongoose.connect(dbUrl).then(() => {
      console.log("✅ Database connected successfully");
    });
  } catch (error) {
    console.error("❌ Database connection error:", error);
    throw error;
  }
}
