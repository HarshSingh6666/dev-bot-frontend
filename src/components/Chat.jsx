// Chat.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./Style.css";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // Session-only messages
  const [history, setHistory] = useState([]);   // Saved history from backend
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const scrollRef = useRef(null);


  const token = localStorage.getItem("token");

  // Redirect to login if no token
  useEffect(() => {
  if (!token || token === "undefined" || token === "null") {
    navigate("/login", { replace: true });
  }
}, [navigate, token]); 

  // Fetch chat history from backend
  // Sidebar only
useEffect(() => {
  const fetchHistory = async () => {
    if (!token) return;

    try {
      const resp = await fetch("https://dev-bot-backend.onrender.com/api/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await resp.json();

      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  fetchHistory();
}, [token]);

 useEffect(() => {
  if (scrollRef.current) {
    scrollRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [messages]);

  // Send message or image
  const send = async () => {
    if (!input.trim() && !image) return;

    const userMessage = { role: "user", text: input.trim(), image };
    setMessages((m) => [...m, userMessage]);

    setInput("");
    setImage(null);
    setLoading(true);

    try {
      let reply = "⚠️ No response";

      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("prompt", input || "Describe this image");

        const resp = await fetch("https://dev-bot-backend.onrender.com/api/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const json = await resp.json();
        reply = json.reply || reply;
      } else {
        const body = { prompt: userMessage.text };

        const resp = await fetch("https://dev-bot-backend.onrender.com/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });

        const json = await resp.json();
        reply = json.reply || reply;
      }

      setMessages((m) => [...m, { role: "assistant", text: reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: " Error: " + err.message },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key to send
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // ✅ Save current chat to backend
  const saveChat = async () => {
    if (!messages.length) return;

    try {
      const resp = await fetch("https://dev-bot-backend.onrender.com/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ messages }),
      });

      const data = await resp.json();

      if (data.success) {
        alert("✅ Chat saved to history!");

        // Update sidebar history with saved messages
        setHistory((prev) => [...prev, ...messages]);

        // Clear current chat session
        setMessages([]);
      } else {
        alert(" Failed to save chat.");
      }
    } catch (err) {
      console.error("Error saving chat:", err);
      alert(" Error while saving chat.");
    }
  };

  return (
    <div className="app-container">
      <Sidebar allHistory={history} />

      <div className="chat-container">
        <div className="chat-header">
          <h2 className="title">Devbot</h2>
        </div>
<div className="chat-box">
  {messages.length === 0 && <div className="placeholder">Say hi 👋</div>}

  {messages.map((m, i) => (
    <div key={i} className={`message ${m.role}`}>
      {m.image && typeof m.image === "string" && (
        <img src={m.image} alt="upload" className="chat-image" />
      )}
      {m.image && m.image instanceof File && (
        <img
          src={URL.createObjectURL(m.image)}
          alt="upload"
          className="chat-image"
        />
      )}
      <div className="bubble">
        {m.text || m.userMessage || m.botReply}
      </div>
    </div>
  ))}

  {loading && <div className="loading">⏳ Thinking...</div>}

  {/* ✅ This ensures auto scroll to bottom */}
  <div ref={scrollRef} />
</div>

        <div className="input-area">
        {image && (
  <div className="preview">
    <p>📷 Image selected:</p>
    <img
      src={URL.createObjectURL(image)}
      alt="preview"
      className="chat-image"
    />
    <button onClick={() => setImage(null)} className="remove-btn">
       Remove
    </button>
  </div>
)}

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
          />
          <div className="actions">
            <button
              className="upload-btn"
              onClick={() => fileInputRef.current.click()}
            >
              📎
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <button className="send-btn" onClick={send} disabled={loading}>
              {loading ? "..." : "➤"}
            </button>
          </div>
        </div>
        {/* ✅ Save Chat Button */}
          <button
            className="save-chat-btn"
            onClick={saveChat}
            disabled={messages.length === 0}
          >
             Save Chat
          </button>
      </div>
    </div>
  );
}
