import React from "react";
import "../styles/FileCard.css";

const FileCard = ({ file, onDelete, onDownload, onShare, onFavorite, isBin = false }) => {
  return (
    <div className="file-card">
      <h3>{file.filename}</h3>
      <p>Type: {file.type}</p>
      <p>Size: {file.size} KB</p>

      {!isBin && ( // Hide buttons if inside Bin page
        <div className="file-actions">
          <button onClick={() => onDownload(file.url, file.filename)}>Download</button>
          <button onClick={() => onShare(file)}>Share</button>
          <button onClick={() => onFavorite(file)}>⭐ Favorite</button>
          <button onClick={() => onDelete(file)}>🗑️ Delete</button>
        </div>
      )}
    </div>
  );
};

export default FileCard;
