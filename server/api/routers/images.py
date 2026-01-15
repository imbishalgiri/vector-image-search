from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from core.db import get_session
from models.image import Image
from services.storage import save_image
from pathlib import Path
from core.config import settings
from schemas.image import ImageOut
from PIL import Image as PILImage
import numpy as np
import io
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from services.embeddings import CLIPEmbedder
    from services.vector_index import ImageIndex

def create_router(embedder: "CLIPEmbedder", vector_index: "ImageIndex") -> APIRouter:
    router = APIRouter(prefix="/images", tags=["images"])

    @router.post("", response_model=ImageOut, summary="Upload an image and generate embedding")
    async def upload_image(file: UploadFile = File(...), db: AsyncSession = Depends(get_session)):
        
        try:
            data = await file.read()
            data_io = io.BytesIO(data)
            data_io.seek(0)
            meta = save_image(data, file.filename)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"storage error: {e}")

        result = await db.execute(select(Image).where(Image.sha256 == meta["sha256"]))
        obj = result.scalar_one_or_none()
        is_new = obj is None
        
        embedding_bytes = None
        if is_new:
            try:
                image = PILImage.open(data_io).convert("RGB")
                embedding_array = embedder.embed_image(image)
                embedding_bytes = embedding_array.tobytes()
            except Exception as e:
                print(f"Error generating embedding for {file.filename}: {e}")

        if is_new:
            obj = Image(
                sha256=meta["sha256"],
                original_filename=meta["original_filename"],
                mime_type=meta["mime"],
                ext=meta["ext"],
                size_bytes=meta["size_bytes"],
                width=meta["width"],
                height=meta["height"],
                stored_path=meta["stored_relpath"],
                embedding=embedding_bytes, # CRITICAL FIX: Save the embedding
            )
            db.add(obj)
            await db.commit()
            await db.refresh(obj)

        if is_new and obj.embedding:
            emb_for_index = np.frombuffer(obj.embedding, dtype="float32").reshape(1, -1)
            vector_index.add(obj.id, emb_for_index)

        return obj

    @router.get("/{image_id}/raw", summary="Retrieve the raw image file")
    async def get_image_raw(image_id: int, db: AsyncSession = Depends(get_session)):
        result = await db.execute(select(Image).where(Image.id == image_id))
        image_obj = result.scalar_one_or_none()

        if image_obj is None:
            raise HTTPException(status_code=404, detail="Image not found")

        file_path = Path(settings.PROJECT_ROOT) / image_obj.stored_path

        if not file_path.exists():
            raise HTTPException(status_code=404, detail="Stored file missing on disk")

        return FileResponse(
            path=file_path,
            media_type=image_obj.mime_type,
            filename=image_obj.original_filename
        )
    
    return router