const express = require("express");
const Details = require("../models/Details");
const router = express.Router();
const crypto = require("crypto");
const base64url = require("base64url");

// Route to store user details
router.post("/storeDetails", async (req, res) => {
  try {
    const {
      voterId,
      aadhaarNumber,
      fullName,
      dob,
      gender,
      address,
      pincode,
      fingerprintScan,
      publicKey,
    } = req.body;

    if (
      !voterId ||
      !aadhaarNumber ||
      !fullName ||
      !dob ||
      !gender ||
      !address ||
      !pincode ||
      !fingerprintScan ||
      !publicKey
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await Details.findOne({
      $or: [{ voterId }, { aadhaarNumber }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Voter ID or Aadhaar Number already exists" });
    }

    const newDetails = new Details({
      voterId,
      aadhaarNumber,
      fullName,
      dob,
      gender,
      address,
      pincode,
      fingerprintScan,
      publicKey,
    });

    await newDetails.save();
    res.status(201).json({ message: "Details saved successfully!" });
  } catch (error) {
    console.error("Error storing details:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

// Route to authenticate voter using fingerprint
router.post("/authenticate", async (req, res) => {
  try {
    const { voterId, fingerprintScan } = req.body;

    const user = await Details.findOne({ voterId });
    if (!user || !user.fingerprint || !user.fingerprint.publicKey) {
      return res.status(400).json({ message: "Fingerprint not registered." });
    }

    const { authenticatorData, clientDataJSON, signature } = fingerprintScan;
    const clientData = JSON.parse(Buffer.from(clientDataJSON).toString());

    if (clientData.type !== "webauthn.get") {
      return res.status(400).json({ message: "Invalid WebAuthn request." });
    }

    const publicKey = user.fingerprint.publicKey;
    const dataToVerify = Buffer.concat([
      Buffer.from(authenticatorData),
      crypto.createHash("SHA256").update(Buffer.from(clientDataJSON)).digest(),
    ]);

    const isValid = verifySignature(signature, dataToVerify, publicKey);

    if (!isValid) {
      return res
        .status(403)
        .json({ message: "Fingerprint authentication failed." });
    }

    return res
      .status(200)
      .json({ message: "Fingerprint verified successfully." });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// ✅ NEW: Route to fetch details by voterId


module.exports = router;
