const express = require("express");
const router = express.Router();
const crypto = require("crypto");

router.post("/challenge", async (req, res) => {
  try {
    const challenge = crypto.randomBytes(32).toString("base64"); // Generate random challenge
    res.json({ challenge });
  } catch (error) {
    console.error("Error generating challenge:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
