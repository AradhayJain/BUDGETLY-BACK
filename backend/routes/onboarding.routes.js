import express from "express"
import { protect } from "../middlewares/authMiddleware.js"
import { AddCategory, getSetupData, setupUser } from "../controllers/setup.controller.js"

const router = express.Router()

router.post("/",protect,setupUser);
router.get("/ai",protect,getSetupData);


export default router;