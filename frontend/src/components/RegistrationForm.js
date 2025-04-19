import React, { useState } from "react";
import axios from "axios";
import "../assets/css/register.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords does not match!");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }
      );

      toast.success(response.data.message);
      navigate("/details");
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <div className="register-page">
      <div className="registration-container">
        <h2 style={{ color: "black", fontWeight: "bold" }}> Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label>Username/Name:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <label>Email/Phone Number:</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {error && <p className="error-message">{error}</p>}
          </div>
          <button type="submit" className="submit-btn">
            Register
          </button>
        </form>
        <a href="/" style={{ margin: "30px" }}>
          Home
        </a>
        <a href="/loginpage">Have an account?</a>
      </div>
    </div>
  );
};

export default RegistrationPage;
