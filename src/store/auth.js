import isEmptyObject from "../utils/isEmptyObject";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: {},
      tokens: {},
      setTokens: (newData) =>
        set(() => ({
          tokens: { ...newData },
        })),
      setUser: (newData) =>
        set((state) => ({
          user: { ...state.user, ...newData },
        })),
      reset: () => {
        set({ user: {}, tokens: {} });
      },
      auth: () => {
        const { tokens } = get();
        return !isEmptyObject(tokens);
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
