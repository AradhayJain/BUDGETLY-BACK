import express from "express"
import { allUsers, getIncome, loginUser, registerUser,addIncome, ChangeLimits, DeleteLimit, editProfile } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.js";
import { protect } from "../middlewares/authMiddleware.js";
import { AddCategory } from "../controllers/setup.controller.js";


const router = express.Router();

router.post("/register", (req, res, next) => {
    upload.single("pic")(req, res, function (err) {
      if (err) {
        return res.status(400).json({ message: "File upload failed", error: err.message });
      }
      next();
    });
  }, registerUser);
  
router.post('/login',loginUser);
router.post("/add-category",protect,AddCategory);
router.get("/all-income",protect,getIncome);
router.put('/add-income',protect,addIncome);
router.post('/change-limits',protect,ChangeLimits);
router.put('/delete-limits',protect,DeleteLimit);
router.get('/all',protect,allUsers);
// router.put("/change", (req, res, next) => {
//   upload.single("pic")(req, res, function (err) {
//     if (err) {
//       return res.status(400).json({ message: "File upload failed", error: err.message });
//     }
//     next();
//   });
// }, updateUserProfile);

router.put('/edit-profile',protect,editProfile);



export default router;