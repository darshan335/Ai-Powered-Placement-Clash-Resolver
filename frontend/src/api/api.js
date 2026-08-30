import axios from "axios";

const api = axios.create({
  baseURL: "https://ai-powered-placement-clash-resolver.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
