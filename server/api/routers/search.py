from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from core.db import get_session
from models.image import Image
from schemas.image import SearchResult
from PIL import Image as PILImage
import numpy as np
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from services.embeddings import CLIPEmbedder
    from services.vector_index import ImageIndex


def create_router(embedder: "CLIPEmbedder", index: "ImageIndex") -> APIRouter:
    router = APIRouter(prefix="/search", tags=["search"])

    async def load_embeddings(db: AsyncSession):
        index.reset()
        stmt = select(Image.id, Image.embedding).where(Image.embedding.is_not(None))
        db_result = await db.execute(stmt)
        rows = db_result.all()
        for img_id, emb_bytes in rows:
            emb = np.frombuffer(emb_bytes, dtype="float32").reshape(1, -1)
            index.add(img_id, emb)
        print(f"FAISS index loaded with {index.index.ntotal} vectors.")

    async def initialize_index():
        """To be called from the FastAPI lifespan (startup)."""
        try:
            async for db in get_session():
                await load_embeddings(db)
                break
        except Exception as e:
            print(f"FATAL: Error during initial FAISS index load: {e}")

    router.initialize_index = initialize_index

    @router.get(
        "/all",
        response_model=list[SearchResult],
        summary="Get all images available in the database",
    )
    async def get_all_images(db: AsyncSession = Depends(get_session)):
        stmt = select(Image)
        db_result = await db.execute(stmt)
        rows = db_result.scalars().all()

        if not rows:
            raise HTTPException(status_code=404, detail="No images found in database.")

        results = [
            SearchResult(
                id=img.id,
                score=None,
                filename=img.original_filename,
                mime_type=img.mime_type,
                url=f"/images/{img.id}/raw",
                stored_path=img.stored_path,
            )
            for img in rows
        ]
        return results

    @router.post(
        "/image",
        response_model=list[SearchResult],
        summary="Search similar images by uploading an image",
    )
    async def search_by_image(
        file: UploadFile = File(...), db: AsyncSession = Depends(get_session)
    ):
        try:
            image = PILImage.open(file.file).convert("RGB")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid image: {e}")

        query_vec = embedder.embed_image(image)
        if index.index.ntotal == 0:
            raise HTTPException(
                status_code=404, detail="No indexed images yet. Upload images first."
            )

        matches = index.search(query_vec, top_k=5)
        results = []
        for img_id, score in matches:
            db_row = await db.get(Image, img_id)
            if db_row:
                results.append(
                    SearchResult(
                        id=db_row.id,
                        score=round(score, 4),
                        filename=db_row.original_filename,
                        mime_type=db_row.mime_type,
                        url=f"/images/{db_row.id}/raw",
                        stored_path=db_row.stored_path,
                    )
                )
        return results

    @router.post(
        "/text",
        response_model=list[SearchResult],
        summary="Search similar images by text prompt",
    )
    async def search_by_text(prompt: str, db: AsyncSession = Depends(get_session)):
        query_vec = embedder.embed_text(prompt)
        if index.index.ntotal == 0:
            raise HTTPException(
                status_code=404, detail="No indexed images yet. Upload images first."
            )

        matches = index.search(query_vec, top_k=5)
        results = []
        for img_id, score in matches:
            db_row = await db.get(Image, img_id)
            if db_row:
                results.append(
                    SearchResult(
                        id=db_row.id,
                        score=round(score, 4),
                        filename=db_row.original_filename,
                        mime_type=db_row.mime_type,
                        url=f"/images/{db_row.id}/raw",
                        stored_path=db_row.stored_path,
                    )
                )
        return results

    return router
