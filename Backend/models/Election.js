const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  party: { type: String, required: true },
  candidatePhoto: { type: String, required: false },
  partySymbol: { type: String, required: false },
});

const electionSchema = new mongoose.Schema({
  electionName: { type: String, required: true },
  candidates: { type: [candidateSchema], required: true },
});

const Election = mongoose.model("Election", electionSchema);
module.exports = Election;
