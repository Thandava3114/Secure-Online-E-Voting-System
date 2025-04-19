import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../assets/css/login.css"; // You can reuse the login styles

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email === "") {
      toast.error("Please enter your email.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/password/forgot-password",
        { email }
      );

      console.log("API Response:", response.data); // Debugging step

      if (response.data.resetToken) {
        toast.success("Reset link sent to your email.");
        navigate("/loginpage");
      } else {
        toast.error("Failed to get reset token. Please try again.");
      }
    } catch (error) {
      console.error("Forgot Password Error:", error.response || error.message);
      toast.error(error.response?.data?.message || "Something went wrong. Try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label htmlFor="email">Enter your email:</label> {/* ✅ Fixed `for` to `htmlFor` */}
            <input
              type="email"
              id="email" // ✅ Added `id` for accessibility
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
