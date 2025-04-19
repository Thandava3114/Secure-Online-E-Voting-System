const express = require("express");
const router = express.Router();
const Details = require("../models/Details");

// Convert base64url to Uint8Array
function base64urlToUint8Array(base64url) {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(base64 + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// GET /api/details/auth-init?voterId=...
router.get("/auth-init", async (req, res) => {
  const { voterId } = req.query;
  if (!voterId)
    return res.status(400).json({ message: "Voter ID is required" });

  const user = await Details.findOne({ voterId });
  if (!user || !user.fingerprintScan) {
    return res.status(404).json({ message: "Fingerprint not registered" });
  }

  const { credentialId, challenge } = JSON.parse(user.fingerprintScan);

  res.json({
    credentialId,
    challenge,
  });
});

// POST /api/details/authenticate
router.post("/authenticate", async (req, res) => {
  const { voterId, fingerprintScan } = req.body;
  if (!voterId || !fingerprintScan)
    return res.status(400).json({ success: false, message: "Missing data" });

  const user = await Details.findOne({ voterId });
  if (!user || !user.fingerprintScan) {
    return res
      .status(404)
      .json({ success: false, message: "Fingerprint not found" });
  }

  // Dummy match check for now. Replace with real WebAuthn library later.
  const registeredScan = JSON.parse(user.fingerprintScan);
  if (registeredScan.id === fingerprintScan.id) {
    return res
      .status(200)
      .json({ success: true, message: "Fingerprint verified" });
  }

  return res
    .status(401)
    .json({ success: false, message: "Fingerprint mismatch" });
});

router.get("/:voterId", async (req, res) => {
  const { voterId } = req.params;
  console.log("🔍 Looking for voterId:", voterId); // Log input

  const user = await Details.findOne({ voterId });
  console.log("📦 User found:", user); // Log result

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  // Return public details only
  res.status(200).json({
    fullName: user.fullName,
    aadhaarNumber: user.aadhaarNumber,
    dob: user.dob,
    gender: user.gender,
    address: user.address,
    pincode: user.pincode,
    state: user.state || "Andhra Pradesh",
    country: user.country || "India",
    voterId: user.voterId,
  });
});

module.exports = router;
