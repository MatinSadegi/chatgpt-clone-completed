import { Link, Outlet, useLocation } from "react-router-dom";
import "./rootLayout.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUserStore } from "../../store/auth";

const queryClient = new QueryClient();

const RootLayout = () => {
  const { user, reset, auth } = useUserStore((state) => state);
  const { pathname } = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="rootLayout">
        <header>
          <Link to="/" className="logo">
            <img src="/logo.png" alt="" />
          </Link>
          {pathname === "/" && !auth() && (
            <div className="signup-section btn" style={{ marginTop: "5px" }}>
              <Link to="/login" className="signup-button">
                ثبت نام
              </Link>
            </div>
          )}
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default RootLayout;
