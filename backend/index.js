import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import MongoDB from "./utils/DB.js"
import userRoutes from "./routes/user.routes.js"
import {v2 as cloudinary} from 'cloudinary'
import setupRoutes from "./routes/onboarding.routes.js"
import expenseRoutes from "./routes/expense.routes.js"
import supportRoutes from "./routes/support.routes.js"
import { Server } from "socket.io"
import http from "http"
import googleGenAi from "./utils/Gemini.js"
import groupRoutes from "./routes/groups.routes.js"

dotenv.config({})
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const app = express()
const PORT = process.env.PORT || 3000;
const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
}
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});
app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/api/users",userRoutes)
app.use('/api/setup',setupRoutes);
app.use('/api/expense',expenseRoutes);
app.use('/api/support',supportRoutes);
app.use('/api/group',groupRoutes);

const arr = [];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("chat-message", async (message) => {
    console.log("Received:", message);

    // Add user message to history
    arr.push({ role: "user", content: message });

    // Format the chat history into a string for the prompt
    const historyString = arr
      .map((chat) => `${chat.role.toUpperCase()}: ${chat.content}`)
      .join("\n");

    const prompt = `
You are a helpful financial and personal advisor. Use the following conversation history to answer the user's next message.

${historyString}

Now respond as an advisor to this user message: "${message}"
`;

    // Get AI response
    const response = await googleGenAi(prompt);

    // Add AI response to history
    arr.push({ role: "assistant", content: response });

    // Emit AI response to frontend
    socket.emit("chat-response", response);
  })
    socket.on("join-group", (groupId) => {
      socket.join(groupId);
      console.log(`👥 User ${socket.id} joined group ${groupId}`);
    });
  
    // Send message to group
    socket.on("group-message", ({ groupId, message }) => {
      console.log(`📨 Message to group ${groupId}:`, message);
      io.to(groupId).emit("group-message",message);
    });
  
    // Optional: Leave group
    socket.on("leave-group", (groupId) => {
      socket.leave(groupId);
      console.log(`🚪 User ${socket.id} left group ${groupId}`);
    });
  
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
});


server.listen(PORT, ()=>{
    MongoDB();
    console.log(`server is running on port ${PORT}`);
})