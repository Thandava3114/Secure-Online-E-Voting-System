const User = require("../models/User");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// Fetch all registered voters
exports.getVoters = async (req, res) => {
  try {
    const voters = await User.find({}, "voterId username email");
    res.status(200).json(voters);
  } catch (error) {
    console.error("Error fetching voters:", error);
    res
      .status(500)
      .json({ message: "Error fetching voters", error: error.message });
  }
};

// Configure Nodemailer for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Email from .env
    pass: process.env.EMAIL_PASS, // Use App Password, not actual password
  },
});

// Generate a random temporary password
const generateTempPassword = () => crypto.randomBytes(6).toString("hex");

// Send Emails with Temporary Credentials
exports.sendEmails = async (req, res) => {
  try {
    console.log("📧 Fetching users for sending emails...");

    // Find users who need a temporary password
    const users = await User.find(
      {
        $or: [
          { tempPassword: { $exists: false } }, // Check if tempPassword is missing
          { tempPasswordExpiry: { $lt: new Date() } }, // Expired temp passwords
        ],
      },
      "voterId username email" // Fetch voterId along with username & email
    );

    if (users.length === 0) {
      console.log("⚠️ No eligible voters found.");
      return res
        .status(400)
        .json({ message: "No eligible voters found for sending credentials." });
    }

    console.log(`✅ Found ${users.length} users. Sending emails...`);

    // Process each user
    const emailPromises = users.map(async (user) => {
      const tempPassword = generateTempPassword();
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      try {
        // Update user with temporary credentials and expiry
        await User.updateOne(
          { _id: user._id },
          {
            $set: {
              tempPassword: hashedPassword,
              tempPasswordExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
          }
        );

        // Email content
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: "Your Temporary Voting Credentials",
          text: `Dear ${user.username},\n\nHere are your temporary login credentials:\n\nUsername: ${user.voterId}\nTemporary Password: ${tempPassword}\n\nThis password is valid only for voting and will expire after you cast your vote.\n\nBest regards,\nElection System`,
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log(`📨 Email sent to: ${user.email}`);
      } catch (emailError) {
        console.error(`❌ Failed to send email to ${user.email}:`, emailError.message);
      }
    });

    await Promise.all(emailPromises);
    res.status(200).json({ message: "Emails sent successfully!" });
  } catch (error) {
    console.error("🚨 Error sending emails:", error);
    res.status(500).json({ error: "Failed to send emails" });
  }
};
