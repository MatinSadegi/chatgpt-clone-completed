import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../axios";

export const useGetHistories = (params) => {
  const instanceWithToken = useAxios();

  return useQuery({
    queryKey: ["history"],
    queryFn: async () => {
      const { data } = await instanceWithToken.get("histories", {
        params,
      });
      return data;
    },
  });
};

export const useCreateHistories = () => {
  const instanceWithToken = useAxios();

  return useMutation({
    mutationFn: async (body) => {
      const { data } = await instanceWithToken.post("histories", body);

      return data;
    },
  });
};

export const useGetChats = (params) => {
  const instanceWithToken = useAxios();

  return useQuery({
    queryKey: ["chats", params],
    queryFn: async () => {
      const { data } = await instanceWithToken.get("chats", {
        params,
      });

      return data;
    },
  });
};

export const useDeleteHistory = () => {
  const instanceWithToken = useAxios();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body) => {
      const { data } = await instanceWithToken.delete(`/histories/${body.id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
};
