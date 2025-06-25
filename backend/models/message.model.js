import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    _id:String,
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chat"
    },
    user:String,
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    message:String,
    timestamp:String,
    isPinned:{
        type:Boolean,
        default:false
    }
})


export const Message = mongoose.model('Message',messageSchema)