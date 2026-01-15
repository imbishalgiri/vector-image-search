import { useState, type DragEvent } from "react";

interface Props {
  onFileSelect: (file: File) => void;
  preview: string | null;
}

export default function UploadZone({ onFileSelect, preview }: Props) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
      onClick={() => document.getElementById("fileInput")?.click()}
      style={{
        border: `3px dashed ${isDragging ? "#0077ff" : "#ccc"}`,
        borderRadius: "12px",
        padding: "2rem",
        background: isDragging ? "#eef7ff" : "#fafafa",
        transition: "0.3s",
        textAlign: "center",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      {!preview ? (
        <p style={{ color: "#777", fontSize: "1rem" }}>
          {isDragging
            ? "Drop image here 📸"
            : "Drag & drop image here, or click to select"}
        </p>
      ) : (
        <img
          src={preview}
          alt="Preview"
          style={{
            width: "100px",
            height: "auto",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            objectFit: "cover",
            transition: "0.3s ease",
          }}
        />
      )}
    </div>
  );
}
