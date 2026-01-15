import { motion } from "framer-motion";
import TextSearchInput from "./TextSearchInput";
import ImageUploadInput from "./ImageUploadInput";

const SearchInputArea = ({
  uploadMode,
  query,
  setQuery,
  uploadedImage,
  previewUrl,
  handleFileChange,
  handleSearch,
  loading,
}: {
  uploadMode: boolean;
  query: string;
  setQuery: (query: string) => void;
  uploadedImage: File | null;
  previewUrl: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearch: () => void;
  loading: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
    style={{
      width: "90%",
      maxWidth: "650px",
      minHeight: uploadMode ? "260px" : "80px",
      background: "rgba(255,255,255,0.9)",
      backdropFilter: "blur(16px)",
      borderRadius: "20px",
      padding: uploadMode ? "2.5rem" : "1.2rem 1.5rem",
      boxShadow: `
          0 20px 40px rgba(46,125,50,0.1),
          0 0 0 1px rgba(46,125,50,0.05)
        `,
      border: `1px solid rgba(46,125,50,0.1)`,
      display: "flex",
      flexDirection: uploadMode ? "column" : "row",
      alignItems: "center",
      justifyContent: "center",
      gap: uploadMode ? "1.5rem" : "1rem",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      position: "relative",
      zIndex: 1,
      marginBottom: "3rem",
    }}
  >
    {!uploadMode ? (
      <TextSearchInput
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
        loading={loading}
      />
    ) : (
      <ImageUploadInput
        uploadedImage={uploadedImage}
        previewUrl={previewUrl}
        handleFileChange={handleFileChange}
        handleSearch={handleSearch}
        loading={loading}
      />
    )}
  </motion.div>
);

export default SearchInputArea;
