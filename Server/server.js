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

// ✅ CORS configuration (use deployed in production, fallback to localhost in development)
const allowedOrigin = process.env.NODE_ENV === "production" 
  ? "https://chat-app-phi-six-70.vercel.app" 
  : "http://localhost:5173";

app.use(
  cors({ 
    origin: allowedOrigin, 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "token"],
  })
);

app.use(express.json({ limit: "4mb" }));

// ✅ API routes
app.get("/api/status", (req, res) => res.send("✅ Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// ✅ Set up socket.io
const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    credentials: true,
  },
});

setIO(io);

io.on("connection", (socket) => {
  const userId = socket.handshake.query?.userId;
  console.log("⚡ User Connected:", userId);

  if (userId) getUserSocketMap()[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(getUserSocketMap()) );

  socket.on("disconnect", () => {
    console.log("❌ User Disconnected:", userId);
    delete getUserSocketMap()[userId];
    io.emit("getOnlineUsers", Object.keys(getUserSocketMap()) );
  });
});

// ✅ Initialize Database Connection immediately
await connectDB()
  .then(() => console.log("✅ Database connected"))
  .catch((error) => {
    console.error("❌ Failed to connect to database", error);
    process.exit(1);
  });

export default server;