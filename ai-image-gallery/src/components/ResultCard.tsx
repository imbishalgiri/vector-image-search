import { motion } from "framer-motion";
import { Star, Award } from "lucide-react";
import { colors } from "../theme";

const ResultCard = ({
  url,
  index,
  onClick,
}: {
  url: string;
  index: number;
  onClick: (url: string) => void;
}) => {
  const isTopMatch = index === 0;

  return (
    <motion.div
      key={url}
      onClick={() => onClick(url)}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{
        scale: 1.06,
        y: -8,
        boxShadow: isTopMatch
          ? "0 20px 50px rgba(46,125,50,0.35)"
          : "0 16px 40px rgba(0,0,0,0.18)",
      }}
      style={{
        position: "relative",
        borderRadius: "20px",
        overflow: "hidden",
        background: "#fff",
        boxShadow: isTopMatch
          ? "0 0 30px rgba(46,125,50,0.5)"
          : "0 8px 25px rgba(0,0,0,0.12)",
        height: "260px",
        cursor: "pointer",
        border: isTopMatch
          ? `2px solid ${colors.medium}`
          : `1px solid ${colors.mint}`,
        transition: "all 0.3s ease",
      }}
    >
      {/* Image */}
      <img
        src={url}
        alt={`result-${index}`}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          transform: "scale(1.02)",
          transition: "transform 0.3s ease",
        }}
      />

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "70%",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.05))",
        }}
      />

      {/* Label container */}
      <div
        style={{
          position: "absolute",
          bottom: "1rem",
          left: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          color: "white",
          fontWeight: 600,
          fontSize: "0.95rem",
          textShadow: "0 2px 6px rgba(0,0,0,0.6)",
          letterSpacing: "0.3px",
        }}
      >
        {isTopMatch ? (
          <>
            <Award size={18} strokeWidth={2.5} color={colors.medium} />
            <span>Top Match</span>
          </>
        ) : (
          <>
            <Star size={16} strokeWidth={2} color={colors.mint} />
            <span>Match {index + 1}</span>
          </>
        )}
      </div>

      {isTopMatch && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "20px",
            boxShadow: `inset 0 0 0 3px ${colors.medium}`,
            pointerEvents: "none",
          }}
        />
      )}
    </motion.div>
  );
};

export default ResultCard;
