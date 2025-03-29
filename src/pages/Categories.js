import React, { useEffect, useState } from "react";
import axios from "axios";
import FileCard from "../components/FileCard";
import "../styles/Categories.css";


const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";


const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized: No token found.");
          return;
        }

        const response = await axios.get("${API_URL}/api/files/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Categories API Response:", response.data);
        setCategories(Array.isArray(response.data) ? ["All", ...response.data] : ["All"]);
      } catch (err) {
        console.error("Error fetching categories:", err.response?.data || err.message);
        setError("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchFilesByCategory = async () => {
      try {
        const token = localStorage.getItem("token");
        let url = "${API_URL}/api/files/user-files";

        if (selectedCategory !== "All") {
          const categoryMapping = {
            PDF: "application/pdf",
            Images: "image/jpeg",
            Videos: "video/mp4",
            "Text Files": "text/plain",
          };

          const categoryKey = categoryMapping[selectedCategory] || selectedCategory;
          url = `${API_URL}/api/files/category/${encodeURIComponent(categoryKey)}`;
        }

        console.log("Fetching files from:", url);

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Files API Response:", response.data);
        setFiles(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error fetching files:", err.response?.data || err.message);
        setError("Failed to load files");
      }
    };

    fetchFilesByCategory();
  }, [selectedCategory]);

  const handleDelete = async (file) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("${API_URL}/api/bin/move", {
        headers: { Authorization: `Bearer ${token}` },
        data: { fileId: file._id },
      });
      setFiles((prevFiles) => prevFiles.filter((f) => f._id !== file._id));
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
    <div className="categories-container">
      <h2>Categories</h2>

      <select onChange={(e) => setSelectedCategory(e.target.value)} className="category-select">
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <div className="file-list">
        {error && <p className="error-message">{error}</p>}
        {files.length === 0 ? (
          <p>No files found.</p>
        ) : (
          files.map((file) =>
            file._id ? 
            <FileCard 
            key={file._id} 
            file={file} 
            onDelete={handleDelete}
            onDownload={handleDownload} 
              onShare={handleShare} 
              onFavorite={handleFavorite}
               /> : null
          )
        )}
      </div>
    </div>
  );
};

export default Categories;
