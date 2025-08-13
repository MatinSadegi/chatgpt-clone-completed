import { instance } from "../../utils/api";
import { useMutation } from "@tanstack/react-query";
import useAxios from "../axios";

export const useAuth = () => {
  return useMutation({
    mutationFn: async (body) => {
      const { data } = await instance.post("auth", body);
      return data;
    },
  });
};

export const useGetTempToken = () => {
  return useMutation({
    mutationFn: async (body) => {
      const { data } = await instance.post("auth/tempToken", body);
      return data;
    },
  });
};

export const useLogout = () => {
  const instanceWithToken = useAxios();

  return useMutation({
    mutationFn: async () => {
      const { data } = await instanceWithToken.post("auth/logout");
      return data;
    },
  });
};

export const useSendVerificationCode = () => {
  return useMutation({
    mutationFn: async (body) => {
      const { data } = await instance.post("auth/send-verification-code", body);
      return data;
    },
  });
};

export const useCodeVerify = () => {
  return useMutation({
    mutationFn: async (body) => {
      const { data } = await instance.post("auth/verify-code", body);
      return data;
    },
  });
};

export const useCreatePassword = () => {
  return useMutation({
    mutationKey: ["auth/password"],
    mutationFn: async (body) => {
      const { token, ...bodyData } = body;
      const { data } = await instance.post("auth/password", bodyData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return data;
    },
  });
};
