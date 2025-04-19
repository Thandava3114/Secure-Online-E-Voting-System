const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;

  // Check for Authorization header with Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]; // Extract token
  }

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user data to request

    // Check if the user is admin or regular user
    if (req.user.role === "admin") {
      req.isAdmin = true; // Attach admin flag to request
    } else {
      req.isAdmin = false;
    }
    
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = protect;
