// Middleware to protect routes
import jwt from "jsonwebtoken"; // ✅ Missing import added
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("JWT Error:", error.message);
    res.json({ success: false, message: "Unauthorized or invalid token" });
  }
};
