import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get("http://localhost:5000/api/auth/user", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        } catch (error) {
          console.error("Failed to fetch user:", error);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      console.log("Sending login request...");
      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      console.log("Login successful, response:", response.data);
  
      localStorage.setItem("token", response.data.token);
  
      // Fetch user profile after login
      const userResponse = await axios.get("http://localhost:5000/api/auth/user", {
        headers: { Authorization: `Bearer ${response.data.token}` },
      });
  
      setUser(userResponse.data); // Set the logged-in user
      console.log("User data set:", userResponse.data);
  
      return userResponse.data; // Return user details
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", { name, email, password });
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Signup failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
