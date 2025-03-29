import React, { useEffect, useState } from "react";
import axios from "axios";
import FileCard from "../components/FileCard";
import "../styles/Shared.css";

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";


const Shared = () => {
  const [sharedFiles, setSharedFiles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedFiles = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("${API_URL}/api/files/shared", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSharedFiles(response.data.files || []); // Ensure we get an array
      } catch (err) {
        setError("Failed to load shared files");
      }
    };

    fetchSharedFiles();
  }, []);


  const handleDelete = async (file) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("${API_URL}/api/bin/move", {
        headers: { Authorization: `Bearer ${token}` },
        data: { fileId: file._id },
      });
      setSharedFiles((prevFiles) => prevFiles.filter((f) => f._id !== file._id));
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
    <div className="shared-container">
      <h2>Shared Files</h2>
      {error && <p className="error-message">{error}</p>}
      {sharedFiles.length === 0 ? (
        <p>No shared files found.</p>
      ) : (
        <div className="file-list">
          {sharedFiles.map((file) => (
            <FileCard 
            key={file._id}
             file={file} 
             onDelete={handleDelete}
             onDownload={handleDownload} 
             onShare={handleShare} 
             onFavorite={handleFavorite}
               />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shared;
