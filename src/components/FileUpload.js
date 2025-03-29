import React, { useState } from "react";
import axios from "axios";
import "../styles/FileUpload.css";

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const FileUpload = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadMessage, setUploadMessage] = useState(null); // ✅ Added success message

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setError(null); // Clear error when new file is selected
    setUploadMessage(null); // Clear success message
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setUploading(true);
      setError(null); // Clear previous error
      setUploadMessage(null); // Clear previous success message

      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_URL}/api/files/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201 || response.status === 200) {
        setUploadMessage("File uploaded successfully! ✅");
        setSelectedFile(null);
        onUploadSuccess(); // Refresh file list
      } else {
        setError("Error uploading file. Please try again.");
      }
    } catch (err) {
      setError("Error uploading file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {uploadMessage && <p className="success-message">{uploadMessage}</p>}
    </div>
  );
};

export default FileUpload;
