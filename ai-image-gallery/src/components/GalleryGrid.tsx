import { Download } from "lucide-react";
import type { ImageSearchResult } from "../api/apis";

interface Props {
  images: ImageSearchResult[];
  baseURL: string;
}

export default function GalleryGrid({ images, baseURL }: Props) {
  const darkGreen = "#1b5e20";
  const mediumGreen = "#2e7d32";
  const lightGreen = "#e8f5e9";

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        marginTop: "1rem",
        overflowX: "hidden",
      }}
    >
      {images.length === 0 ? (
        <p
          style={{
            color: "#666",
            textAlign: "center",
            fontStyle: "italic",
            marginTop: "2rem",
          }}
        >
          No images uploaded yet
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "1.2rem",
            justifyItems: "center",
            alignItems: "start",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {images
            .slice()
            .reverse()
            .map((img) => {
              const imageUrl = `${baseURL}${img.stored_path}`;
              return (
                <div
                  key={img.id}
                  style={{
                    position: "relative",
                    background: "#fff",
                    borderRadius: "12px",
                    border: `1px solid rgba(46, 125, 50, 0.15)`,
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                    overflow: "hidden",
                    width: "100%",
                    maxWidth: "220px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 15px rgba(46, 125, 50, 0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(0,0,0,0.08)";
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "160px",
                      background: lightGreen,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt={img.filename}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        transition: "transform 0.4s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(imageUrl, img.filename);
                      }}
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        background: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        width: "34px",
                        height: "34px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
                        cursor: "pointer",
                        transition:
                          "background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 10px rgba(46, 125, 50, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 2px 6px rgba(0, 0, 0, 0.15)";
                      }}
                      title="Download image"
                    >
                      <Download
                        size={18}
                        color={mediumGreen}
                        strokeWidth={2.4}
                      />
                    </button>
                  </div>

                  <div
                    style={{
                      padding: "0.6rem 0.75rem",
                      textAlign: "center",
                      fontSize: "0.85rem",
                      color: darkGreen,
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {img.filename}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
