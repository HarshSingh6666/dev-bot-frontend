import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Style.css"; 

export default function Sidebar({ allHistory, isOpen, onClose, onNewChat, onDeleteHistory, onSelectChat, activeId, onRename, onPin }) {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState(null); 
  const [isProfileOpen, setIsProfileOpen] = useState(false); 
  
  // 👇 NEW: User Data State
  const [userData, setUserData] = useState({
    name: "User",
    email: "",
    avatar: null
  });

  const sidebarRef = useRef(null); 
  const token = localStorage.getItem("token");
  const API_BASE = "http://localhost:5000/api/auth"; // API Base URL

  // 1. 👇 NEW: Fetch User Profile on Mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) return;
      try {
        const resp = await fetch(`${API_BASE}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await resp.json();
        if (resp.ok) {
          setUserData(data); // State update karo
        }
      } catch (err) {
        console.error("Sidebar Profile Error:", err);
      }
    };

    fetchUserProfile();
  }, [token]); // Jab token mile tab run karo

  // Outside click logic
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setOpenMenuId(null);
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const handleMenuToggle = (e, id) => {
    e.stopPropagation(); 
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // ... (Rename, Pin, Delete handlers same rahenge)
  const handleRename = (e, id, currentTitle) => {
    e.stopPropagation();
    const newName = prompt("Enter new name:", currentTitle);
    if (newName && newName.trim() !== "") {
      onRename(id, newName);
      setOpenMenuId(null);
    }
  };

  const handlePin = (e, id) => {
    e.stopPropagation();
    onPin(id);
    setOpenMenuId(null);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if(window.confirm("Delete this chat?")) {
        onDeleteHistory(id, e);
    }
    setOpenMenuId(null);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && window.innerWidth <= 768 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="sidebar-overlay" onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        ref={sidebarRef}
        className={`sidebar ${isOpen ? "open" : ""}`}
        initial={false}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="sidebar-header">
          <h3 className="brand-logo">Devbot</h3>
          {window.innerWidth <= 768 && (
            <button className="close-btn" onClick={onClose}>✕</button>
          )}
        </div>

        <div style={{ padding: "0 15px", marginBottom: "20px" }}>
          <button className="new-chat-btn" onClick={onNewChat}>
            <span>+</span> New Chat
          </button>
        </div>

        <div className="sidebar-list">
          <AnimatePresence>
            {allHistory.length === 0 ? (
              <p className="empty-history">No history yet</p>
            ) : (
              allHistory.map((chat) => (
                <motion.div
                  layout
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }}
                  key={chat._id}
                  onClick={() => onSelectChat(chat._id)}
                  className={`sidebar-item ${activeId === chat._id ? "active" : ""} ${chat.isPinned ? "pinned-item" : ""}`}
                >
                  <div className="sidebar-item-content">
                    <div className="sidebar-question">
                      {chat.isPinned && <span style={{marginRight:'5px'}}>📌</span>} 
                      {chat.title || "New Chat"}
                    </div>
                    <div className="timestamp">
                      {new Date(chat.lastUpdated || chat.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="menu-container">
                    <button className="three-dot-btn" onClick={(e) => handleMenuToggle(e, chat._id)}>⋮</button>
                    {openMenuId === chat._id && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="dropdown-menu"
                      >
                        <div className="dropdown-item" onClick={(e) => handleRename(e, chat._id, chat.title)}>✏️ Rename</div>
                        <div className="dropdown-item" onClick={(e) => handlePin(e, chat._id)}>{chat.isPinned ? "🚫 Unpin" : "📌 Pin"}</div>
                        <div className="dropdown-item delete" onClick={(e) => handleDelete(e, chat._id)}>🗑️ Delete</div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* 👇 User Profile Footer (Dynamic Data) */}
        <div className="sidebar-footer">
            
            <AnimatePresence>
                {isProfileOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="profile-menu-popup"
                    >
                        <div className="menu-item" onClick={() => { navigate("/profile"); setIsProfileOpen(false); }}>
                            👤 My Profile
                        </div>
                        <div className="menu-item" onClick={() => { navigate("/settings"); setIsProfileOpen(false); }}>
                            ⚙️ Settings
                        </div>
                        <div className="menu-divider"></div>
                        <div className="menu-item logout" onClick={handleLogout}>
                            🚪 Logout
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div 
                className={`user-profile-strip ${isProfileOpen ? "active" : ""}`} 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
                {/* 👇 Dynamic Avatar Logic */}
                <div className="avatar-circle">
                    {userData.avatar ? (
                        <img 
                            src={userData.avatar} 
                            alt="User" 
                            style={{width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover'}} 
                        />
                    ) : (
                        userData.name?.charAt(0)?.toUpperCase() || "U"
                    )}
                </div>

                <div className="user-info">
                    {/* 👇 Dynamic Name */}
                    <span className="user-name">{userData.name}</span>
                    <span className="user-plan">Free Plan</span>
                </div>
                <div className="dots">...</div>
            </div>

        </div>
      </motion.aside>
    </>
  );
}