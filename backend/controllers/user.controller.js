import asyncHandler from "express-async-handler"
import generateToken from "../utils/generateToken.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, type } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  let picUrl = "";
  if (req.file) {
    console.log(req.file.path)
    const cloudinaryResult = await uploadOnCloudinary(req.file.path);
    console.log(cloudinaryResult)
    if (cloudinaryResult) {
      picUrl = cloudinaryResult.secure_url;
    } else {
      res.status(500);
      throw new Error("Image upload failed");
    }
  }

  const user = await User.create({
    name,
    email,
    password,
    type,
    pic: picUrl || undefined, // optional field
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      type: user.type,
      pic: user.pic,
      token:generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});


export const loginUser= asyncHandler(async (req,res)=>{
    const {email,password}=req.body
    const user=await User.findOne({email})
    console.log(user)
    let check=false;
    console.log(password)
    // console.log(await user.matchPassword(password))
    if(user && (await user.matchPassword(password))){
        check=true;
    }

    if(check==true){
        const token=generateToken(user._id);
        console.log(token)
        res.status(200).json({
          user,
          token:token
        })
    }
    else{
        res.status(401)
        throw new Error("Invalid credentials")

    }
})

export const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
  
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
})

export const getIncome = async (req,res)=>{
  const userId=req.user.id;

  try{
    const user=await User.findById(userId);
    const incomeSources=user.incomeSources;
    res.status(200).json({
      incomeSources:incomeSources
    })
  }
  catch(err){
    console.log(err);
  }
}

export const addIncome = async (req,res) => {
  const { incomeSource }=req.body;
  const userId=req.user.id;
  try{
    const user=await User.findById(userId);
    user.incomeSources.push(incomeSource);
    await user.save();
    res.status(200).json({
      message:"Income source added successfully"
      
    })

  }catch(err){
    console.log("cannot add income")
    console.log(err);
  }

}

export const ChangeLimits = async (req, res) => {
  const userId = req.user.id;
  const { PrimarySpendsLimits } = req.body;


  try {
    const user = await User.findById(userId);
    

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const title=PrimarySpendsLimits.title;
    const amount=PrimarySpendsLimits.amount;

    let updated = false;

    user.PrimarySpendsLimits.forEach((spend) => {
      if (spend.title === title) {
        spend.amount = amount;  // Assuming your schema uses `amount`
        updated = true;
      }
    });

    if (!updated) {
      return res.status(404).json({ message: "Category not found in user's limits" });
    }

    await user.save();

    res.status(200).json({
      message: "Limit updated successfully",
      user:user
    });

  } catch (err) {
    console.error("Error in ChangeLimits:", err);
    res.status(500).json({ message: "Server error while updating limit" });
  }
};

export const DeleteLimit = async (req, res) =>
  {
    const userId = req.user.id;
    const { title } = req.body;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
        }
        const index = user.PrimarySpendsLimits.findIndex(
          (spend) =>
            spend.title.toLowerCase() === title.toLowerCase()
          );
          if (index === -1) {
            return res.status(404).json({ message: "Category not found in user's limits"
              });
              }
              user.PrimarySpendsLimits.splice(index, 1);
              await user.save();
              res.status(200).json({
                message: "Limit deleted successfully",
                user:user
                });
                } catch (err) {
                  console.error("Error in DeleteLimit:", err);
                  res.status(500).json({ message: "Server error while deleting limit" });
                  }
                  };





                  
                  
                  
                 



export const editProfile = async(req,res)=>{
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const {name,email,monthlyBudget}=req.body;
    if(name) user.name=name;
    if(email) user.email=email;
    if(monthlyBudget) user.monthlyBudget=monthlyBudget;
    const updatedUser = await user.save();
    res.status(200).json({
      updatedUser
    })
    
  } catch (error) {
    console.log(error);
  }
}
                  