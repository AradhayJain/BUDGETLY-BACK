// models/Goal.js
import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  goalName:String,
  title: String,
  targetAmount: Number,
  deadline: Date,
  savedAmount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Goal", goalSchema);
