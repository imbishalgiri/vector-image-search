import { useEffect, useState } from "react";
import ResultsView from "./ResultsView";
import BackgroundDecorations from "./BackgroundDecorations";
import HeroSection from "./HeroSection";
import ModeToggle from "./ModeToggle";
import SearchInputArea from "./SearchInputArea";
import { colors } from "../theme";
import {
  getAllImages,
  searchByImage,
  searchByText,
  type ImageSearchResult,
} from "../api/apis";
import { baseURL } from "../lib/axios";

export default function SearchImages() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadMode, setUploadMode] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);

      let apiResults: ImageSearchResult[] = [];

      if (uploadMode) {
        if (!uploadedImage) {
          alert("Please upload an image first.");
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("file", uploadedImage);

        apiResults = await searchByImage(formData);
      } else {
        if (!query.trim()) {
          alert("Please enter a search query.");
          setLoading(false);
          return;
        }

        apiResults = await searchByText(query);
      }

      setResults(apiResults.map((el) => `${baseURL}${el.stored_path}`));
      setShowResults(true);
    } catch (err) {
      console.error("Error during search:", err);
      alert("Something went wrong while searching. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleBack = () => {
    setShowResults(false);
    setResults([]);
    setQuery("");
    setUploadedImage(null);
    setPreviewUrl(null);
  };

  // Optional: preload all images if needed
  useEffect(() => {
    const fetchAllImages = async () => {
      try {
        const allImages = await getAllImages();
        console.log("Fetched all images:", allImages);
      } catch (err) {
        console.error("Failed to fetch all images:", err);
      }
    };

    fetchAllImages();
  }, []);

  if (showResults) {
    return <ResultsView results={results} handleBack={handleBack} />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${colors.light} 0%, #ffffff 50%, ${colors.mint} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "system-ui, sans-serif",
        padding: "2rem 1.5rem 4rem",
        overflowX: "hidden",
        position: "relative",
        paddingTop: 70,
      }}
    >
      <BackgroundDecorations />
      <HeroSection />
      <ModeToggle uploadMode={uploadMode} setUploadMode={setUploadMode} />
      <SearchInputArea
        uploadMode={uploadMode}
        query={query}
        setQuery={setQuery}
        uploadedImage={uploadedImage}
        previewUrl={previewUrl}
        handleFileChange={handleFileChange}
        handleSearch={handleSearch}
        loading={loading}
      />
    </div>
  );
}
