// import { Outlet, useNavigate } from "react-router-dom";
// import { useLocation } from "react-router-dom";
// import "./dashboardLayout.css";

// import { useEffect } from "react";
// import ChatList from "../../components/chatList/ChatList";
// import { useUserStore } from "../../store/auth";
// import { SocketProvider } from "../../context/SocketContext";
// import { useChats } from "../../store/chat";
// import { useTokens } from "../../store/turnstileToken";
// import { useCreateHistories } from "../../hooks/api/chat";
// import { useGetTempToken } from "../../hooks/api/auth";
// import FingerprintJS from "@fingerprintjs/fingerprintjs";

// const DashboardLayout = () => {
//   const { fingerprint } = useTokens((state) => state);
//   // const { historyId } = useChats((state) => state);
//   const { user, reset, auth } = useUserStore((state) => state);
//   // console.log(historyId);

//   const location = useLocation();
//   const navigate = useNavigate();

//   // useEffect(() => {
//   //   if (!auth() && !fingerprint) {
//   //     navigate("/sign-in");
//   //   }
//   // }, [user, fingerprint, navigate]);

//   const { setFingerprint, setTempToken, tempToken } = useTokens(
//     (state) => state
//   );

//   const { mutateAsync } = useGetTempToken();

//   useEffect(() => {
//     const getVisitorId = async () => {
//       try {
//         const fp = await FingerprintJS.load();
//         const result = await fp.get();
//         setFingerprint(result.visitorId);

//         const res = await mutateAsync({
//           fingerprint: result.visitorId,
//         });

//         setTempToken({
//           accessToken: res.data.access,
//           refreshToken: res.data.refresh,
//         });
//       } catch (error) {
//         console.error("Error getting visitor ID", error);
//       }
//     };
//     if (!auth()) {
//       getVisitorId();
//     }
//   }, []);

//   return (
//     <SocketProvider>
//       <div className="dashboardLayout">
//         <div className="content">
//           <Outlet />
//         </div>
//         <div className="menu">{(tempToken || auth()) && <ChatList />}</div>
//       </div>
//     </SocketProvider>
//   );
// };

// export default DashboardLayout;

const DashboardLayout = () => {
  return <div></div>;
};

export default DashboardLayout;
