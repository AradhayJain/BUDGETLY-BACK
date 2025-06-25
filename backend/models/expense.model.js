// models/Expense.js
import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  category: String, // e.g., Food, Rent, Travel
  name: String,
  date: { type: Date, default: Date.now }
});
export const Expense = mongoose.model('Expense',expenseSchema);
