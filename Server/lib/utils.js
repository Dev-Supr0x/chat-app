import jwt from "jsonwebtoken";

// Function to generate a JWT token for a user
export const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Optional: Set token to expire in 7 days
  });
  return token;
};
