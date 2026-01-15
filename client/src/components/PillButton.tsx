import { motion } from "framer-motion";
import { colors } from "../theme";

const PillButton = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary";
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
        Searching...
      </motion.span>
    ) : (
      children
    )}
  </motion.button>
);

export default PillButton;
