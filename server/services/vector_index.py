import faiss
import numpy as np

class ImageIndex:
    def __init__(self, dim=512):
        self.index = faiss.IndexFlatIP(dim)   
        self.id_map = []                      

    def add(self, image_id: int, embedding: np.ndarray):
        self.index.add(embedding)
        self.id_map.append(image_id)

    def search(self, query_vec: np.ndarray, top_k: int = 5):
        scores, idxs = self.index.search(query_vec, top_k)
        results = []
        for n, i in enumerate(idxs[0]):
            if i == -1:
                continue
            image_id = self.id_map[i]
            results.append((image_id, float(scores[0][n])))
        return results
    
    def reset(self):
        self.index.reset()
        self.id_map = []
