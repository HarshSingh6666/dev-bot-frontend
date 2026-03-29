import React from "react";
import { Navigate } from "react-router-dom";

// 🔐 Protected Route: Agar token nahi hai, toh login par bhej do
export const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    // replace=true se user back button dabakar wapas protected page par nahi aa payega
    return <Navigate to="/login" replace />;
  }

  return children;
};

// 🚫 Public Route: Agar token hai (already logged in), toh chat par bhej do
export const PublicRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");

  if (token) {
    return <Navigate to="/chat" replace />;
  }

  return children;
};