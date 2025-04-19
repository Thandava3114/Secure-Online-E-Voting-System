const User = require("../models/User");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { username, email, password } = req.body;
  
  console.log("🔹 Login Attempt Received:", { username, email });

  try {
    let user = null;
    let role = "";

    if (email) {
      console.log("🔍 Checking Admin Login...");
      user = await Admin.findOne({ email });
      if (user) role = "admin";
    }

    if (!user && email) {
      console.log("🔍 Checking User Login...");
      user = await User.findOne({ email });
      if (user) role = "user";
    }

    if (!user && username) {
      console.log("🔍 Checking Voter Login...");
      user = await User.findOne({ voterId: username });
      if (user) role = "voter";
    }

    if (!user) {
      console.log("❌ No user found for email:", email, "or voterId:", username);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("✅ User Found:", user);

    let isMatch = false;

    if (role === "voter") {
      if (user.tempPassword) {
        isMatch = await bcrypt.compare(password, user.tempPassword);
      } else {
        return res.status(401).json({ message: "Voter password expired or invalid" });
      }
    } else {
      isMatch = await bcrypt.compare(password, user.password);
    }

    console.log("🔑 Password Match Status:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (role === "voter" && user.tempPasswordExpiry && new Date(user.tempPasswordExpiry) < new Date()) {
      return res.status(401).json({ message: "Temporary password has expired" });
    }

    const token = jwt.sign(
      { userId: user._id, role, voterId: user.voterId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("✅ Login Successful:", { role, voterId: user.voterId });

    return res.json({
      token,
      role,
      voterId: user.voterId,
      redirect: role === "admin" ? "/admin-home" 
                : role === "voter" ? "/candidates" 
                : "/home"
    });

  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


