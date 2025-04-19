const express = require("express");
const User = require("../models/User");
const Admin = require("../models/Admin");
const Details = require("../models/Details");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authMiddleware = require("../middleware/authMiddleware");
const voterController = require("../controllers/voterController");
const { getVoters, sendEmails } = require("../controllers/voterController");
const protect = require("../middleware/authMiddleware"); // Import JWT auth middleware

const router = express.Router();

// ✅ User Registration
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      username,
      email,
      password: hashedPassword,
    });
    // await Details.save();
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Admin and User login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    let user = null;

    // Check in Admin collection first
    user = await User.findOne({ email });
    if (!user) {
      // If not found in Admin collection, check in User collection
      user = await Admin.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ User Logout (Clear Token)
router.get("/logout", (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.json({ message: "Logged out successfully" });
});

// ✅ Protected Route: Fetch All Voters (Only Authorized Users)
router.get("/getAll", authMiddleware, getVoters);

// ✅ Protected Route: Send Emails (Only Authorized Users)
router.post("/send-mails", protect, sendEmails);

module.exports = router;
