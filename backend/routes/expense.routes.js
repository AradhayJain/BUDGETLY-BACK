import express from "express"
import { protect } from "../middlewares/authMiddleware.js";
import { Addexpnese, getAllExpense, reqExpenses } from "../controllers/expense.controller.js";

const router=express.Router();


router.post('/add-expense',protect,Addexpnese);
router.get('/all',protect,reqExpenses);
router.get('/get-all',protect,getAllExpense);

export default router;