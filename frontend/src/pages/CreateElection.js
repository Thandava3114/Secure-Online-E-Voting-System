import React, { useState } from "react";
import "../assets/css/create-election.css";
import {useNavigate} from "react-router-dom";

const CreateElection = () => {
  const [electionName, setElectionName] = useState("");
  const [candidates, setCandidates] = useState([]);
  const navigate = useNavigate();

  // Add a new candidate
  const handleAddCandidate = () => {
    setCandidates([
      ...candidates,
      { name: "", party: "", candidatePhoto: null, partySymbol: null },
    ]);
  };

  // Handle input changes for candidate details
  const handleCandidateChange = (index, field, value) => {
    const updatedCandidates = [...candidates];
    updatedCandidates[index][field] = value;
    setCandidates(updatedCandidates);
  };

  // Handle file uploads for candidate photo and party symbol
  // Handle file uploads for candidate photo and party symbol
  const handleFileUpload = (index, field, file) => {
    const updatedCandidates = [...candidates];
    updatedCandidates[index][field] = file;
    setCandidates(updatedCandidates);
  };

  // Handle election creation
  // CreateElection.js (Frontend)
  // CreateElection.js (Frontend)
  // CreateElection.js (Frontend)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Add election name
    formData.append("electionName", electionName);

    // Add candidate data and files
    candidates.forEach((candidate, index) => {
      formData.append(`candidates[${index}].name`, candidate.name);
      formData.append(`candidates[${index}].party`, candidate.party);

      if (candidate.candidatePhoto) {
        formData.append(
          `candidates[${index}].candidatePhoto`,
          candidate.candidatePhoto
        );
      }
      if (candidate.partySymbol) {
        formData.append(
          `candidates[${index}].partySymbol`,
          candidate.partySymbol
        );
      }
    });

    try {
      const response = await fetch("http://localhost:5000/api/elections", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Election Created Successfully!");
        navigate("/admin-home");
      } else {
        throw new Error("Failed to create election");
      }
    } catch (error) {
      console.error("Error creating election:", error);
      alert("Failed to create election");
    }
  };

  return (
    <div className="main-container">
      <div className="create-election-container">
        <h2>Create Election</h2>
        <input
          type="text"
          placeholder="Enter Election Name"
          value={electionName}
          onChange={(e) => setElectionName(e.target.value)}
          className="input-field"
        />

        <h3>Register Candidates</h3>
        {candidates.map((candidate, index) => (
          <div key={index} className="candidate-card">
            <input
              type="text"
              placeholder="Candidate Name"
              value={candidate.name}
              onChange={(e) =>
                handleCandidateChange(index, "name", e.target.value)
              }
              className="input-field"
            />
            <input
              type="text"
              placeholder="Party Name"
              value={candidate.party}
              onChange={(e) =>
                handleCandidateChange(index, "party", e.target.value)
              }
              className="input-field"
            />

            <div className="file-upload">
              <label
                htmlFor={`candidatePhoto-${index}`}
                className="custom-file-label"
              >
                Choose Candidate Photo
              </label>
              <input
                id={`candidatePhoto-${index}`}
                type="file"
                accept="image/*"
                className="file-input"
                onChange={(e) =>
                  handleFileUpload(index, "candidatePhoto", e.target.files[0])
                }
              />
            </div>

            <div className="file-upload">
              <label
                htmlFor={`partySymbol-${index}`}
                className="custom-file-label"
              >
                Choose Party Symbol
              </label>
              <input
                id={`partySymbol-${index}`}
                type="file"
                accept="image/*"
                className="file-input"
                onChange={(e) =>
                  handleFileUpload(index, "partySymbol", e.target.files[0])
                }
              />
            </div>
          </div>
        ))}

        <button className="add-btn" onClick={handleAddCandidate}>
          + Add Candidate
        </button>
        <button className="submit-btn" onClick={handleSubmit}>
          Create Election
        </button>
      </div>
    </div>
  );
};

export default CreateElection;
