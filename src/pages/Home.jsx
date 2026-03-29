import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; 
import "./Home.css"; 

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="home-box"
      >
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="home-title"
        >
          Welcome to <span className="highlight">Devbot AI</span>
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="home-subtext"
        >
          Your AI assistant for smart text and image conversations.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="home-buttons"
        >
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")} 
            className="home-btn secondary"
          >
            <span>Login</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/signup")} 
            className="home-btn secondary"
          >
            <span>Signup</span>
          </motion.button>
        </motion.div>
      </motion.div>
      
      {/* Decorative Background Circles for Animation */}
      <div className="circle circle-1"></div>
      <div className="circle circle-2"></div>
    </div>
  );
}