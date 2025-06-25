// models/Income.js
import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  source: String, // Freelance, Internship, Family
  description: String,
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Income", incomeSchema);
