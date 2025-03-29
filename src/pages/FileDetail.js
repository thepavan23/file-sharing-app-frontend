// File: /frontend/src/pages/FileDetail.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/FileDetail.css";

const FileDetail = () => {
  const { fileId } = useParams();
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFileDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/files/${fileId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFile(response.data);
      } catch (err) {
        setError("Error fetching file details");
      }
    };

    fetchFileDetails();
  }, [fileId]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!file) {
    return <div className="loading-message">Loading file details...</div>;
  }

  return (
    <div className="file-detail-container">
      <h2>File Details</h2>
      <p><strong>Name:</strong> {file.filename}</p>
      <p><strong>Type:</strong> {file.fileType}</p>
      <p><strong>Size:</strong> {file.fileSize} KB</p>
      <p><strong>Uploaded At:</strong> {new Date(file.uploadedAt).toLocaleString()}</p>
      <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" className="download-link">Download File</a>
    </div>
  );
};

export default FileDetail;