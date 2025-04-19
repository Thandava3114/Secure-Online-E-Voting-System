require('dotenv').config();
const AWS = require('aws-sdk');

// Check if bucket name is loaded
console.log("🔍 Bucket Name:", process.env.AWS_BUCKET_NAME);

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const testS3Connection = async () => {
    try {
        const params = { Bucket: process.env.AWS_BUCKET_NAME };
        if (!params.Bucket) throw new Error("❌ Bucket name is missing!");
        
        const data = await s3.listObjectsV2(params).promise();
        console.log("✅ AWS S3 Connection Successful!");
        console.log("📂 Files in Bucket:", data.Contents);
    } catch (error) {
        console.error("❌ Error connecting to S3:", error);
    }
};

testS3Connection();
