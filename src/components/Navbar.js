import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">FileShare</Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/uploaded">Uploaded</Link></li>
        <li><Link to="/favorites">Favorites</Link></li>
        <li><Link to="/recent">Recent</Link></li>
        <li><Link to="/shared">Shared</Link></li>
        <li><Link to="/categories">Categories</Link></li>
        <li><Link to="/bin">Bin</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/logout">Logout</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
