import axios from "axios";
import { supabase } from "./supabase";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Could not read Supabase session:", error);
    return config;
  }

  const token = data.session?.access_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
