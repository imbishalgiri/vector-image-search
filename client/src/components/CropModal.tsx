import { useMemo, useRef, useState } from "react";
import ReactCrop, {
  type Crop,
  type PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface Props {
  file: File;
  onClose: () => void;
  onCrop: (file: File) => void;
}

const ASPECT = 1; // 1:1 aspect ratio
const MIN_DIMENSION = 150;

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function CropModal({ file, onClose, onCrop }: Props) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const objectUrl = useMemo(() => URL.createObjectURL(file), [file]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setImageSize({ width: naturalWidth, height: naturalHeight });

    const initialCrop = centerAspectCrop(naturalWidth, naturalHeight, ASPECT);
    setCrop(initialCrop);
  };

  const getCroppedImg = async (
    image: HTMLImageElement,
    crop: PixelCrop
  ): Promise<Blob> => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    // Calculate scale to get actual pixel coordinates
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(resolve as BlobCallback, "image/jpeg", 0.95);
    });
  };

  const handleConfirm = async () => {
    const image = imgRef.current;
    if (!image || !completedCrop) return;

    try {
      const blob = await getCroppedImg(image, completedCrop);
      const croppedFile = new File([blob], file.name, {
        type: "image/jpeg",
        lastModified: Date.now(),
      });
      onCrop(croppedFile);
    } catch (err) {
      console.error("Error cropping image:", err);
    }
  };

  const darkGreen = "#1b5e20";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "1.5rem",
          width: "90%",
          maxWidth: 550,
          boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
          border: `1px solid ${darkGreen}`,
        }}
      >
        <h2
          style={{
            margin: "0 0 1rem 0",
            color: darkGreen,
            textAlign: "center",
          }}
        >
          Crop Image
        </h2>

        <div
          style={{
            height: 420,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            backgroundColor: "#f5f5f5",
            borderRadius: 8,
          }}
        >
          <div
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={ASPECT}
              minWidth={MIN_DIMENSION}
              minHeight={MIN_DIMENSION}
              keepSelection
              ruleOfThirds
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                overflow: "hidden",
              }}
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={objectUrl}
                onLoad={handleImageLoad}
                style={{
                  display: "block",
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain", // <-- Changed from "cover"
                }}
              />
            </ReactCrop>
          </div>
        </div>

        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <small style={{ color: "#666" }}>
            Drag to adjust crop area • Minimum: {MIN_DIMENSION}px
          </small>
        </div>

        <div
          style={{
            marginTop: "1.25rem",
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          <button
            onClick={handleConfirm}
            disabled={!completedCrop}
            style={{
              background: darkGreen,
              color: "#fff",
              padding: "0.6rem 1.6rem",
              borderRadius: 9999,
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(27,94,32,0.35)",
              opacity: !completedCrop ? 0.6 : 1,
            }}
          >
            Crop & Continue
          </button>
          <button
            onClick={onClose}
            style={{
              background: "#f5f5f5",
              color: darkGreen,
              padding: "0.6rem 1.6rem",
              borderRadius: 9999,
              border: `1px solid ${darkGreen}`,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
