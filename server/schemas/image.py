from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class ImageBase(BaseModel):
    sha256: str = Field(..., max_length=64)
    original_filename: str = Field(..., max_length=255)
    mime_type: str = Field(..., max_length=50)
    ext: str = Field(..., max_length=10)
    size_bytes: int
    width: Optional[int] = None
    height: Optional[int] = None
    stored_path: str = Field(..., max_length=500)


class ImageOut(ImageBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class SearchResult(BaseModel):
    id: int
    score: Optional[float] = None
    filename: str
    mime_type: str
    url: str
    stored_path: str
