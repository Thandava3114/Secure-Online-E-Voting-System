const express = require("express");
const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

// AWS S3 Configuration
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Multer Configuration for File Upload
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

// Function to Upload to S3
const uploadToS3 = async (file, fileType) => {
  if (!file) throw new Error("No file provided for upload.");

  const fileExtension = file.mimetype.split("/")[1] || "bin"; // Extract file type
  const fileName = `${fileType}-${Date.now()}.${fileExtension}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${process.env.S3_UPLOAD_PATH || "biometric"}/${fileName}`, // Use env variable for path
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  await s3.send(new PutObjectCommand(params));
  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
};

// Upload API
router.post("/upload", upload.fields([{ name: "fingerprint" }, { name: "iris" }]), async (req, res) => {
  try {
    if (!req.files?.fingerprint?.length || !req.files?.iris?.length) {
      return res.status(400).json({ error: "Both fingerprint and iris images are required!" });
    }

    // Upload fingerprint and iris images to S3
    const fingerprintUrl = await uploadToS3(req.files.fingerprint[0], "fingerprint");
    const irisUrl = await uploadToS3(req.files.iris[0], "iris");

    res.json({
      message: "Upload successful!",
      fingerprintUrl,
      irisUrl,
    });
  } catch (error) {
    console.error("S3 Upload Error:", error);
    res.status(500).json({ error: error.message || "File upload failed!" });
  }
});

module.exports = router;
