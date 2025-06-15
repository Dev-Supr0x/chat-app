let io = null;
const userSocketMap = {}; // userId => socketId

export const setIO = (ioInstance) => {
  io = ioInstance;
};

export const getIO = () => {
  if (!io) {
    throw new Error("❌ Socket.io instance not initialized!");
  }
  return io;
};

export const getUserSocketMap = () => userSocketMap;
