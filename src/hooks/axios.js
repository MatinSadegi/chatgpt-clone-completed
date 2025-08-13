import { useUserStore } from "../store/auth";
import axios from "axios";
import { useTokens } from "../store/turnstileToken";

const useAxios = () => {
  const { tokens, setTokens, reset } = useUserStore();
  const { tempToken } = useTokens((state) => state);
  const PUBLIC_BASE_URL = import.meta.env.VITE_PUBLIC_BASE_URL;

  const axiosInstance = axios.create({
    baseURL: PUBLIC_BASE_URL,
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  let token =
    typeof window !== "undefined" ? localStorage.getItem("auth-storage") : null;

  if (token && typeof token === "string") {
    token = JSON.parse(token);
    token = token.state?.tokens?.access?.token;
  } else {
    token = tempToken?.accessToken?.token;
  }

  axiosInstance.interceptors.request.use(
    async (config) => {
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    function (response) {
      return response;
    },
    async function (error) {
      if (error.response?.status === 401) {
        const refreshToken =
          tokens && Object.keys(tokens).length > 0
            ? tokens.refresh.token
            : tempToken.refreshToken.token;
        try {
          const { data } = await axiosInstance.post("auth/refresh-tokens", {
            refreshToken,
          });
          setTokens({ ...data });
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${data.access.token}`;
          error.config.headers["Authorization"] = `Bearer ${data.access.token}`;
          return axiosInstance(error.config);
        } catch (err) {
          reset();
          return Promise.reject(err);
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxios;
