from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from core.db import Base, engine
from api.routers import images, search
from services.embeddings import CLIPEmbedder
from services.vector_index import ImageIndex

from fastapi.staticfiles import StaticFiles
import os


async def init_models():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


GLOBAL_EMBEDDER = CLIPEmbedder()
GLOBAL_VECTOR_INDEX = ImageIndex()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_models()
    search_router = search.create_router(
        embedder=GLOBAL_EMBEDDER,
        index=GLOBAL_VECTOR_INDEX,
    )
    await search_router.initialize_index()
    yield


def create_app() -> FastAPI:
    app = FastAPI(
        title="Vector Image API",
        version="0.1.0",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(
        images.create_router(embedder=GLOBAL_EMBEDDER, vector_index=GLOBAL_VECTOR_INDEX)
    )

    app.include_router(
        search.create_router(embedder=GLOBAL_EMBEDDER, index=GLOBAL_VECTOR_INDEX)
    )

    return app


app = create_app()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

PARENT_DIR = os.path.dirname(BASE_DIR)

MEDIA_DIR = os.path.join(PARENT_DIR, "media")

app.mount("/media", StaticFiles(directory=MEDIA_DIR), name="media")
