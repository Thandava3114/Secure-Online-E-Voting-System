require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const electionRoutes = require("./routes/electionRoutes");
const voterRoutes = require("./routes/voterRoutes");
const adminRoutes = require("./routes/adminRoutes");
const fileRoutes = require("./routes/fileRoutes");
const detailsRoutes = require("./routes/detailsRoutes");
const webauthn = require("./routes/webauthn");
const passwordRoutes = require("./routes/passwordRoutes"); // ✅ Import forgot password routes

const app = express();

// Ensure "uploads" directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

let users = {}; // Temporary storage for user fingerprint keys

// Route to register fingerprint (stores public key)
app.post("/api/register", (req, res) => {
  const { id, publicKey } = req.body;
  users[id] = { publicKey };
  res.json({ success: true, message: "Fingerprint registered successfully!" });
});

// Route to authenticate user using fingerprint
app.post("/api/authenticate", (req, res) => {
  const { id } = req.body;
  if (users[id]) {
    res.json({ success: true, message: "Authentication successful!" });
  } else {
    res.json({ success: false, message: "Authentication failed!" });
  }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Serve static files (for uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect Database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/elections", electionRoutes);
app.use("/api/voters", voterRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/password", passwordRoutes); // ✅ Add forgot password route
app.use("/api/details", detailsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
