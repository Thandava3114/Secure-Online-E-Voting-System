const Election = require("../models/Election"); // Import Election Model
const { Web3 } = require("web3");
const Voting = require("../../blockchain-voting/build/contracts/Voting.json"); // Adjust path if needed
const User = require("../models/User");
const nodemailer = require("nodemailer");

// Configure Web3 with Ganache or Ethereum node
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545")); // Update with actual blockchain network
const contractAddress = "0xb9A6FF54469849f8979bB5ae0F52253242b52F23"; // Replace with actual deployed contract address
const contract = new web3.eth.Contract(Voting.abi, contractAddress);

const createElection = async (req, res) => {
  try {
    console.log("Election Name:", req.body.electionName);
    console.log("Received Files:", req.files);

    // Extract candidates data
    const candidates = [];
    for (let i = 0; req.body[`candidates[${i}].name`]; i++) {
      const candidate = {
        name: req.body[`candidates[${i}].name`],
        party: req.body[`candidates[${i}].party`],
      };

      // Attach uploaded files if they exist
      const candidatePhoto = req.files.find(
        (file) => file.fieldname === `candidates[${i}].candidatePhoto`
      );
      const partySymbol = req.files.find(
        (file) => file.fieldname === `candidates[${i}].partySymbol`
      );

      candidate.candidatePhoto = candidatePhoto
        ? candidatePhoto.filename
        : null; // Store filename instead of path
      candidate.partySymbol = partySymbol ? partySymbol.filename : null;

      candidates.push(candidate);
    }

    console.log("Processed Candidates:", candidates);

    // Save to MongoDB
    const newElection = new Election({
      electionName: req.body.electionName,
      candidates: candidates,
    });

    await newElection.save(); // Insert data into MongoDB
    console.log("Election saved successfully:", newElection);

    // Connect to blockchain
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0]; // Use first account from Ganache

    const candidateIds = [];

    // 🔹 Add candidates to blockchain and collect their IDs
    for (const candidate of candidates) {
      await contract.methods
        .addCandidate(
          candidate.name,
          candidate.party,
          candidate.candidatePhoto,
          candidate.partySymbol
        )
        .send({
          from: owner,
          gas: 3000000,
        });

      // Get the latest candidate ID by checking candidatesCount
      const candidateCount = await contract.methods.getCandidatesCount().call();
      candidateIds.push(parseInt(candidateCount)); // Ensure ID is a number
    }

    console.log("Candidate IDs stored in blockchain:", candidateIds);

    // 🔹 Now create election with the candidate IDs
    await contract.methods
      .createElection(req.body.electionName, candidateIds)
      .send({
        from: owner,
        gas: 3000000,
      });

    console.log("Election stored in blockchain successfully!");

    res.status(201).json({
      message: "Election created successfully!",
      election: newElection,
    });
  } catch (error) {
    console.error("Error creating election:", error);
    res
      .status(500)
      .json({ message: "Failed to create election", error: error.message });
  }
};

/**
 * 🔹 Function to allow voters to cast their vote for a candidate
 */
const voteForCandidate = async (req, res) => {
  try {
    const { voterId, candidateId } = req.body;

    // Ensure voterId and candidateId are provided
    if (!voterId || !candidateId) {
      return res
        .status(400)
        .json({ error: "Voter ID and Candidate ID are required" });
    }

    // Find the voter in MongoDB
    const voter = await User.findOne({ voterId });

    if (!voter || !voter.tempPassword) {
      return res
        .status(400)
        .json({ error: "Voter is not eligible to vote or has already voted" });
    }

    // Send transaction from the admin's address
    const adminAccount = (await web3.eth.getAccounts())[0];

    await contract.methods.vote(candidateId, voterId).send({
      from: adminAccount,
      gas: 3000000,
    });

    // Update tempPasswordExpiry to the current timestamp
    voter.tempPasswordExpiry = new Date();
    await voter.save();

    res.status(200).json({ message: "Vote cast successfully!" });
  } catch (error) {
    console.error("Error casting vote:", error);
    res.status(500).json({ error: "Voting failed. Please try again." });
  }
};

const declareResults = async (req, res) => {
  try {
    const electionId = req.params.electionId;

    // Fetch total candidates
    const totalCandidates = await contract.methods.getCandidatesCount().call();
    let candidatesData = [];

    // Fetch candidate details
    for (let i = 1; i <= totalCandidates; i++) {
      const candidate = await contract.methods.candidates(i).call();

      console.log(`Candidate ${i} Raw Data:`, candidate);

      candidatesData.push({
        id: candidate.id,
        name: candidate.name,
        party: candidate.party,
        votes: candidate.voteCount
          ? parseInt(candidate.voteCount.toString())
          : 0, // ✅ Fix NaN issue
      });

      console.log(
        `Candidate ${i} Processed - ${candidate.name}: ${
          candidatesData[i - 1].votes
        } votes`
      );
    }

    // Sort candidates by vote count (highest votes first)
    candidatesData.sort((a, b) => b.votes - a.votes);

    // Determine winner
    const winner = candidatesData[0];

    console.log("Election Winner:", winner);

    // Fetch all registered users
    const users = await User.find({}, "email"); // Get all emails
    const recipientEmails = users.map((user) => user.email);

    // Email content with election results
    const emailContent = `
            <h2>Election Results</h2>
            <h3>Winner: ${winner.name} (${winner.party}) with ${
      winner.votes
    } votes</h3>
            <br>
            <table border="1" cellspacing="0" cellpadding="5">
                <tr>
                    <th>Candidate Name</th>
                    <th>Party</th>
                    <th>Votes</th>
                </tr>
                ${candidatesData
                  .map(
                    (candidate) => `
                    <tr>
                        <td>${candidate.name}</td>
                        <td>${candidate.party}</td>
                        <td>${candidate.votes}</td>
                    </tr>
                `
                  )
                  .join("")}
            </table>
        `;

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Replace with your email
        pass: process.env.EMAIL_PASS, // Replace with your app password
      },
    });

    // Send email to all users
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmails.join(","), // Send to all users
      subject: "Election Results Declared!",
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);
    console.log("Election results emailed successfully!");

    res
      .status(200)
      .json({ message: "Results declared and emailed successfully!" });
  } catch (error) {
    console.error("Error declaring results:", error);
    res
      .status(500)
      .json({ message: "Failed to declare results", error: error.message });
  }
};

module.exports = { createElection, voteForCandidate, declareResults };
