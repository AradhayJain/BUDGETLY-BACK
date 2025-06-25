import { Chat } from "../models/chat.model.js";


export const createGroup = async (req, res) => {
    const userId=req.user.id;
    const { name, users } = req.body;
  
    try {
      if (!name || !users || users.length === 0) {
        return res.status(400).json({ message: "Please fill all fields" });
      }
  
      const chat = await Chat.create({
        isGroup: true,
        chatName: name,
        members: users,
        groupAdmin:userId,
      });
  
      // Populate members field with user details
      const fullChat = await chat.populate('members');
  
      return res.status(200).json({
        message: "Group created successfully",
        chat: fullChat,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  };
  


export const fetchAll= async (req,res)=>{
    const userId=req.user.id;
    try{
        const chats = await Chat.find({members:userId}).populate('members');
        if(chats){
            return res.status(200).json({message:"Chats fetched successfully",
                chats
            });
        }
    }
    catch(err){
        console.log(err);
    }
}


export const deleteGroup = async(req,res)=>{
    const userId=req.user.id;
    const {chatId}=req.body;
    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        if (!chat.members.includes(userId)) {
            return res.status(403).json({ message: "You are not a member of this chat" });
        }
        await chat.deleteOne();
        return res.status(200).json({ message: "Chat deleted successfully" });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
}
// import { Chat } from "../models/chat.model.js";

export const addExpense = async (req, res) => {
  try {
    const { groupId, newExpense } = req.body;

    if (!groupId || !newExpense) {
      return res.status(400).json({ message: "Missing groupId or expense data" });
    }

    const chat = await Chat.findById(groupId);
    if (!chat) {
      return res.status(404).json({ message: "Group chat not found" });
    }

    // Push the new expense to the Expenses array
    chat.Expenses.push(newExpense);
    await chat.save();

    return res.status(200).json({
      message: "Expense added successfully",
      expense: newExpense,
      updatedChat: chat,
    });
  } catch (error) {
    console.error("Add Expense Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
