import { motion } from "framer-motion";
import { colors } from "../theme";

const HeroSection = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    style={{
      textAlign: "center",
      maxWidth: "700px",
      marginBottom: "3rem",
      position: "relative",
      zIndex: 1,
    }}
  >
    <h1
      style={{
        fontWeight: 800,
        fontSize: "clamp(2.2rem, 5vw, 3rem)",
        color: colors.dark,
        marginBottom: "1.2rem",
        lineHeight: 1.2,
        background: `linear-gradient(135deg, ${colors.dark}, ${colors.accent})`,
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      Search Your Uploaded Images
    </h1>
    <p
      style={{
        color: "#555",
        fontSize: "1.1rem",
        lineHeight: 1.6,
        opacity: 0.9,
      }}
    >
      Find your images using descriptive prompts or visual similarity
      <br />
      <small style={{ fontSize: "0.9rem", color: colors.medium }}>
        Powered by vector similarity matching
      </small>
    </p>
  </motion.div>
);

export default HeroSection;
