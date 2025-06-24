import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Auth.css";

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
      });

      alert(response.data.message); // Show success message
      navigate(`/verify-email`); // Redirect to verification page
    } catch (err) {
      setError("Signup failed. Try again.");
    }
  };

  return (
    <div className="form-box">
      
      {error && <p className="error">{error}</p>}
      <form className="form" onSubmit={handleSubmit}>
        <span class="title">Sign Up</span>
        <div className="form-container">
        <input className="input"
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <div class="form-section">
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
      </div>
    </div>
  );
};

export default Signup;
