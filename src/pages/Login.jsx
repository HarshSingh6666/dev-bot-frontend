// src/pages/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import "./Auth.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("https://dev-bot-backend.onrender.com/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/chat");
    } catch (err) {
      alert("User not found or wrong credentials. Redirecting to signup...");
      setTimeout(() => {
        navigate("/signup");
      }, 1500);
    }
  };

 
  return (
    <div className="auth-container fade-in">
      <h2 className="auth-title">Login</h2>
      <input
        className="auth-input"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="auth-input"
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="auth-btn" onClick={handleLogin}>Login</button>
      <p className="switch-text">
        Don't have an account? <span onClick={() => navigate("/signup")}>Signup</span>
      </p>
    </div>
  );
}
