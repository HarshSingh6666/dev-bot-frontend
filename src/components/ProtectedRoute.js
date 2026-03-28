import React from "react";
import { Navigate } from "react-router-dom";

// 1. Sirf logged-in users ke liye (Chat page)
export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// 2. Sirf guests ke liye (Login/Signup page - Redirect if already logged in)
export const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/chat" replace />;
  }
  return children;
};