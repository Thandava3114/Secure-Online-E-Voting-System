import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/home.css";

const Home = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("voterId");
    navigate("/loginpage");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      const voterId = localStorage.getItem("voterId");

      if (!token || !voterId) {
        alert("Session expired. Please log in again.");
        navigate("/loginpage");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/details/${voterId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setUserData(data);
        } else {
          alert(data.message || "Failed to fetch user details.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Something went wrong. Please try again later.");
      }

      setLoading(false);
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="welcome-text">Welcome, User</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="dashboard-section">
        {/* <h2>User Dashboard</h2> */}
        {loading ? (
          <p>Loading user details...</p>
        ) : userData ? (
          <table className="user-details-table">
            <tbody>
              <tr>
                <th>Full Name</th>
                <td>{userData.fullName}</td>
              </tr>
              <tr>
                <th>Voter ID</th>
                <td>{userData.voterId}</td>
              </tr>
              <tr>
                <th>Aadhaar Number</th>
                <td>
                  {userData.aadhaarNumber
                    ? `XXXX XXXX ${userData.aadhaarNumber.slice(-4)}`
                    : ""}
                </td>
              </tr>
              <tr>
                <th>Date of Birth</th>
                <td>
                  {userData.dob
                    ? new Date(userData.dob).toISOString().split("T")[0]
                    : ""}
                </td>
              </tr>
              <tr>
                <th>Gender</th>
                <td>{userData.gender}</td>
              </tr>
              <tr>
                <th>Address</th>
                <td>{userData.address}</td>
              </tr>
              <tr>
                <th>Pincode</th>
                <td>{userData.pincode}</td>
              </tr>
              <tr>
                <th>State</th>
                <td>{userData.state}</td>
              </tr>
              <tr>
                <th>Country</th>
                <td>{userData.country}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>No user data found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
