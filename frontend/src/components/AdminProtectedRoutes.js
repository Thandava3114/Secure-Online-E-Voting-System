// AdminProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");
  const token = isAuthenticated ? JSON.parse(atob(localStorage.getItem("token").split('.')[1])) : null;
  
  if (!isAuthenticated || token.role !== "admin") {
    return <Navigate to="/home" />;
  }

  return children;
};

export default AdminProtectedRoute;
