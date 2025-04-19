const mongoose = require("mongoose");

const FingerprintSchema = new mongoose.Schema({
  credentialID: {
    type: Buffer, // Binary credential ID
    required: true,
  },
  publicKey: {
    type: String, // PEM format public key
    required: true,
  },
  counter: {
    type: Number, // Authenticator counter
    required: true,
  },
});

const DetailsSchema = new mongoose.Schema({
  voterId: {
    type: String,
    unique: true,
    required: true,
  },
  aadhaarNumber: {
    type: String,
    required: true,
    unique: true,
    minlength: 12,
    maxlength: 12,
  },
  fullName: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    default: "Andhra Pradesh",
    required: true,
  },
  country: {
    type: String,
    default: "India",
    required: true,
  },
  fingerprint: {
    type: FingerprintSchema,
    required: false, // Required only if fingerprint is enrolled
  },
});

const Details = mongoose.model("Details", DetailsSchema);
module.exports = Details;
