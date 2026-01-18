# Vector-Based Image Retrieval System

A multimodal search application leveraging deep learning embeddings for semantic image matching and text-to-image retrieval.

## Overview
Traditional keyword search is limited by metadata. This project implements semantic search 
by understanding the visual content of an image. Using a combination of Computer Vision and Vector Databases, the system enables:
- **Natural Language Prompts:** Finding images via text descriptions.
- **Image-to-Image Similarity:** Uploading a reference photo to find visually similar matches.

## Technical Stack
- **Model:** CLIP (Contrastive Language-Image Pre-training) for cross-modal embedding generation.
- **Vector Engine:** FAISS (Facebook AI Similarity Search) for high-speed nearest neighbor retrieval.
- **Backend:** FastAPI and PyTorch optimized for low-latency inference.

## Key Features
- **Multimodal Alignment:** Maps text and images into a shared vector space, enabling text-based visual search without manual tagging.
- **High-Speed Indexing:** Utilizes FAISS for efficient similarity searches across the vector space.
