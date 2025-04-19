// routes/electionRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  createElection,
  voteForCandidate,
  declareResults,
} = require("../controllers/electionController");

// Storage configuration for multer (save files to 'uploads' directory)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename using timestamp
  },
});

const upload = multer({ storage: storage }).any();
const router = express.Router();

// POST request for creating election with file uploads
router.post("/", upload, createElection);
router.post("/vote", voteForCandidate);
router.post("/declare-results", declareResults);
module.exports = router;
