import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import "../assets/css/login.css";

const ResetPassword = () => {
  const { token } = useParams(); // Get reset token from URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Debugging: Log the token from URL
  console.log("Reset Token from URL:", token);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true); // Disable button while processing

    try {
      const response = await axios.post(
        "http://localhost:5000/api/password/reset-password",
        { token, password },
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success(response.data.message || "Password reset successful!");
      
      // Redirect to login page after successful reset
      setTimeout(() => navigate("/loginpage"), 2000);
    } catch (error) {
      console.error("Reset Password Error:", error.response || error.message);
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label htmlFor="password">New Password:</label> {/* ✅ Fixed `for` to `htmlFor` */}
            <input
              type="password"
              id="password" // ✅ Added `id` for accessibility
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>
          <div className="input-container">
            <label htmlFor="confirmPassword">Confirm Password:</label> {/* ✅ Fixed label association */}
            <input
              type="password"
              id="confirmPassword" // ✅ Added `id` for accessibility
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
