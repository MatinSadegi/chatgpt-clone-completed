import axios from "axios";

const PUBLIC_BASE_URL = import.meta.env.VITE_PUBLIC_BASE_URL;
console.log(PUBLIC_BASE_URL);

export const instance = axios.create({
  baseURL: PUBLIC_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
