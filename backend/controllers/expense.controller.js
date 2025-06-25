import {User} from "../models/user.model.js"
import {Expense} from "../models/expense.model.js"
import { raw } from "express"
import asyncHandler from "express-async-handler"


export const Addexpnese = async (req, res) => {
    const { date, category, amount, name } = req.body;
    const userId = req.user.id;
  
    try {
      const user = await User.findById(userId); // ✅ await added
  
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      const expense = new Expense({
        userId,
        date,
        category,
        amount,
        name,
      });
  
      await expense.save();
  
      res.status(201).json({ message: "Expense Added Successfully",
        expense:{
            date,
            category,
            amount,
            name
        }
      });
    } catch (err) {
      console.error("❌ Error adding expense:", err);
      res.status(500).json({ message: "Error in Adding Expense" });
    }
  };


export const getAllExpense = async (req, res) =>{
  const userId = req.user.id;
  try {
    const expense = await Expense.find({userId:userId}).populate('userId');
    res.status(200).json(expense);
    } catch (err) {
      console.error("❌ Error fetching expense:", err);
      res.status(500).json({ message: "Error in Fetching Expense" });
    }
      
}
export const reqExpenses = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const keyword = req.query.search
    ? {
        userId: userId,
        $or: [
          { category: { $regex: req.query.search, $options: "i" } },
          { name: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : { userId: userId };

  const expenses = await Expense.find(keyword).sort({ date: -1 }); // sorted by most recent
  res.send(expenses);
});




