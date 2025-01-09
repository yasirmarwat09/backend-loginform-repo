// api/welcome.js
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Define the User model inside the same file (you can define it in each file like this)
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
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find the user by the decoded ID
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Respond with a welcome message and user details
    res.json({
      message: `Welcome, ${user.username}!`,
      user: { username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
