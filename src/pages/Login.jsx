import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; 
import "./Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Error dikhane ke liye state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Page refresh hone se rokne ke liye
    setLoading(true);
    setErrorMessage(""); // Naya try karne par purana error hata do

    try {
      const res = await axios.post("https://dev-bot-backend.onrender.com/api/auth/login", {
        email,
        password,
      });
      
      // Home.jsx aur ProtectedRoute ke hisaab se sessionStorage use karein
      sessionStorage.setItem("token", res.data.token);
      navigate("/chat");
    } catch (err) {
      // Agar backend se koi specific error message aata hai, toh wo dikhayein
      const errorMsg = err.response?.data?.message || "Invalid credentials. Please try again.";
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background Animated Blobs */}
      <div className="blob-container">
        <div className="blob"></div>
        <div className="blob"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="auth-container"
      >
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="auth-title"
        >
          Welcome Back
        </motion.h2>

        {/* Agar error hai toh yahan show karein */}
        {errorMessage && (
          <p style={{ color: "#ff4d4d", fontSize: "14px", marginTop: "10px" }}>
            {errorMessage}
          </p>
        )}

        {/* Form add kiya taaki Enter press karne par login ho sake */}
        <form onSubmit={handleLogin} className="input-group" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            className="auth-input"
            placeholder="Email"
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <motion.input
            whileFocus={{ scale: 1.02 }}
            className="auth-input"
            placeholder="Password"
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <motion.button 
            type="submit" // button type submit kar diya
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(0, 255, 255, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="auth-btn" 
            disabled={loading}
            style={{ marginTop: "15px" }}
          >
            {loading ? "Authenticating..." : "Login"}
          </motion.button>
        </form>

        <p className="switch-text">
          Don't have an account? <span onClick={() => navigate("/signup")} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Create one</span>
        </p>
      </motion.div>
    </div>
  );
}