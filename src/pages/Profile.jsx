import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Home.css"; // Style file ka naam check kar lein

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");
  const API_BASE = "http://localhost:5000/api/auth";

  const [user, setUser] = useState({ name: "", email: "", avatar: "" });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [tempName, setTempName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); 
  const [previewImage, setPreviewImage] = useState(null); 

  // 1. Fetch Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const resp = await fetch(`${API_BASE}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await resp.json();
        
        console.log("🔍 Initial Data:", data); // Debugging

        if (resp.ok) {
          setUser(data);
          setTempName(data.name);
        }
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    if (token) fetchProfile();
  }, [token]);

  // 2. Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); 
      setPreviewImage(URL.createObjectURL(file)); 
    }
  };

  // 3. Save Changes (MAIN FIX HERE)
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", tempName);
      if (selectedFile) {
        formData.append("avatar", selectedFile); 
      }

      // User ko batao ki upload chal raha hai
      const saveBtn = document.querySelector(".save-btn");
      if(saveBtn) saveBtn.innerText = "Saving...";

      const resp = await fetch(`${API_BASE}/profile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }, 
        body: formData 
      });

      const data = await resp.json();
      console.log("✅ Server Response:", data); // Console me check karein

      if (data.success) {
        // 👇 STATE UPDATE LOGIC FIXED
        // Hum timestamp add kar rahe hain taaki image force-refresh ho
        const newAvatarUrl = data.user.avatar 
          ? `${data.user.avatar}?t=${new Date().getTime()}` 
          : "";

        setUser(prev => ({
            ...prev,
            name: data.user.name,
            avatar: newAvatarUrl // Naya URL set kiya
        }));
        
        setIsEditing(false);
        setPreviewImage(null); 
        setSelectedFile(null); 
        alert("Profile Updated Successfully! ✅");
      } else {
        alert("Update failed: " + (data.msg || "Error"));
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Something went wrong");
    } finally {
        const saveBtn = document.querySelector(".save-btn");
        if(saveBtn) saveBtn.innerText = "Save Changes";
    }
  };

  if (loading) return <div style={{color:'white', textAlign:'center', marginTop:'50px'}}>Loading...</div>;

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="profile-card">
        <button className="back-btn" onClick={() => navigate("/chat")}>← Back to Chat</button>
        <h2 className="page-title">My Profile</h2>

        <div className="profile-header">
          <div className="avatar-wrapper" onClick={() => isEditing && fileInputRef.current.click()}>
            
            {/* --- IMAGE RENDERING LOGIC --- */}
            {previewImage ? (
              // 1. Agar abhi select kiya hai (Preview)
              <img src={previewImage} alt="Preview" className="profile-img" />
            ) : (user.avatar && user.avatar !== "") ? (
              // 2. Agar Database se image aayi hai
              <img 
                src={user.avatar} 
                alt="Profile" 
                className="profile-img"
                onError={(e) => {
                    e.target.onerror = null; 
                    e.target.style.display = 'none'; // Agar link toota hai to chupao
                }}
              />
            ) : (
              // 3. Agar koi image nahi hai to Initials
              <div className="profile-placeholder">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            
            {isEditing && <div className="camera-icon">📷</div>}
          </div>
          <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} />
        </div>

        <div className="profile-details">
          <div className="input-group">
            <label>Full Name</label>
            {isEditing ? (
              <input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} className="edit-input" />
            ) : (
              <p className="info-text">{user.name}</p>
            )}
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <p className="info-text email-text">{user.email}</p>
          </div>
        </div>

        <div className="action-buttons">
          {isEditing ? (
            <>
              <button className="btn save-btn" onClick={handleSave}>Save Changes</button>
              <button className="btn cancel-btn" onClick={() => { setIsEditing(false); setPreviewImage(null); }}>Cancel</button>
            </>
          ) : (
            <button className="btn edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
        </div>
      </motion.div>
    </div>
  );
}