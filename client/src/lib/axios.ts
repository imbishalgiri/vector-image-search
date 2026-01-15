import axios from "axios";
export const baseURL = import.meta.env.PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
