import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Style.css";

export default function Sidebar({ allHistory }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // Sidebar toggle state

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  // ✅ Group conversation entries
  const groupedConversations = [];
  for (let i = 0; i < allHistory.length; i++) {
    const entry = allHistory[i];
    if (entry.userMessage) {
      groupedConversations.push({
        question: entry.userMessage,
        answer: entry.botReply || "",
        image: entry.image,
        createdAt: entry.createdAt,
      });
    }
  }

  return (
    <>
      {/* ☰ Toggle Button for Mobile */}
      <button
        className="sidebar-toggle"
        onClick={() => setIsOpen(true)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* Close Button (for mobile) */}
        <button
          className="close-btn"
          onClick={() => setIsOpen(false)}
        >
          ✖
        </button>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            🚪 Logout
          </button>
        </div>

        <h3 className="sidebar-title">📜 History</h3>

        <div className="sidebar-list">
          {groupedConversations.length === 0 ? (
            <p className="no-history">No chats yet</p>
          ) : (
            groupedConversations.map((conv, index) => (
              <div key={index} className="sidebar-item">
                {conv.image && <span className="image-icon">📎 Image Chat</span>}

                <div className="sidebar-question">
                  <strong>Q:</strong>{" "}
                  {conv.question.length > 30
                    ? conv.question.slice(0, 30) + "..."
                    : conv.question}
                </div>

                <div className="sidebar-answer">
                  <strong>A:</strong>{" "}
                  {conv.answer.length > 40
                    ? conv.answer.slice(0, 40) + "..."
                    : conv.answer}
                </div>

                <div className="timestamp">
                  {new Date(conv.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
