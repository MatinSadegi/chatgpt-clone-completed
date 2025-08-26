import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useUserStore } from "../store/auth";
import { useTokens } from "../store/turnstileToken";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { auth, user, tokens } = useUserStore((state) => state);
  const { tempToken } = useTokens((state) => state);

  useEffect(() => {
    let newSocket;

    const isUserAuthenticated = auth();
    const guestToken = tempToken?.accessToken?.token;

    if (isUserAuthenticated || guestToken) {
      const query = {
        authorization: isUserAuthenticated ? tokens.access.token : guestToken,
      };

      newSocket = io(import.meta.env.VITE_SOCKET_URL, {
        query: query, // Pass the correctly constructed query object
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 15000,
        reconnectionDelayMax: 15000,
        timeout: 10000,
      });

      newSocket.on("connect", () => {
        console.log("Connected as:", newSocket.id);
      });

      newSocket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      newSocket.on("connect_error", (err) => {
        console.error("Socket Connection Error:", err.message);
      });

      setSocket(newSocket);
    }
    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, [auth, tempToken, user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
