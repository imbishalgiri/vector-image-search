# Vector-Based Image Retrieval System

A multimodal search application leveraging deep learning embeddings for semantic image matching and text-to-image retrieval.

## Overview
Traditional keyword search is limited by metadata. This project implements semantic search 
by understanding the visual content of an image. Using a combination of Computer Vision and Vector Databases, the system enables:
- **Natural Language Prompts:** Finding images via text descriptions.
- **Image-to-Image Similarity:** Uploading a reference photo to find visually similar matches.

## Technical Implementation
- **Inference Engine:** Built on **PyTorch**, utilizing `@torch.inference_mode()` to minimize memory overhead and maximize throughput during embedding generation.
- **Hardware Acceleration:** Supports **CUDA** for GPU-accelerated tensor computations, significantly reducing latency for real-time search.
- **Vector Normalization:** Implements **L2 Normalization** on the CLIP output (unit hypersphere mapping). This ensures that FAISS similarity scores are based purely on semantic direction (Cosine Similarity) rather than vector magnitude.

## Key Features
- **Multimodal Alignment:** Maps text and images into a shared vector space, enabling text-based visual search without manual tagging.
- **High-Speed Indexing:** Utilizes FAISS for efficient similarity searches across the vector space.
