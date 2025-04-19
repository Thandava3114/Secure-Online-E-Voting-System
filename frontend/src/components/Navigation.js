import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/Navbar.css";

const Navigation = () => {
  const navigate = useNavigate(); // Hook for navigation

  const LogoutButton = () => {
    // Clear the localStorage data (token and user)
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect the user to the login page
    navigate("/loginpage");
  };

  return (
    <nav className="navbar">
      <ul className="mx-1">
        <li className="nav-item">
          <button className="t">
            <Link className="nav-link active" aria-current="page" to="/">
              <span className="a">Home</span>
            </Link>
          </button>
        </li>
        <li className="nav-item mx-1">
          <button className="s">
            <span onClick={LogoutButton} className="nav-link">
              Logout
            </span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
