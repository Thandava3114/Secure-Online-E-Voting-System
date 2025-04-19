import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      
      <div style={{
  flex: 1, 
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  width:'80px'
}}>
  <h1 style={{
    fontSize: '3rem',
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 'bold',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    color: '#FFFFFF', // Bright white for strong contrast
    textShadow: '4px 4px 12px rgba(0, 191, 255, 0.9)', // Strong golden glow for emphasis
    background: 'linear-gradient(45deg, rgba(10, 82, 83, 0.8), rgba(2, 34, 108, 0.6))', // Soft golden gradient with transparency
    padding: '12px 35px',
    borderRadius: '10px',
    display: 'inline-block',
    boxShadow: '0 0 20px rgba(30, 139, 179, 0.8)', // Glowing effect to stand out
    marginLeft:'200px'
}}>
    ONLINE E-VOTING SYSTEM
</h1>


</div>




      {/* Login and Register aligned to the right */}
      <ul className="right-nav">
        <li className="nav-item">
          <button className="s">
            <Link className="nav-link" to="/loginpage">
              Login
            </Link>
          </button>
        </li>
        <li className="nav-item">
          <button className="u">
            <Link className="nav-link" to="/registerpage">
              Register
            </Link>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;