const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Function to generate a unique voter ID
const generateVoterId = async () => {
  let voterId;
  let exists;
  
  const User = require("../models/User"); // Import User model

  do {
    const randomNumbers = Math.floor(100000 + Math.random() * 900000);
    voterId = `VOTE${randomNumbers}`;

    exists = await User.findOne({ voterId });
  } while (exists);

  return voterId;
};

const UserSchema = new mongoose.Schema(
  {
    voterId: { type: String, unique: true },
    username: { type: String, unique: true, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tempPassword: { type: String, default: null },
    tempPasswordExpiry: { type: Date, default: null },

    // Fields for Forgot Password Feature
    resetToken: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null },
  },
  { timestamps: true }
);

// Generate a unique voter ID before saving
UserSchema.pre("save", async function (next) {
  if (!this.voterId) {
    this.voterId = await generateVoterId(); // ✅ Now it works!
  }

  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT Token
UserSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id, email: this.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};

module.exports = mongoose.model("User", UserSchema);
