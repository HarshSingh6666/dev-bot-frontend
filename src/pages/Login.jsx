import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Premium animation library
import "./Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post("https://dev-bot-backend.onrender.com/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/chat");
    } catch (err) {
      alert("Invalid credentials. Redirecting...");
      setTimeout(() => navigate("/signup"), 1500);
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

        <div className="input-group">
          <motion.input
            whileFocus={{ scale: 1.02 }}
            className="auth-input"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <motion.input
            whileFocus={{ scale: 1.02 }}
            className="auth-input"
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(0, 255, 255, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          className="auth-btn" 
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Authenticating..." : "Login"}
        </motion.button>

        <p className="switch-text">
          Don't have an account? <span onClick={() => navigate("/signup")}>Create one</span>
        </p>
      </motion.div>
    </div>
  );
}