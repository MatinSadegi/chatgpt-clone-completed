import { create } from "zustand";

export const useTokens = create((set) => ({
  tokens: {},
  fingerprint: "",
  tempToken: "",
  setTempToken: (newTempToken) => set(() => ({ tempToken: newTempToken })),
  setTokens: (newTokens) => set(() => ({ tokens: newTokens })),
  setFingerprint: (newFingerprint) =>
    set(() => ({ fingerprint: newFingerprint })),
}));

export const useTurnstileToken = create((set) => ({
  turnstileToken: null,
  setNewTurnstileToken: (newToken) => set(() => ({ turnstileToken: newToken })),
}));
