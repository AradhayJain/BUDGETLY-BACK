import express from "express"
import {protect} from "../middlewares/authMiddleware.js"
import { addExpense, createGroup, deleteGroup, fetchAll } from "../controllers/group.controller.js"
import { getMessages, sendMessage } from "../controllers/message.controller.js"

const router = express.Router()

router.post('/create',protect,createGroup);
router.get('/all',protect,fetchAll);
router.post('/delete',protect,deleteGroup);
router.post('/send-message',protect,sendMessage);
router.get('/get-messages',protect,getMessages);
router.post('/add-expense',protect,addExpense);

export default router;