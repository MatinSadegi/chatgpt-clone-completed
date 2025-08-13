import { useMutation, useQuery } from "@tanstack/react-query";
import useAxios from "../axios";

export const useUpdateAvatar = () => {
  const instanceWithToken = useAxios();

  return useMutation({
    mutationFn: async (file) => {
      let bodyFormData = new FormData();
      bodyFormData.append("avatar", file);

      const { data } = await instanceWithToken.post(
        "user/upload/avatar",
        bodyFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    },
  });
};

export const useUpdateProfile = () => {
  const instanceWithToken = useAxios();

  return useMutation({
    mutationFn: async (body) => {
      const { data } = await instanceWithToken.post("user/me", body);
      return data;
    },
  });
};

export const useGetUserProfile = (params) => {
  const instanceWithToken = useAxios();

  return useQuery({
    queryKey: ["getUserProfile", params],
    queryFn: async () => {
      const { data } = await instanceWithToken.get("teacher/profile", {
        params,
      });
      return data;
    },
  });
};

export const useGetUser = (params) => {
  const instanceWithToken = useAxios();

  return useQuery({
    queryKey: ["getUser", params],
    queryFn: async () => {
      const { data } = await instanceWithToken.get("user/me", {
        params,
      });
      return data;
    },
  });
};

export const useUserData = () => {
  const instanceWithToken = useAxios();

  return useMutation({
    mutationFn: async (body) => {
      const { data } = await instanceWithToken.get("user/me", body);
      return data;
    },
  });
};
