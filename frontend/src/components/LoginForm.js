import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For redirection
import axios from "axios";
import toast from "react-hot-toast"; // For notifications
import "../assets/css/login.css";

const LoginForm = () => {
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.identifier === "" || formData.password === "") {
      toast.error("Please enter both identifier and password.");
      return;
    }
  
    console.log("Submitting Login Request:", formData); // Debug log
  
    // Detect whether it's an email or a voter ID
    const isEmail = formData.identifier.includes("@");
    const requestBody = isEmail
      ? { email: formData.identifier, password: formData.password }
      : { username: formData.identifier, password: formData.password };
  
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        requestBody
      );
  
      console.log("Login Response:", response.data); // Debug log
  
      // ✅ Store voterId along with the token
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("voterId", response.data.voterId); // 🔹 Save voterId
  
      toast.success("Login successful!");
  
      // Redirect to appropriate page
      setTimeout(() => {
        navigate(response.data.redirect);
      }, 1000);
    } catch (error) {
      console.error("Login Error:", error.response || error.message);
      toast.error(error.response?.data?.message || "Invalid login credentials");
    }
  };
  
  
  

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>LOGIN</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label htmlFor="identifier">Email or Voter ID:</label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              required
              autoComplete="username" 
            />
          </div>
          <div className="input-container">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password" 
            />
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
        <br />
        <p className="forgot-password">
          <a href="/" style={{ margin: "30px" }}>Home</a> 
          <a href="/forgot-password">Forgot Password?</a> 
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
