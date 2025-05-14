// api/axios.ts
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  withCredentials: true, // This allows cookies to be sent
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optional: redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
