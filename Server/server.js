console.log("✅ server.js file loaded...");

import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { setIO, getUserSocketMap } from "./lib/socket.js";

const app = express();
const server = http.createServer(app);

// ✅ Fix: Correct CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend
    credentials: true,               // allow cookies & headers
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "token"], // include custom token header
  })
);

app.use(express.json({ limit: "4mb" }));

// ✅ Set up API routes
app.get("/api/status", (req, res) => res.send("✅ Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// ✅ Set up socket.io with proper CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

setIO(io);

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("⚡ User Connected:", userId);

  if (userId) getUserSocketMap()[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(getUserSocketMap()));

  socket.on("disconnect", () => {
    console.log("❌ User Disconnected:", userId);
    delete getUserSocketMap()[userId];
    io.emit("getOnlineUsers", Object.keys(getUserSocketMap()));
  });
});

// ✅ Start server
const startServer = async () => {
  try {
    await connectDB();
    if(process.env.NODE_ENV !== "production"){
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log("🚀 Server is running on PORT: " + PORT);
    });}
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  } 
};

startServer();

// export server for versal
export default server;
