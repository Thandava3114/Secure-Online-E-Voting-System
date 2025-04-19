const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const User = require("../models/User"); // Ensure User model exists
const router = express.Router();

// Forgot Password Route
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Forgot Password Request for:", email);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Store the hashed token and expiration in the database
    user.resetToken = hashedToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1-hour expiration
    await user.save();

    console.log("Generated Reset Token:", resetToken);
    console.log("Stored Hashed Token in DB:", user.resetToken);

    // Send email with the reset link
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      text: `Click the link to reset your password: ${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({
        message: "Reset link sent to your email.",
        resetToken: resetToken // Send the unhashed token to frontend
      });
      
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error, please try again." });
  }
});

// Reset Password Route
router.post("/reset-password", async (req, res) => {
  try {
    console.log("Reset Password Request Body:", req.body);

    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({ message: "Token and password are required." });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    console.log("Received Token:", token);
    console.log("Hashed Token for Lookup:", hashedToken);

    // Find user with valid token
    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() }, // Ensure token is not expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // **DO NOT hash the password manually. Just assign it**
    user.password = password;

    // Clear reset token fields
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save(); // ✅ Mongoose will trigger the pre("save") hook and hash the password automatically

    console.log("Password reset successful for:", user.email);

    res.json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error, please try again." });
  }
});



module.exports = router;
