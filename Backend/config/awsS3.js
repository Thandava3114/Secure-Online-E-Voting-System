const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const multer = require("multer");
require("dotenv").config();

// AWS S3 Client
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

// Multer Storage Configuration (Stores file in memory before uploading to S3)
const upload = multer({
    storage: multer.memoryStorage(),
});

// Upload File to S3
const uploadFileToS3 = async (file, folder) => {
    const uploadParams = {
        client: s3Client,
        params: {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${folder}/${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype,
        },
    };

    try {
        const upload = new Upload(uploadParams);
        await upload.done();
        return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${folder}/${file.originalname}`;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw new Error("Upload failed");
    }
};

module.exports = { upload, uploadFileToS3 };
