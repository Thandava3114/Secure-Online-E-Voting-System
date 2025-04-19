import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/css/admin-home.css";

const AdminHomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("voterId");
    navigate("/loginpage");
  };

  const declareResults = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/elections/declare-results",
        {
          electionId: "67f4bd5a8ae51a889c877e5c", // Replace with actual election ID
        }
      );

      alert(response.data.message);
    } catch (error) {
      console.error("Error declaring results:", error);
      alert("Failed to declare results. Please try again.");
    }
  };

  return (
    <div className="home-container">
      <div className="greeting">Welcome, Admin!</div>
      <div className="button-container">
        <button
          className="home-button"
          onClick={() => navigate("/create-election")}
        >
          Create Election
        </button>
        <button
          className="home-button"
          onClick={() => navigate("/view-voters")}
        >
          View Voters
        </button>
        <button className="home-button" onClick={declareResults}>
          Declare Results
        </button>
        <button className="home-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminHomePage;
