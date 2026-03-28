import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; 

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const goToChat = () => {
    if (token) {
      navigate("/chat");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="home-container">
      <div className="home-box">
        <h1 className="home-title">
          Welcome to <span className="highlight">Devbot AI</span>
        </h1>
        <p className="home-subtext">
          Your AI assistant for smart text and image conversations.
        </p>

        <div className="home-buttons">
          <button onClick={() => navigate("/login")} className="home-btn secondary">
            <span> Login</span>
          </button>
          
          <button onClick={() => navigate("/signup")} className="home-btn secondary">
            <span>Signup</span>
          </button>
          
          <button onClick={goToChat} className="home-btn primary premium-glow">
            <span> Go to Chat</span>
            <div className="shine-effect"></div>
          </button>
        </div>
      </div>
      
      {/* Decorative Background Circles for Animation */}
      <div className="circle circle-1"></div>
      <div className="circle circle-2"></div>
    </div>
  );
}
