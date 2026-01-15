import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors } from "../theme";
import { ArrowLeft, X } from "lucide-react";
import ResultCard from "./ResultCard";

const ResultsView = ({
  results,
  handleBack,
}: {
  results: string[];
  handleBack: () => void;
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${colors.light} 0%, #ffffff 50%, ${colors.mint} 100%)`,
        fontFamily: "system-ui, sans-serif",
        padding: "2rem 1.5rem 4rem",
        paddingTop: 70,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{
          maxWidth: "1200px",
          margin: "0 auto 2rem auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <motion.button
          onClick={handleBack}
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.8rem 1.5rem 0.8rem 1rem",
            borderRadius: "50px",
            border: `2px solid ${colors.mint}`,
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            color: colors.dark,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(46,125,50,0.15)",
            transition: "all 0.3s ease",
            fontSize: "0.95rem",
          }}
        >
          <ArrowLeft size={18} />
          Back to Search
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: `linear-gradient(135deg, ${colors.medium}, ${colors.dark})`,
            color: "white",
            padding: "0.5rem 1.2rem",
            borderRadius: "50px",
            fontWeight: 600,
            fontSize: "0.9rem",
            boxShadow: "0 4px 12px rgba(46,125,50,0.3)",
          }}
        >
          {results.length} matches found
        </motion.div>
      </motion.div>

      {/* Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.5rem",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {results.map((url, i) => (
          <ResultCard
            key={url}
            url={url}
            index={i}
            onClick={setSelectedImage}
          />
        ))}
      </motion.div>

      {/* Popup Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(5px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              style={{
                position: "relative",
                background: "white",
                borderRadius: "20px",
                overflow: "hidden",
                maxWidth: "90%",
                maxHeight: "90%",
                boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Selected"
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                }}
              />
              <button
                onClick={() => setSelectedImage(null)}
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  background: "rgba(0,0,0,0.6)",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "35px",
                  height: "35px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResultsView;
