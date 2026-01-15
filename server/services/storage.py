import hashlib, io
from pathlib import Path
from typing import Optional, Tuple
import filetype
from PIL import Image as PILImage
from core.config import settings

SVG_MIME = "image/svg+xml"

def _calc_sha256(data: bytes) -> str:
    h = hashlib.sha256()
    h.update(data)
    return h.hexdigest()

def _detect_mime_and_ext(data: bytes, name: str) -> Tuple[str, str]:
    kind = filetype.guess(data)
    if kind:
        return kind.mime, f".{kind.extension}"
    head = data[:256].lower()
    if b"<svg" in head:
        return SVG_MIME, ".svg"
    ext = Path(name).suffix.lower()
    if ext == ".svg":
        return SVG_MIME, ".svg"
    raise ValueError("unknown or unsupported image type")

def _probe_dims(mime: str, data: bytes) -> Tuple[Optional[int], Optional[int]]:
    if mime == SVG_MIME:
        return None, None
    try:
        img = PILImage.open(io.BytesIO(data))
        return img.width, img.height
    except Exception:
        return None, None

def save_image(data: bytes, original_name: str) -> dict:
    if len(data) > settings.MAX_UPLOAD_MB * 1024 * 1024:
        raise ValueError(f"File exceeds {settings.MAX_UPLOAD_MB} MB limit")
    mime, ext = _detect_mime_and_ext(data, original_name)
    if mime not in settings.ALLOWED_MIME:
        raise ValueError(f"MIME not allowed: {mime}")
    sha = _calc_sha256(data)
    subdir = settings.ORIGINALS_DIR / sha[:2]
    subdir.mkdir(parents=True, exist_ok=True)
    path = subdir / f"{sha}{ext}"
    if not path.exists():
        path.write_bytes(data)
    width, height = _probe_dims(mime, data)
    return {
        "sha256": sha,
        "mime": mime,
        "ext": ext,
        "size_bytes": len(data),
        "width": width,
        "height": height,
        "stored_relpath": str(path.relative_to(settings.PROJECT_ROOT)),
        "original_filename": original_name,
    }
