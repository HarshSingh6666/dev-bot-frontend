import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Make sure to npm install framer-motion
import "./Auth.css";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("https://dev-bot-backend.onrender.com/api/auth/signup", form);

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/chat");
      }
    } catch (err) {
      const msg = err.response?.data?.msg || "Signup failed";
      
      if (msg.toLowerCase().includes("already exists")) {
        alert("Account already exists. Sending you to Login...");
        setTimeout(() => navigate("/login"), 1000);
      } else {
        alert(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background Animated Blobs (Same as Login for continuity) */}
      <div className="blob-container">
        <div className="blob" style={{ background: "linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)" }}></div>
        <div className="blob" style={{ right: '5%', top: '10%', animationDelay: '-2s' }}></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="auth-container"
      >
        <motion.h2 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="auth-title"
        >
          Create Account
        </motion.h2>

        <div className="input-group">
          <motion.input
            whileFocus={{ x: 5 }}
            className="auth-input"
            placeholder="Full Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <motion.input
            whileFocus={{ x: 5 }}
            className="auth-input"
            placeholder="Email Address"
            type="email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <motion.input
            whileFocus={{ x: 5 }}
            className="auth-input"
            placeholder="Create Password"
            type="password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="auth-btn" 
          onClick={handleSignup}
          disabled={loading}
          style={{ background: loading ? "#4b5563" : "linear-gradient(90deg, #3b82f6, #8b5cf6)" }}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </motion.button>

        <p className="switch-text">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </motion.div>
    </div>
  );
}