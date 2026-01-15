import torch
import numpy as np
import io, cairosvg
from PIL import Image
from transformers import CLIPProcessor, CLIPModel
from pathlib import Path


class CLIPEmbedder:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        model_name = "openai/clip-vit-base-patch32"
        
        self.model = CLIPModel.from_pretrained(model_name).to(self.device)
        self.processor = CLIPProcessor.from_pretrained(model_name)

    def _open_image_any(self, path_or_bytes: Path | bytes) -> Image.Image:
        if isinstance(path_or_bytes, Path) and path_or_bytes.suffix.lower() == ".svg":
            png_bytes = cairosvg.svg2png(url=str(path_or_bytes), output_width=512, output_height=512)
            return Image.open(io.BytesIO(png_bytes)).convert("RGB")
        elif isinstance(path_or_bytes, bytes):
            return Image.open(io.BytesIO(path_or_bytes)).convert("RGB")
        else:
            return Image.open(path_or_bytes).convert("RGB")

    @torch.inference_mode()
    def embed_image(self, image: Image.Image) -> np.ndarray:
        inputs = self.processor(images=image, return_tensors="pt").to(self.device)
        feats = self.model.get_image_features(**inputs)
        feats = feats / feats.norm(p=2, dim=-1, keepdim=True)
        return feats.cpu().numpy().astype("float32")

    @torch.inference_mode()
    def embed_text(self, text: str) -> np.ndarray:
        inputs = self.processor(text=[text], return_tensors="pt", padding=True).to(self.device)
        feats = self.model.get_text_features(**inputs)
        feats = feats / feats.norm(p=2, dim=-1, keepdim=True)
        return feats.cpu().numpy().astype("float32")