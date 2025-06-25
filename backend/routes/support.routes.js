import express from "express"
import { protect } from "../middlewares/authMiddleware.js";
import { support } from "../controllers/support.controller.js";

const router = express.Router();

router.post('/get-support',protect,support);

export default router;