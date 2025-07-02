import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Get login function from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message
  
    try {
      console.log("Logging in...");
      const user = await login(email, password); // Now returns user details
      console.log("Login response:", user);
  
      if (user) {
        navigate("/"); // Redirect to home page
        window.location.reload(); // Ensure UI updates
      }
    } catch (err) {
      console.error("Login error:", err.message);
      setError(err.message || "Login failed");
    }
  };
  

  return (
    <div className="form-box">
      
      {error && <p className="error">{error}</p>}
      <form className="form" onSubmit={handleSubmit}>
        <span className="title">Login</span>
        <div className="form-container">
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
        <button type="submit">Login</button>
      </form>
      <div className="form-section">
      <p>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
      </div>
    </div>
  );
};

export default Login;
