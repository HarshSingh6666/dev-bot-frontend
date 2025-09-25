import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // New CSS file we'll create

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
        <h1 className="home-title">Welcome to <span className="highlight">Devbot</span></h1>
        <p className="home-subtext">Your AI assistant for smart text and image conversations.</p>

        <div className="home-buttons">
          <button onClick={() => navigate("/login")} className="home-btn">
            🔐 Login
          </button>
          <button onClick={() => navigate("/signup")} className="home-btn">
            📝 Signup
          </button>
          {/* <button onClick={goToChat} className="home-btn primary">
            💬 Go to Chat
          </button> */}
        </div>
      </div>
    </div>
  );
}
