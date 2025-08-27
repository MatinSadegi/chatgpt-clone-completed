import { Link, Outlet, useLocation } from "react-router-dom";
import "./rootLayout.css";
import { RxHamburgerMenu } from "react-icons/rx";
import { PiPencilSimpleLineBold } from "react-icons/pi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUserStore } from "../../store/auth";
import useMediaQuery from "../../hooks/useMediaQuery";
import { useUiStore } from "../../store/menu";

const queryClient = new QueryClient();

const RootLayout = () => {
  const { user, reset, auth } = useUserStore((state) => state);
  const { pathname } = useLocation();
  const isMobile = useMediaQuery("(max-width: 900px)");
  const { toggleMenu } = useUiStore((state) => state);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="rootLayout">
        <header>
          {isMobile ? (
            <Link to="/dashboard">
              <PiPencilSimpleLineBold size={22} />
            </Link>
          ) : (
            <Link to="/" className="logo">
              <img src="/logo.png" alt="Logo" />
            </Link>
          )}
          {pathname === "/" && !auth() && (
            <div className="signup-section btn" style={{ marginTop: "5px" }}>
              <Link to="/login" className="signup-button">
                ثبت نام
              </Link>
            </div>
          )}
          {isMobile && pathname !== "/" && (
            <div className="hamburger-menu" onClick={toggleMenu}>
              <RxHamburgerMenu size={28} />
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
