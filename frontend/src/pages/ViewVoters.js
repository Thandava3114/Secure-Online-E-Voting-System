import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/css/view-voters.css";
import {useNavigate} from "react-router-dom";

const ViewVoters = () => {
  const [voters, setVoters] = useState([]);
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from storage
        if (!token) {
          console.error("❌ No token found");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/voters/getAll",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send token in request
            },
          }
        );

        setVoters(response.data);
      } catch (error) {
        console.error(
          "❌ Error fetching voters:",
          error.response ? error.response.data : error.message
        );
      }
    };
    fetchVoters();
  }, []);

  // Function to send emails with temporary login credentials
  const sendEmails = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from storage
      if (!token) {
        console.error("❌ No token found. User might not be logged in.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/voters/send-mails",
        {}, // Pass an empty object or required data
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token
            "Content-Type": "application/json",
          },
        }
      );
      alert("Emails sent successfully!");
      console.log("✅ Emails sent successfully:", response.data);
      navigate("/admin-home");
    } catch (error) {
      alert("❌ Error sending emails. Please try again.");
      console.error("❌ Error sending emails:", error.response ? error.response.data : error.message );
    }
  };

  return (
    <div className="voter-container">
      <div className="view-voters-container">
      <h2>Registered Voters</h2>
      <button
        className="send-mails-btn"
        onClick={sendEmails}
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Mails"}
      </button>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {voters.map((voter, index) => (
            <tr key={index}>
              <td>{voter.username}</td>
              <td>{voter.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default ViewVoters;
