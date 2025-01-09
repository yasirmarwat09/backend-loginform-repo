// api/protected.js
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Define the User model inside the same file
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

// JWT Secret
const JWT_SECRET = "secret_key123";

// API route
export default async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    // Verify the token and decode it
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find the user by ID from the decoded JWT token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Respond with a message indicating access is granted
    res.json({
      message: "Access granted",
      userId: decoded.id,
      username: user.username,
    });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
