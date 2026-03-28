import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Components & Pages Imports
import Chat from "./components/Chat"; // Ensure path is correct
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";   // 👈 New Import
import Settings from "./pages/Settings"; // 👈 New Import

// Destructuring imports
import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* 🔐 PROTECTED ROUTES (Logged-in users only) */}
        
        {/* Chat Page */}
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } 
        />

        {/* Profile Page (New) */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />

        {/* Settings Page (New) */}
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />

        {/* 🚫 PUBLIC ROUTES (Logged-out users only) */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } 
        />

        {/* Catch all - Redirect to Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
