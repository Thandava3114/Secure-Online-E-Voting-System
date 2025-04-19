// ProtectedRoute.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("token"); // Check if token exists

  if (!isAuthenticated) {
    // If not authenticated, store the attempted path and redirect to login page
    localStorage.setItem("redirectPath", location.pathname);
    return <Navigate to="/loginpage" state={{ from: location }} />;
  }

  // If authenticated, render the children
  return children;
};

export default ProtectedRoute;
