import { useState, useEffect } from "react";
import { Search, Images } from "lucide-react";

export default function Navbar() {
  const [activeTab, setActiveTab] = useState("explore");

  useEffect(() => {
    if (location.pathname.includes("upload")) setActiveTab("upload");
    else setActiveTab("explore");
  }, []);

  const colors = {
    dark: "#1b5e20",
    medium: "#2e7d32",
    light: "#e8f5e9",
  };

  const navbarStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "60px",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderBottom: `1px solid rgba(46, 125, 50, 0.1)`,
  };

  const TabButton = ({
    href,
    icon: Icon,
    label,
    isActive,
  }: {
    href: string;
    icon: React.ElementType;
    label: string;
    isActive: boolean;
  }) => (
    <a
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        fontSize: "0.9rem",
        fontWeight: 500,
        textDecoration: "none",
        padding: "0.6rem 1.5rem",
        borderRadius: "50px",
        color: isActive ? "#fff" : colors.dark,
        background: isActive ? colors.medium : "transparent",
        border: `1px solid ${
          isActive ? colors.medium : "rgba(46, 125, 50, 0.2)"
        }`,
        transition: "all 0.25s ease",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.background =
            "rgba(46,125,50,0.05)";
          (e.currentTarget as HTMLElement).style.borderColor = colors.medium;
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.background = "transparent";
          (e.currentTarget as HTMLElement).style.borderColor =
            "rgba(46,125,50,0.2)";
        }
      }}
    >
      <Icon size={16} />
      <span>{label}</span>
    </a>
  );

  return (
    <nav style={navbarStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <TabButton
          href="/"
          icon={Search}
          label="Explore"
          isActive={activeTab === "explore"}
        />
        <TabButton
          href="/upload"
          icon={Images}
          label="My Collection"
          isActive={activeTab === "upload"}
        />
      </div>
    </nav>
  );
}
