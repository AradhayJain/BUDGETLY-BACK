import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({

    isGroup:{
        type:Boolean,
        default:false
    },
    members:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    chatName:{
        type:String
    },
    latestMessage:{
        type:String,
        default:""
    },
    groupAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    Budget:{
        type:Number,
        default:0
    },
    Expenses:[{
        _id:String,
        name:String,
        amount:String,
        paidBy:String,
        Date:String,
    }]


})

export const Chat = mongoose.model("Chat", chatSchema); 