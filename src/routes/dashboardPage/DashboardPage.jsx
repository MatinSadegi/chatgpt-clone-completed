import React, { useState } from "react";
import { useCreateHistories } from "../../hooks/api/chat";
import { useChats } from "../../store/chat";
import { useNavigate } from "react-router-dom";
import "./dashboardPage.css";

function DashboardPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: createHistory } = useCreateHistories();

  const { setHistoryId, setInitialMessage } = useChats((state) => state);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const text = e.target.text.value;
    if (!text) {
      setIsLoading(false);
      return;
    }

    try {
      // ۱. تاریخچه خالی را بساز
      const history = await createHistory();
      const newHistoryId = history.data._id;
      console.log(text);

      // ۲. شناسه تاریخچه و متن پیام اول را در state سراسری ذخیره کن
      setHistoryId(newHistoryId);
      setInitialMessage(text);

      // ۳. کاربر را به صفحه چت منتقل کن
      navigate(`/dashboard/chats/${newHistoryId}`);
    } catch (error) {
      console.error("Failed to create new history:", error);
      alert("خطایی در شروع چت رخ داد، لطفا دوباره تلاش کنید.");
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboardPage">
      <div className="texts">
        <div className="logo">
          <img src="/logo.png" alt="" />
          <h1>های بات</h1>
        </div>
        {/* <div className="options">
          <div className="option">
            <img src="/chat.png" alt="" />
            <span>Create a New Chat</span>
          </div>
          <div className="option">
            <img src="/image.png" alt="" />
            <span>Analyze Images</span>
          </div>
          <div className="option">
            <img src="/code.png" alt="" />
            <span>Help me with my Code</span>
          </div>
        </div> */}
      </div>
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="text"
            placeholder="پیام خود را بنویسید..."
            disabled={isLoading}
            autoComplete="off"
          />
          <button type="submit" disabled={isLoading}>
            <img src="/arrow.png" alt="Send" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default DashboardPage;

// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import "./dashboardPage.css";
// import { useNavigate } from "react-router-dom";
// import { useTokens } from "../../store/turnstileToken";
// import { useSocket } from "../../context/SocketContext";
// import { useEffect, useRef, useState } from "react";
// import { useChats } from "../../store/chat";
// import { IKImage } from "imagekitio-react";
// import Markdown from "react-markdown";
// import { useCreateHistories } from "../../hooks/api/chat";

// const DashboardPage = () => {
//   const socket = useSocket();
//   const { historyId } = useChats((state) => state);
//   const navigate = useNavigate();
//   const {
//     isPending,
//     isSuccess,
//     mutateAsync: mutateCreateHistory,
//   } = useCreateHistories();

//   const [messages, setMessages] = useState([]);
//   const [inputValue, setInputValue] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [limitReached, setLimitReached] = useState(false);

//   const [img, setImg] = useState({
//     isLoading: false,
//     error: "",
//     dbData: {},
//   });

//   const endRef = useRef(null);

//   // --- Auto-scroll Effect ---
//   useEffect(() => {
//     endRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // --- Socket Event Listeners ---
//   useEffect(() => {
//     if (!socket) return;

//     // Listener برای پیام‌های استریم شده از ربات
//     const handleMessageStream = (data) => {
//       setIsLoading(false);
//       const streamedText = Object.values(data)
//         .filter((val) => typeof val === "string")
//         .join("");

//       setMessages((prevMessages) => {
//         const lastMessage = prevMessages[prevMessages.length - 1];
//         if (lastMessage && lastMessage.role === "assistant") {
//           const updatedMessages = [...prevMessages];
//           updatedMessages[prevMessages.length - 1] = {
//             ...lastMessage,
//             parts: [{ text: streamedText }],
//           };
//           return updatedMessages;
//         }
//         return prevMessages;
//       });
//     };
//     socket.on("MESSAGE", handleMessageStream);

//     // Listener برای دریافت پیام اتمام محدودیت
//     const handleAuthNeed = () => {
//       setIsLoading(false);
//       setLimitReached(true);
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "system",
//           parts: [
//             {
//               text: "محدودیت پیام‌های شما به پایان رسیده. لطفاً ثبت نام کنید.",
//             },
//           ],
//         },
//       ]);
//     };
//     socket.on("AUTH_NEED", handleAuthNeed);

//     // Cleanup listeners on component unmount
//     return () => {
//       socket.off("MESSAGE", handleMessageStream);
//       socket.off("AUTH_NEED", handleAuthNeed);
//     };
//   }, [socket]);

//   // --- Form Submission ---
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const text = inputValue.trim();
//     if (
//       (!text && !img.dbData?.filePath) ||
//       !socket ||
//       isLoading ||
//       limitReached
//     )
//       return;

//     const userMessage = {
//       role: "user",
//       parts: [{ text }],
//       img: img.dbData?.filePath || undefined,
//     };

//     const assistantPlaceholder = { role: "assistant", parts: [{ text: "" }] };

//     setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
//     setIsLoading(true);

//     socket.emit("ADD_MESSAGE", {
//       content: text,
//       historyId: historyId,
//       img: img.dbData?.filePath || undefined,
//     });

//     setInputValue("");
//     setImg({ isLoading: false, error: "", dbData: {} });
//   };

//   return (
//     <div className="dashboardPage">
//       {/* <div className="texts">
//         <div className="logo">
//           <img src="/logo.png" alt="" />
//           <h1>های بات</h1>
//         </div>
//         <div className="options">
//           <div className="option">
//             <img src="/chat.png" alt="" />
//             <span>Create a New Chat</span>
//           </div>
//           <div className="option">
//             <img src="/image.png" alt="" />
//             <span>Analyze Images</span>
//           </div>
//           <div className="option">
//             <img src="/code.png" alt="" />
//             <span>Help me with my Code</span>
//           </div>
//         </div>
//       </div> */}
//       <div className="chatPage">
//         <div className="wrapper">
//           <div className="chat">
//             {/* رندر کردن تاریخچه پیام‌ها */}
//             {messages.map((message, i) => (
//               <div
//                 className={`message ${message.role === "user" ? "user" : ""}`}
//                 key={i}
//               >
//                 {message.img && (
//                   <IKImage
//                     urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
//                     path={message.img}
//                     height="300"
//                     width="400"
//                   />
//                 )}
//                 {message.parts[0]?.text && (
//                   <Markdown>{message.parts[0].text}</Markdown>
//                 )}
//               </div>
//             ))}
//             {isLoading && <div className="message assistant">...</div>}
//             <div className="endChat" ref={endRef}></div>
//           </div>
//         </div>
//         <div className="formContainer">
//           {limitReached ? (
//             <div className="limitMessage">
//               محدودیت ۵ پیام رایگان شما به پایان رسیده است. برای ادامه لطفاً{" "}
//               <a href="/sign-up">ثبت نام</a> کنید.
//             </div>
//           ) : (
//             <form onSubmit={handleSubmit}>
//               <input
//                 type="text"
//                 name="text"
//                 placeholder="پیام خود را بنویسید..."
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 disabled={isLoading}
//               />
//               <button type="submit" disabled={isLoading}>
//                 <img src="/arrow.png" alt="Send" />
//               </button>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;
