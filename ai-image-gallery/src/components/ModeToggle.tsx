import { motion } from "framer-motion";
import { colors } from "../theme";
import { Image, Search } from "lucide-react";

const ModeToggle = ({
  uploadMode,
  setUploadMode,
}: {
  uploadMode: boolean;
  setUploadMode: (mode: boolean) => void;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.3 }}
    style={{
      display: "flex",
      gap: "0.5rem",
      marginBottom: "2.5rem",
      background: "rgba(255,255,255,0.7)",
      backdropFilter: "blur(10px)",
      borderRadius: "50px",
      padding: "0.5rem",
      border: `1px solid ${colors.mint}`,
      position: "relative",
      zIndex: 1,
    }}
  >
    <button
      onClick={() => setUploadMode(false)}
      style={{
        padding: "0.7rem 1.6rem",
        borderRadius: "50px",
        border: "none",
        background: uploadMode
          ? "transparent"
          : `linear-gradient(135deg, ${colors.medium}, ${colors.dark})`,
        color: uploadMode ? colors.dark : "#fff",
        fontWeight: 600,
        cursor: "pointer",
        boxShadow: uploadMode ? "none" : "0 4px 12px rgba(46,125,50,0.3)",
        transition: "all 0.3s ease",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        fontSize: "0.95rem",
      }}
    >
      <Search size={18} />
      Search by Prompt
    </button>
    <button
      onClick={() => setUploadMode(true)}
      style={{
        padding: "0.7rem 1.6rem",
        borderRadius: "50px",
        border: "none",
        background: uploadMode
          ? `linear-gradient(135deg, ${colors.medium}, ${colors.dark})`
          : "transparent",
        color: uploadMode ? "#fff" : colors.dark,
        fontWeight: 600,
        cursor: "pointer",
        boxShadow: uploadMode ? "0 4px 12px rgba(46,125,50,0.3)" : "none",
        transition: "all 0.3s ease",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        fontSize: "0.95rem",
      }}
    >
      <Image size={18} />
      Search by Image
    </button>
  </motion.div>
);

export default ModeToggle;
