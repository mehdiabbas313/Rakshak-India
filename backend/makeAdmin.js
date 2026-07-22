import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const user = await User.findOneAndUpdate(
  { email: "mehdiabbaszaidi65@gmail.com" },
  { role: "admin" },
  { new: true }
);

console.log("Updated user:", user?.email, user?.role);

await mongoose.disconnect();