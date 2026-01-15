import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, Image as ImageIcon, CheckCircle } from "lucide-react";
import { uploadImage, getAllImages, type ImageSearchResult } from "../api/apis";
import { baseURL } from "../lib/axios";
import UploadZone from "./UploadZone";
import CropModal from "./CropModal";
import GalleryGrid from "./GalleryGrid";

export default function UploadImage() {
  const [file, setFile] = useState<File | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [images, setImages] = useState<ImageSearchResult[]>([]);
  const [showCropModal, setShowCropModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "gallery">("upload");
  const [toast, setToast] = useState<string | null>(null);

  const colors = {
    dark: "#1b5e20",
    medium: "#2e7d32",
    light: "#e8f5e9",
    mint: "#a8e6cf",
    accent: "#4caf50",
  };

  const fetchImages = async () => {
    try {
      const data = await getAllImages();
      setImages(data);
    } catch (err) {
      console.error("Failed to fetch images:", err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileSelect = (file: File) => {
    setFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setShowCropModal(true);
  };

  const handleCropped = async (cropped: File) => {
    setCroppedFile(cropped);
    setShowCropModal(false);
    setPreviewUrl(URL.createObjectURL(cropped));
  };

  const handleUpload = async () => {
    if (!croppedFile) return alert("Please crop and confirm the image first!");

    const formData = new FormData();
    formData.append("file", croppedFile);

    try {
      setUploading(true);
      setMessage("Uploading...");
      const res = await uploadImage(formData);
      setMessage(`Uploaded: ${res.name || croppedFile.name}`);
      setToast("Image uploaded successfully!");
      setTimeout(() => setToast(null), 3000);

      await fetchImages();
      setActiveTab("gallery");

      setCroppedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error(err);
      setMessage("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const PillButton = ({
    children,
    onClick,
    disabled = false,
    loading = false,
    variant = "primary",
    icon: Icon,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
    variant?: "primary" | "secondary";
    icon?: React.ElementType;
  }) => (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      style={{
        padding: "0.8rem 2rem",
        borderRadius: "50px",
        background: disabled
          ? "#e0e0e0"
          : variant === "primary"
          ? `linear-gradient(135deg, ${colors.medium}, ${colors.dark})`
          : "rgba(255, 255, 255, 0.9)",
        color: disabled ? "#999" : variant === "primary" ? "#fff" : colors.dark,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: disabled
          ? "none"
          : variant === "primary"
          ? "0 6px 20px rgba(46,125,50,0.3)"
          : "0 4px 12px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease",
        fontSize: "0.95rem",
        border: variant === "secondary" ? `1px solid ${colors.mint}` : "none",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      {loading ? (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{
              width: 16,
              height: 16,
              border: "2px solid transparent",
              borderTop: "2px solid currentColor",
              borderRadius: "50%",
            }}
          />
          Uploading...
        </motion.span>
      ) : (
        <>
          {Icon && <Icon size={18} />}
          {children}
        </>
      )}
    </motion.button>
  );

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: `linear-gradient(135deg, ${colors.light} 0%, #ffffff 50%, ${colors.mint} 100%)`,
        fontFamily: "system-ui, sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorative elements */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "400px",
          background: `linear-gradient(135deg, ${colors.medium}15, ${colors.mint}25)`,
          clipPath: "polygon(0 0, 100% 0, 100% 70%, 0 100%)",
          zIndex: 0,
        }}
      />

      {/* Main Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          maxWidth: "900px",
          width: "90%",
          background: "rgba(255, 255, 255, 0.95)",
          boxShadow: `
            0 20px 40px rgba(46, 125, 50, 0.1),
            0 0 0 1px rgba(46, 125, 50, 0.05)
          `,
          borderRadius: "24px",
          padding: "2rem 2.5rem 2.5rem",
          backdropFilter: "blur(16px)",
          border: `1px solid rgba(46, 125, 50, 0.1)`,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "60vh",
          overflowX: "hidden",
          overflowY: "auto",
          zIndex: 1,
        }}
      >
        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              key="toast"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1.5rem",
                background: `linear-gradient(135deg, ${colors.medium}, ${colors.dark})`,
                color: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "50px",
                boxShadow: "0 8px 25px rgba(46,125,50,0.3)",
                fontWeight: 600,
                zIndex: 100,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <CheckCircle size={18} />
              {toast}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Navigation */}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            background: "rgba(232, 245, 233, 0.4)",
            backdropFilter: "blur(10px)",
            borderRadius: "50px",
            padding: "0.5rem",
            border: `1px solid ${colors.mint}`,
            alignSelf: "flex-start",
            marginBottom: "1.5rem",
          }}
        >
          {[
            { key: "upload", label: "Upload", icon: UploadCloud },
            { key: "gallery", label: "Gallery", icon: ImageIcon },
          ].map((tab) => (
            <motion.button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as "upload" | "gallery")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "0.7rem 1.5rem",
                background:
                  activeTab === tab.key
                    ? `linear-gradient(135deg, ${colors.medium}, ${colors.dark})`
                    : "transparent",
                color: activeTab === tab.key ? "#fff" : colors.dark,
                fontWeight: 600,
                border: "none",
                borderRadius: "50px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "all 0.3s ease",
                boxShadow:
                  activeTab === tab.key
                    ? "0 4px 15px rgba(46,125,50,0.3)"
                    : "none",
                fontSize: "0.9rem",
              }}
            >
              <tab.icon size={16} />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          <h1
            style={{
              fontWeight: 800,
              fontSize: "2.2rem",
              color: colors.dark,
              marginBottom: "0.5rem",
              lineHeight: 1.2,
              background: `linear-gradient(135deg, ${colors.dark}, ${colors.accent})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {activeTab === "upload" ? "Upload New Image" : "Image Gallery"}
          </h1>

          <p
            style={{
              color: "#666",
              fontSize: "1rem",
              opacity: 0.8,
            }}
          >
            {activeTab === "upload"
              ? "Upload and crop your images for better search results"
              : `Browse your collection (${images.length} images)`}
          </p>
        </motion.div>

        {/* Content Area */}
        <div
          style={{
            width: "100%",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <AnimatePresence mode="wait">
            {activeTab === "upload" ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{
                  duration: 0.5,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                style={{
                  width: "50%",
                  height: "300px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between", // Better space distribution
                  gap: "1.5rem",
                  overflowY: "auto",
                }}
              >
                {/* Upload Zone with more space */}
                <div
                  style={{
                    width: "100%",
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <UploadZone
                    onFileSelect={handleFileSelect}
                    preview={previewUrl}
                  />
                </div>

                {showCropModal && file && (
                  <CropModal
                    file={file}
                    onClose={() => setShowCropModal(false)}
                    onCrop={handleCropped}
                  />
                )}

                {/* Upload Button Section */}
                <div
                  style={{
                    textAlign: "center",
                    paddingTop: "1rem",
                  }}
                >
                  <PillButton
                    onClick={handleUpload}
                    disabled={uploading || !croppedFile}
                    loading={uploading}
                    icon={UploadCloud}
                  >
                    Upload Image
                  </PillButton>

                  {message && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        marginTop: "1rem",
                        fontWeight: 500,
                        color: message.startsWith("Uploaded")
                          ? colors.medium
                          : "#ff4444",
                        fontSize: "0.9rem",
                      }}
                    >
                      {message}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="gallery"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{
                  duration: 0.5,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                style={{
                  width: "100%",
                  flexGrow: 1,
                  overflowY: "auto",
                  paddingBottom: "1rem",
                }}
              >
                <GalleryGrid images={images} baseURL={baseURL} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
