import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Database connected ");
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

export { connectDB };
