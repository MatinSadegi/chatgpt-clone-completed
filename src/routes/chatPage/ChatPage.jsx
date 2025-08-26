import { useEffect, useRef, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { useChats } from "../../store/chat";
import { data, useParams } from "react-router-dom";
import { IKImage } from "imagekitio-react";
import Markdown from "react-markdown";
import "./chatPage.css"; // اطمینان حاصل کنید که این فایل CSS وجود دارد
import { useGetChats } from "../../hooks/api/chat";
import { FaStop } from "react-icons/fa6";
import { FaArrowUp } from "react-icons/fa";

const ChatPage = () => {
  const socket = useSocket();
  const {
    historyId: newChatHistoryId,
    initialMessage,
    clearInitialMessage,
  } = useChats((state) => state);
  const { id: existingChatId } = useParams(); // ۱. ID را از پارامتر URL بخوان

  // ID نهایی یا از URL می‌آید (برای چت‌های موجود) یا از store (برای چت جدید)
  const historyId = existingChatId || newChatHistoryId;

  // ۲. فراخوانی هوک API برای دریافت تاریخچه چت‌های موجود
  const {
    data: initialHistory,
    isLoading: isHistoryLoading,
    isError,
  } = useGetChats({ historyId });
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isBotLoading, setIsBotLoading] = useState(false);
  const [isBotAnswering, setIsBotAnswering] = useState(false);
  const [limitReached, setLimitReached] = useState(false); // این state را اضافه کنید
  const endRef = useRef(null);
  const effectRan = useRef(false);
  const currentHistoryId = useRef(historyId);
  const isInitialStateSet = useRef(false);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    isInitialStateSet.current = false;
  }, [existingChatId]); // وابستگی به ID از URL

  useEffect(() => {
    if (currentHistoryId.current !== historyId) {
      setMessages([]);
      effectRan.current = false;
      currentHistoryId.current = historyId;
    }

    if (effectRan.current) return;
    // سناریو ۱: شروع یک چت جدید
    if (initialMessage) {
      console.log("first", initialMessage);

      const userMessage = { role: "user", parts: [{ text: initialMessage }] };
      const assistantPlaceholder = {
        role: "assistant",
        parts: [{ text: "" }],
      };
      setMessages([userMessage, assistantPlaceholder]);
      setIsBotAnswering(true);
      setIsBotLoading(true);
      if (socket) {
        socket.emit("ADD_MESSAGE", { content: initialMessage, historyId });
        clearInitialMessage();
        effectRan.current = true;
      }
      isInitialStateSet.current = true;
    }
    // سناریو ۲: باز کردن یک چت موجود
    else if (initialHistory?.results) {
      const formattedMessages = initialHistory.results
        .map((apiMessage) => ({
          role: apiMessage.forMe ? "user" : "assistant",
          parts: [{ text: apiMessage.content }],
        }))
        .reverse();
      setMessages(formattedMessages);
      effectRan.current = true;
      isInitialStateSet.current = true;
    }
  }, [initialHistory, initialMessage, socket, historyId, clearInitialMessage]);
  useEffect(() => {
    if (!socket) return;

    const handleMessageStream = (data) => {
      setIsBotLoading(false);
      const streamedText = Object.values(data)
        .filter((val) => typeof val === "string")
        .join("");

      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.role === "assistant") {
          const updated = [...prev];
          // --- FIX: Ensure consistent data structure ---
          updated[prev.length - 1] = {
            ...lastMessage,
            parts: [{ text: streamedText }],
          };
          return updated;
        }
        return prev;
      });
    };
    const handleMessageEnd = () => {
      setIsBotAnswering(false);
      console.log("dsadasd");
    };
    const handleAuthNeed = () => {
      console.log("first");

      setIsBotLoading(false);
      setLimitReached(true);
      // setMessages((prev) => [
      //   ...prev,
      //   {
      //     role: "system",
      //     parts: [
      //       {
      //         text: "محدودیت پیام‌های شما به پایان رسیده. لطفاً ثبت نام کنید.",
      //       },
      //     ],
      //   },
      // ]);
    };

    socket.on("MESSAGE", handleMessageStream);
    socket.on("MESSAGE_END", handleMessageEnd);
    socket.on("AUTH_NEED", handleAuthNeed);

    return () => {
      socket.off("MESSAGE", handleMessageStream);
      socket.off("AUTH_NEED", handleAuthNeed);
      socket.off("MESSAGE_END", handleMessageEnd);
    };
  }, [socket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text || !socket || isBotLoading || limitReached) return;

    // --- FIX: Ensure consistent data structure ---
    const userMessage = { role: "user", parts: [{ text: text }] };
    const assistantPlaceholder = { role: "assistant", parts: [{ text: "" }] };

    setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
    setIsBotLoading(true);
    setIsBotAnswering(true);

    socket.emit("ADD_MESSAGE", { content: text, historyId });
    setInputValue("");
  };

  const handleStop = (e) => {
    if (!socket) return;
    e.preventDefault();
    socket.emit("CANCEL_MESSAGE");

    setIsBotAnswering(false);
    // setInputValue("");
  };

  if (isHistoryLoading && !isInitialStateSet.current) {
    return (
      <div className="loader2Div">
        <span className="loader2"></span>
      </div>
    );
  }

  if (isError) {
    return <div className="error-message">خطا در دریافت اطلاعات چت!</div>;
  }
  // console.log(
  //   existingChatId,
  //   isInitialStateSet.current,
  //   initialHistory?.results,
  //   historyId,
  //   clearInitialMessage,
  //   isInitialStateSet.current
  // );
  return (
    <div className="dashboardPage">
      <div className="chatPage">
        <div className="wrapper">
          <div className="chat">
            {messages.map((message, i) => (
              <div
                className={`message ${message.role}`} // 클래스 이름을 간단하게
                key={i}
              >
                {message.img && (
                  <IKImage
                    urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                    path={message.img}
                    height="300"
                    width="400"
                  />
                )}
                {/* حالا این شرط به درستی کار می‌کند */}
                {message.parts?.[0]?.text && (
                  <Markdown>{message.parts[0].text}</Markdown>
                )}
              </div>
            ))}
            {isBotLoading && (
              <div className="loaderDiv">
                <span className="loader"></span>
              </div>
            )}

            <div ref={endRef} />
          </div>
        </div>
        <div className="formContainer">
          {limitReached ? (
            <div className="limitMessage">
              محدودیت پیام‌های شما به پایان رسیده است. برای ادامه لطفاً{" "}
              <a href="/sign-up">ثبت نام</a> کنید.
            </div>
          ) : (
            <form onSubmit={isBotAnswering ? handleStop : handleSubmit}>
              <input
                type="text"
                name="text"
                placeholder="پیام خود را بنویسید..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isBotLoading || isBotAnswering}
              />
              <button
                type="submit"
                disabled={isBotLoading}
                style={{ cursor: isBotLoading ? "auto" : "pointer" }}
              >
                {isBotAnswering && !isBotLoading ? (
                  <FaStop size={18} color="white" />
                ) : (
                  <FaArrowUp
                    size={18}
                    color={isBotLoading ? "#ffffff66" : "#ffffff"}
                  />
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
