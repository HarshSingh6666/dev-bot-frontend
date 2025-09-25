// src/pages/Signup.jsx
import React, { useState } from "react";
import axios from "axios";
import "./Auth.css";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await axios.post("https://dev-bot-backend.onrender.com/api/auth/signup", form);

      // 🟢 If success, save token & go to chat
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/chat");
      } else {
        alert("Something went wrong during signup.");
      }

    } catch (err) {
      // 🔴 Check specific error message from backend
      const msg = err.response?.data?.msg || "Signup failed";
      
      if (msg.toLowerCase().includes("already exists")) {
        alert("User already exists. Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        alert(msg);
      }
    }
  };

  return (
    <div className="auth-container fade-in">
      <h2 className="auth-title">Signup</h2>
      <input
        className="auth-input"
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        className="auth-input"
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        className="auth-input"
        placeholder="Password"
        type="password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button className="auth-btn" onClick={handleSignup}>Signup</button>
      <p className="switch-text">
        Already have an account?{" "}
        <span onClick={() => navigate("/login")}>Login</span>
      </p>
    </div>
  );
}
