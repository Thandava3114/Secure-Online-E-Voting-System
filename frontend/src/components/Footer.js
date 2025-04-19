import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>About</h5>
            <p>Secure Online E-Voting System ensures fair and transparent elections.</p>
          </div>
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-white">Home</a></li>
              <li><a href="/about" className="text-white">About Us</a></li>
              <li><a href="/faq" className="text-white">FAQs</a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Contact</h5>
            <p>Email: support@evoting.com</p>
            <p>Phone: +91 98765432101</p>
          </div>
        </div>
        <div className="text-center mt-3">
          <p>&copy; 2024 Secure Online E-Voting System. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
