import api from "../lib/axios";

/**
 * Type definition for image search results
 */
export interface ImageSearchResult {
  id: number;
  score: number | null;
  filename: string;
  mime_type: string;
  url: string;
  stored_path: string;
}

/**
 * POST /images
 * Upload an image using multipart/form-data
 */
export const uploadImage = async (formData: FormData) => {
  const res = await api.post("/images", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

/**
 * GET /search/all
 * Fetch all stored images
 */
export const getAllImages = async (): Promise<ImageSearchResult[]> => {
  const res = await api.get<ImageSearchResult[]>("/search/all");
  return res.data;
};

/**
 * POST /search/image
 * Search similar images by uploading an image
 * @param formData - FormData containing the image file (binary)
 */
export const searchByImage = async (
  formData: FormData
): Promise<ImageSearchResult[]> => {
  const res = await api.post<ImageSearchResult[]>("/search/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

/**
 * POST /search/text
 * Search similar images by text prompt
 * @param prompt - Text prompt to search for similar images
 */
export const searchByText = async (
  prompt: string
): Promise<ImageSearchResult[]> => {
  const res = await api.post<ImageSearchResult[]>("/search/text", null, {
    params: { prompt },
  });
  return res.data;
};
