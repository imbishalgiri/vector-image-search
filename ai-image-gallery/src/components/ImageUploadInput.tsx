import { Upload } from "lucide-react";
import { colors } from "../theme";
import PillButton from "./PillButton";
import { AnimatePresence, motion } from "framer-motion";

const ImageUploadInput = ({
  uploadedImage,
  previewUrl,
  handleFileChange,
  handleSearch,
  loading,
}: {
  uploadedImage: File | null;
  previewUrl: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearch: () => void;
  loading: boolean;
}) => (
  <>
    <input
      type="file"
      accept="image/*"
      id="imageUpload"
      style={{ display: "none" }}
      onChange={handleFileChange}
    />
    <motion.label
      htmlFor="imageUpload"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.8rem",
        padding: "1rem 2rem",
        borderRadius: "50px",
        cursor: "pointer",
        background: `linear-gradient(135deg, ${colors.medium}, ${colors.dark})`,
        color: "#fff",
        fontWeight: 600,
        boxShadow: "0 6px 20px rgba(46,125,50,0.3)",
        fontSize: "1rem",
        border: "none",
      }}
    >
      <Upload size={20} />
      {uploadedImage ? "Change Image" : "Upload Image"}
    </motion.label>

    <AnimatePresence>
      {previewUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{
            width: "100%",
            maxWidth: "300px",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
            border: `2px solid ${colors.mint}`,
          }}
        >
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              width: "100%",
              height: "150px",
              objectFit: "cover",
              display: "block",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>

    <PillButton
      onClick={handleSearch}
      disabled={!uploadedImage}
      loading={loading}
    >
      Find Similar Images
    </PillButton>
  </>
);

export default ImageUploadInput;
