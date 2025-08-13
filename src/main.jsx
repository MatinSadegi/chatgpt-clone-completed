import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { FlagProvider } from "@unleash/proxy-client-react";
import Homepage from "./routes/homepage/Homepage";
import DashboardPage from "./routes/dashboardPage/DashboardPage";
import ChatPage from "./routes/chatPage/ChatPage";
import RootLayout from "./layouts/rootLayout/RootLayout";
import DashboardLayout from "./layouts/dashboardLayout/DashboardLayout";

import AuthCard from "./components/auth/AuthCard";
import Test from "./routes/chatPage/Test";

const config = {
  url: "https://unleash-jiuzi1niis.product-managers.ir/api/frontend", // Your front-end API URL or the Unleash proxy's URL (https://<proxy-url>/proxy)
  clientKey:
    "*:production.d58662059eb65900d616580df83418bf99727f2f1cc19bdcc1d9b2c4", // A client-side API token OR one of your proxy's designated client keys (previously known as proxy secrets)
  refreshInterval: 10, // How often (in seconds) the client should poll the proxy for updates
  appName: "Default", // The name of your application. It's only used for identifying your application
};

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },

      {
        path: "/login/*",
        element: <AuthCard />,
      },
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/dashboard/chats/:id",
            element: <ChatPage />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <FlagProvider config={config}>
      <RouterProvider router={router} />
    </FlagProvider>
  </React.StrictMode>
);
document.dispatchEvent(new Event("custom-render-event"));
