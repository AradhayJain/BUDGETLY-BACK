import {Message} from "../models/message.model.js"
// import {User} from "../models/user.model.js"
import {Chat} from "../models/chat.model.js"


export const sendMessage = async(req,res)=>{
    // const userId=req.user.id;
    try {
        const {groupId,message}=req.body;
        const chat=await Chat.findById(groupId)
        if(!chat){
            return res.status(404).json({message:"Chat not found"})
        }

        const newMessage = new Message({
            chat:groupId,
            message:message.message,
            user:message.user,
            _id:message._id,
            userId:message.userId,
            timestamp:message.timestamp
        });
        await newMessage.save();
        
        if(newMessage){
            console.log(newMessage)
            return res.status(200).json({
                message: "Message sent successfully",
                newMessage,
            });
        }
  } catch (error) {
    console.error("Send Message Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}


export const getMessages = async(req,res)=>{
    const userId=req.user.id;

    try {
        const groupId=req.query.groupId;
        const chat=await Chat.findById(groupId)
        if(!chat){
            return res.status(404).json({message:"Chat not found"})
        }
        const messages=await Message.find({chat:groupId})
        if(messages){
            return res.status(200).json({
                message: "Messages retrieved successfully",
                messages,
            });
        }
        
    } catch (error) {
        console.log(error);
    }
}