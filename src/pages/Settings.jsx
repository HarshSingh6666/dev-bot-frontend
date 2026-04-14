import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Home.css"; 

export default function Settings() {
  const navigate = useNavigate();
  
  // Storage check
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const API_BASE = "https://dev-bot-backend.onrender.com/api";

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(false);

  // 1. Auth Check on Mount
  useEffect(() => {
    if (!token) navigate("/login", { replace: true });
  }, [navigate, token]);

  // Global 401 (Unauthorized) Handler
  const handleAuthCheck = (response) => {
    if (response.status === 401) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token"); 
      navigate("/login", { replace: true }); 
      return true; 
    }
    return false; 
  };

  // Dark Mode Effect
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // 1. Clear History Function
  const handleClearHistory = async () => {
    if(!window.confirm("Are you sure? This will delete all your chats permanently.")) return;

    setLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/history/clear`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (handleAuthCheck(resp)) return;

      if (resp.ok) {
        alert("History Cleared! 🗑️");
      } else {
        alert("Failed to clear history.");
      }
    } catch (err) {
      console.error(err);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  // 2. Delete Account Function
  const handleDeleteAccount = async () => {
    const confirmDelete = window.prompt("Type 'DELETE' to confirm account deletion. This cannot be undone.");
    
    if (confirmDelete !== "DELETE") return;

    console.log("Current Token being sent to backend:", token);

    setLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/auth/delete`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (handleAuthCheck(resp)) return;

      if (resp.ok) {
        // 🚀 THE FIX: Turant storage saaf karo aur bina Alert ke seedha Login pe bhejo!
        localStorage.removeItem("token"); 
        sessionStorage.removeItem("token"); 
        localStorage.removeItem("theme"); 
        
        // Bina page refresh kiye instant redirect
        navigate("/login", { replace: true });  
      } else {
        alert("Failed to delete account.");
      }
    } catch (err) {
      console.error(err);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="settings-card"
      >
        <button className="back-btn" onClick={() => navigate("/chat")}>← Back to Chat</button>
        <h2 className="page-title">Settings</h2>

        <div className="setting-section">
          <h3>Preferences</h3>
          
          <div className="setting-item">
            <div className="setting-info">
              <span>Dark Mode</span>
              <p>Switch between light and dark themes</p>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={darkMode} 
                onChange={() => setDarkMode(!darkMode)} 
              />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <span>Notifications</span>
              <p>Receive updates about new features</p>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={notifications} 
                onChange={() => setNotifications(!notifications)} 
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        <div className="setting-section danger-zone">
          <h3>Data & Privacy</h3>
          
          <button className="btn danger-btn" onClick={handleClearHistory} disabled={loading}>
            {loading ? "Processing..." : "🗑️ Clear All Chat History"}
          </button>
          
          <button className="btn danger-btn" onClick={handleDeleteAccount} disabled={loading} style={{marginTop: '10px'}}>
            {loading ? "Processing..." : "❌ Delete Account"}
          </button>
        </div>

      </motion.div>
    </div>
  );
}
