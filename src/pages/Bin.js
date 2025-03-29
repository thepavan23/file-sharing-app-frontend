import React, { useEffect, useState } from "react";
import axios from "axios";
import FileCard from "../components/FileCard";
import "../styles/Bin.css";

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const Bin = () => {
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeletedFiles = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("${API_URL}/api/bin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDeletedFiles(response.data);
      } catch (err) {
        setError("Failed to load deleted files");
      }
    };

    fetchDeletedFiles();
  }, []);

  const restoreFile = async (fileId) => {
    try {
        const token = localStorage.getItem("token");
        await axios.post(
            "${API_URL}/api/bin/restore", // ✅ Correct URL
            { fileId }, // ✅ Send fileId in the request body
            { headers: { Authorization: `Bearer ${token}` } } // ✅ Correct headers
        );
        setDeletedFiles(deletedFiles.filter((file) => file._id !== fileId));
    } catch (err) {
        setError("Failed to restore file");
    }
};

  return (
    <div className="bin-container">
      <h2>Bin</h2>
      {error && <p className="error-message">{error}</p>}
      {deletedFiles.length === 0 ? (
        <p>No files in the bin.</p>
      ) : (
        <div className="file-list">
          {deletedFiles.map((file) => (
            <div key={file._id} className="file-card">
              <FileCard file={file} isBin ={true}/>
              <button onClick={() => restoreFile(file._id)} className="restore-button">Restore</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bin;
