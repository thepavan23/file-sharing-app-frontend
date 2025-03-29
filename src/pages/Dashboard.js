// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import FileList from "../components/FileList";


const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";


const Dashboard = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/files`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFiles(response.data.files);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div className="dashboard">
      <h2>My Files</h2>
      <FileList files={files} />
    </div>
  );
};

export default Dashboard;
