from pathlib import Path

class Settings:
    PROJECT_ROOT = Path(__file__).resolve().parent.parent
    MEDIA_ROOT = PROJECT_ROOT / "media"
    ORIGINALS_DIR = MEDIA_ROOT / "originals"
    DATABASE_URL = f"sqlite:///{(PROJECT_ROOT / 'images.db').as_posix()}"
    ALLOWED_MIME = {
        "image/png", "image/jpeg", "image/webp",
        "image/bmp", "image/tiff", "image/svg+xml",
    }
    MAX_UPLOAD_MB = 30

settings = Settings()
settings.MEDIA_ROOT.mkdir(parents=True, exist_ok=True)
settings.ORIGINALS_DIR.mkdir(parents=True, exist_ok=True)
