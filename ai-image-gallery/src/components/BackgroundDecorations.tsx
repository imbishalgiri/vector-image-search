import { colors } from "../theme";

const BackgroundDecorations = () => (
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
);

export default BackgroundDecorations;
