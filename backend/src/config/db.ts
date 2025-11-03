import { config } from "./env";
import mongoose from "mongoose";

export default async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(config.MONGO_URL);
    console.log("Connected to database");
  } catch (err) {
    console.log(err);
    throw new Error("Could not connect to database");
  }
}
