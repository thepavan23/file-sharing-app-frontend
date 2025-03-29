import React, { useEffect, useState } from "react";
import axios from "axios";
import FileCard from "../components/FileCard";
import "../styles/Uploaded.css";

const Uploaded = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUploadedFiles = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/files/user-files", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUploadedFiles(response.data);
      } catch (err) {
        setError("Failed to load uploaded files");
      }
    };

    fetchUploadedFiles();
  }, []);

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
  
      const response = await axios.get(`http://localhost:5000/api/files/download/${encodeURIComponent(fileKey)}`, {
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
        "http://localhost:5000/api/files/share",
        { fileId: file._id, recipientEmail: email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("File shared successfully!");
    } catch (error) {
      console.error("Failed to share file", error);
    }
  };

  const handleDelete = async (file) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:5000/api/bin/move", {
        headers: { Authorization: `Bearer ${token}` },
        data: { fileId: file._id },
      });
      setUploadedFiles((prevFiles) => prevFiles.filter((f) => f._id !== file._id));
    } catch (error) {
      console.error("Failed to delete file", error);
    }
  };

  const handleFavorite = async (file) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/files/favourite", { fileId: file._id }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("File added to favorites!");
    } catch (error) {
      console.error("Failed to favorite file", error);
    }
  };

  return (
    <div className="uploaded-container">
      <h2>Uploaded Files</h2>
      {error && <p className="error-message">{error}</p>}
      {uploadedFiles.length === 0 ? (
        <p>No uploaded files found.</p>
      ) : (
        <div className="file-list">
          {uploadedFiles.map((file) => (
            <FileCard 
              key={file._id} 
              file={file} 
              onDownload={handleDownload} 
              onShare={handleShare} 
              onDelete={handleDelete} 
              onFavorite={handleFavorite} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Uploaded;
