import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const API_BASE_URL = "${API_URL}/api";

const apiService = {
  getFiles: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/files`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch files");
    }
  },

  uploadFile: async (fileData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_BASE_URL}/files/upload`, fileData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw new Error("File upload failed");
    }
  },

  deleteFile: async (fileId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      throw new Error("Failed to delete file");
    }
  },

  shareFile: async (fileId, recipientEmail) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE_URL}/files/share`, { fileId, recipientEmail }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      throw new Error("Failed to share file");
    }
  },
};

export default apiService;
