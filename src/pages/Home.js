import React from "react";
import FileUpload from "../components/FileUpload";
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to FileShare</h1>
      <p>Upload and share your files securely.</p>
      <FileUpload />
    </div>
  );
};

export default Home;
