// api/axios.ts
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  withCredentials: true, // This allows cookies to be sent
});

let hasRedirected = false;

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      window.location.pathname !== "/login" &&
      !hasRedirected
    ) {
      hasRedirected = true;
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
