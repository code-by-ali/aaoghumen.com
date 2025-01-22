import axios from "axios";

const api = axios.create({
  baseURL: "https://aaoghumen.com/dev3/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for common error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Log error or show notification
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
