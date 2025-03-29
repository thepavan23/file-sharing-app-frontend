import React from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li></li>
        <li><Link to="/">🏠 Home</Link></li>
        <li><Link to="/uploaded">📂 Uploaded</Link></li>
        <li><Link to="/favorites">⭐ Favorites</Link></li>
        <li><Link to="/recent">🕒 Recent</Link></li>
        <li><Link to="/shared">🔗 Shared</Link></li>
        <li><Link to="/categories">📁 Categories</Link></li>
        <li><Link to="/bin">🗑️ Bin</Link></li>
        <li><Link to="/profile">👤 Profile</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
