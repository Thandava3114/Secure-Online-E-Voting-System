import React, { useState } from "react";
import axios from "axios";
import "../assets/css/details.css";
import pic8 from "../assets/images/pic8.png";
import { useNavigate } from "react-router-dom";

const PersonalDetailsForm = () => {
  const [fingerprintCaptured, setFingerprintCaptured] = useState(false);
  const [error, setError] = useState("");
  const id = localStorage.getItem("voterId");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    voterId: id || "",
    aadhaar: "",
    fullName: "",
    dob: "",
    gender: "",
    address: "",
    pincode: "",
    state: "AP",
    country: "India",
    fingerprint: "",
    publicKey: "", // Store public key for backend
  });

  const captureFingerprint = async () => {
    try {
      const publicKeyCredentialCreationOptions = {
        challenge: new Uint8Array(32), // Random challenge
        rp: { name: "Secure E-Voting System" },
        user: {
          id: new Uint8Array(16), // Random user ID
          name: formData.fullName || "Anonymous",
          displayName: formData.fullName || "Anonymous",
        },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          requireResidentKey: false,
          userVerification: "preferred",
        },
        timeout: 60000,
        attestation: "direct",
      };

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      });

      if (credential) {
        const attestationObject = new Uint8Array(
          credential.response.attestationObject
        );
        const clientDataJSON = new Uint8Array(
          credential.response.clientDataJSON
        );
        const publicKeyBase64 = btoa(String.fromCharCode(...attestationObject));

        setFingerprintCaptured(true);
        setFormData({
          ...formData,
          fingerprint: JSON.stringify({
            attestationObject: Array.from(attestationObject),
            clientDataJSON: Array.from(clientDataJSON),
          }),
          publicKey: publicKeyBase64,
        });

        alert("Fingerprint registered successfully!");
      }
    } catch (error) {
      console.error("Error capturing fingerprint:", error);
      alert(
        "Fingerprint authentication failed. Ensure your device has fingerprint support."
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "aadhaar" && (!/^\d*$/.test(value) || value.length > 12)) {
      setError("Aadhaar number must be 12 digits.");
      return;
    }
    if (name === "pincode" && (!/^\d*$/.test(value) || value.length > 6)) {
      setError("Pin Code must be exactly 6 digits.");
      return;
    }
    setError("");
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fingerprintCaptured) {
      alert("Please authenticate using fingerprint before submitting.");
      return;
    }

    if (
      !formData.voterId ||
      !formData.aadhaar ||
      !formData.fullName ||
      !formData.fingerprint
    ) {
      alert("All fields including fingerprint authentication are required!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/details/storeDetails",
        {
          voterId: formData.voterId,
          aadhaarNumber: formData.aadhaar,
          fullName: formData.fullName,
          dob: formData.dob,
          gender: formData.gender,
          address: formData.address,
          pincode: formData.pincode,
          fingerprintScan: formData.fingerprint, // Store fingerprint data
          publicKey: formData.publicKey, // Send public key
        }
      );

      if (response.status === 201) {
        alert("Details saved successfully!");
        navigate("/loginpage");
      }
    } catch (error) {
      console.error("Error saving details:", error);
      alert(error.response?.data?.message || "Failed to save details.");
    }
  };

  return (
    <div className="personal-page">
      <div className="personal-details-container">
        <h2>Personal Details Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label>Voter ID:</label>
            <input
              type="text"
              name="voterId"
              value={id || "No ID found"}
              readOnly
            />
          </div>
          <div className="input-container">
            <label>Full Name:</label>
            <input
              type="text"
              name="fullName"
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <label>Date of Birth:</label>
            <input type="date" name="dob" onChange={handleChange} required />
          </div>
          <div className="input-container">
            <label>Gender:</label>
            <select name="gender" onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="input-container">
            <label>Aadhaar Number:</label>
            <input
              type="text"
              name="aadhaar"
              maxLength="12"
              onChange={handleChange}
              required
            />
            {error && <p className="error-message">{error}</p>}
          </div>
          <div className="input-container">
            <label>Address:</label>
            <input
              type="text"
              name="address"
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <label>Pin Code:</label>
            <input
              type="text"
              name="pincode"
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <label>State:</label>
            <input type="text" name="state" value="Andhra Pradesh" readOnly />
          </div>
          <div className="input-container">
            <label>Country:</label>
            <input type="text" name="country" value="India" readOnly />
          </div>
          <div className="biometric-section">
            <div className="biometric-item">
              <img
                src={pic8}
                alt="FingerPrint-Scan"
                className="biometric-image"
              />
              <button
                type="button"
                onClick={captureFingerprint}
                disabled={fingerprintCaptured}
              >
                {fingerprintCaptured
                  ? "Fingerprint Captured"
                  : "Authenticate Fingerprint"}
              </button>
            </div>
          </div>
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default PersonalDetailsForm;
