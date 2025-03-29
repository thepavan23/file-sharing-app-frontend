import React, { useEffect, useState } from "react";
import axios from "axios";
import FileCard from "../components/FileCard";
import "../styles/Recent.css";


const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";


const Recent = () => {
  const [recentFiles, setRecentFiles] = useState([]); // ✅ Default as empty array
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentFiles = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("${API_URL}/api/files/recent", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Fetched recent files:", response.data); // ✅ Debugging log

        // ✅ Ensure recentFiles is always an array
        if (response.data && Array.isArray(response.data.files)) {
          setRecentFiles(response.data.files);
        } else {
          setRecentFiles([]); // Prevents map() error
          setError("Unexpected response format.");
        }
      } catch (err) {
        setError("Failed to load recent files.");
        setRecentFiles([]); // Prevents map() error
      }
    };

    fetchRecentFiles();
  }, []);

  const handleDelete = async (file) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("${API_URL}/api/bin/move", {
        headers: { Authorization: `Bearer ${token}` },
        data: { fileId: file._id },
      });
      setRecentFiles((prevFiles) => prevFiles.filter((f) => f._id !== file._id));
      alert("File deleted successfully!");
    } catch (error) {
      console.error("Failed to delete file", error);
    }
  };





  const handleDownload = async (fileUrl, fileName) => {
    try {
      console.log("Downloading file from:", fileUrl);
  
      if (!fileUrl) {
        console.error("File URL is missing");
        return;
      }
  
      // Extract the file key from the URL
      const fileKey = fileUrl.split('.com/')[1]; // Extract key after S3 bucket domain
      const token = localStorage.getItem("token");
  
      const response = await axios.get(`${API_URL}/api/files/download/${encodeURIComponent(fileKey)}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob", // Ensure correct file format
      });
  
      // Create a blob and download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "download";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  const handleShare = async (file) => {
    try {
      const email = prompt("Enter the email of the recipient:");
      if (!email) return;
      const token = localStorage.getItem("token");
      await axios.post(
        "${API_URL}/api/files/share",
        { fileId: file._id, recipientEmail: email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("File shared successfully!");
    } catch (error) {
      console.error("Failed to share file", error);
    }
  };

  const handleFavorite = async (file) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("${API_URL}/api/files/favourite", { fileId: file._id }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("File added to favorites!");
    } catch (error) {
      console.error("Failed to favorite file", error);
    }
  };

  return (
    <div className="recent-container">
      <h2>Recent Files</h2>
      {error && <p className="error-message">{error}</p>}
      {recentFiles.length === 0 ? (
        <p>No recent files found.</p>
      ) : (
        <div className="file-list">
          {recentFiles.map((file) => (
            <FileCard
             key={file._id}
              file={file}
              onDownload={handleDownload} 
              onShare={handleShare} 
              onFavorite={handleFavorite} 
              onDelete={handleDelete}
               />
          ))}
        </div>
      )}
    </div>
  );
};

export default Recent;
