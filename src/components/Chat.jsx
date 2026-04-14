import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar"; 
import "./Style.css"; 

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // UI Messages
  const [history, setHistory] = useState([]);   // Sidebar List
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null); // Track active chat ID
  const [image, setImage] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  const fileInputRef = useRef();
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);
  const navigate = useNavigate();
  
  // 🔄 FIX: Changed from localStorage to sessionStorage to match Login & Auth flow
  const token = sessionStorage.getItem("token");

  const API_BASE = "https://dev-bot-backend.onrender.com/api";

  // 1. Auth Check
  useEffect(() => {
    if (!token) navigate("/login", { replace: true });
  }, [navigate, token]);

  // 2. Fetch History (Sidebar List)
  const fetchHistory = useCallback(async () => {
    if (!token) return;
    try {
      const resp = await fetch(`${API_BASE}/history`, { 
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await resp.json();
      
      // Data aane par ensure karein ki wo sorted ho (Pinned first)
      const sortedData = Array.isArray(data) ? data.sort((a, b) => {
         if (a.isPinned === b.isPinned) {
            return new Date(b.lastUpdated) - new Date(a.lastUpdated);
         }
         return a.isPinned ? -1 : 1;
      }) : [];

      setHistory(sortedData);
    } catch (err) {
      console.error("History Error:", err);
    }
  }, [token]);

  useEffect(() => { 
    fetchHistory(); 
  }, [fetchHistory]);

  // 3. Scroll & Resize Effects
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // 4. Handle Load Specific Chat
  const loadChat = async (id) => {
    setLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/history/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await resp.json();
      
      if (data && data.messages) {
        setConversationId(data._id);
        
        // Map DB 'content' to UI 'text'
        const formattedMessages = data.messages.map(msg => ({
          role: msg.role === "model" ? "assistant" : "user",
          text: msg.content,
          image: msg.image || null
        }));
        setMessages(formattedMessages);
      }
    } catch (err) {
      console.error("Load Chat Error:", err);
    } finally {
      setLoading(false);
      if (window.innerWidth <= 768) setIsSidebarOpen(false);
    }
  };

  // 5. Handle New Chat
  const startNewChat = () => {
    setMessages([]);
    setConversationId(null);
    setInput("");
    setImage(null);
    if (window.innerWidth <= 768) setIsSidebarOpen(false);
  };

  // 6. Send Message Logic
  const send = async () => {
    if (!input.trim() && !image) return;
    
    const userMsg = { role: "user", text: input.trim(), image: image ? URL.createObjectURL(image) : null };
    setMessages((prev) => [...prev, userMsg]);
    
    const promptText = input;
    setInput(""); 
    setImage(null); 
    setLoading(true);

    try {
      const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
      
      const payload = { 
        prompt: promptText,
        conversationId: conversationId
      };

      const resp = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
      });
      
      const data = await resp.json();

      if (data.conversationId) {
        setConversationId(data.conversationId);
        if (!conversationId) fetchHistory(); // Refresh sidebar if new chat
      }

      setMessages((prev) => [...prev, { role: "assistant", text: data.reply || "⚠️ No response" }]);

    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: "assistant", text: "❌ Server Error" }]);
    } finally {
      setLoading(false);
    }
  };

  // 7. Delete Logic
  const deleteHistoryItem = async (id, e) => {
    if(e) e.stopPropagation();
    
    try {
      const resp = await fetch(`${API_BASE}/history/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.ok) {
        setHistory((prev) => prev.filter((item) => item._id !== id));
        if (conversationId === id) startNewChat();
      }
    } catch (err) { console.error("Delete failed", err); }
  };

  // 8. Rename Logic
  const renameChat = async (id, newTitle) => {
    try {
      const resp = await fetch(`${API_BASE}/history/rename/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ newTitle })
      });
  
      if (resp.ok) {
        setHistory(prev => prev.map(chat => 
          chat._id === id ? { ...chat, title: newTitle } : chat
        ));
      }
    } catch (err) {
      console.error("Rename failed", err);
    }
  };
  
  // 9. Pin Logic
  const pinChat = async (id) => {
    try {
      const resp = await fetch(`${API_BASE}/history/pin/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (resp.ok) {
        const data = await resp.json();
        
        // 🔄 FIX: Cleaner sort logic within setHistory
        setHistory(prev => {
          const updatedList = prev.map(chat => 
            chat._id === id ? { ...chat, isPinned: data.isPinned } : chat
          );
          
          return updatedList.sort((a, b) => {
              if (a.isPinned === b.isPinned) {
                  return new Date(b.lastUpdated) - new Date(a.lastUpdated);
              }
              return a.isPinned ? -1 : 1;
          });
        });
      }
    } catch (err) {
      console.error("Pin failed", err);
    }
  };

  return (
    <div className="app-container">
      <Sidebar 
        allHistory={history} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={startNewChat}
        onSelectChat={loadChat}
        onDeleteHistory={deleteHistoryItem}
        activeId={conversationId}
        onRename={renameChat}
        onPin={pinChat}
      />

      <main className="chat-container">
        <button className="mobile-toggle" onClick={() => setIsSidebarOpen(true)}>☰</button>

        <header className="chat-header">
          <h2 className="title">Devbot AI</h2>
        </header>

        <div className="chat-box">
          {messages.length === 0 && (
            <div style={{ textAlign: "center", color: "#aaa", marginTop: "50px" }}>
              <div style={{ fontSize: "3rem" }}>🤖</div>
              <h3>How can I help you?</h3>
            </div>
          )}
          
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i} className={`message ${m.role}`}>
                <div className="bubble-wrapper">
                  {m.image && <img src={m.image} alt="upload" className="message-image" />}
                  <div className="bubble">{m.text}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="loading-container">
              <span className="dot-pulse"></span> Thinking...
            </motion.div>
          )}
          <div ref={scrollRef} />
        </div>

        <footer className="input-area">
          <AnimatePresence>
            {image && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} className="image-preview-badge">
                <img src={URL.createObjectURL(image)} alt="Preview" />
                <button onClick={() => setImage(null)}>✕</button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="input-wrapper">
            <button className="upload-btn" onClick={() => fileInputRef.current.click()}>📎</button>
            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
              placeholder="Ask anything..."
              rows={1}
            />
            
            <button className="send-btn" onClick={send} disabled={loading || (!input && !image)}>➤</button>
          </div>
        </footer>
      </main>
    </div>
  );
}
