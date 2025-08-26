import { Link, useNavigate } from "react-router-dom";
import "./chatList.css";

import { useDeleteHistory, useGetHistories } from "../../hooks/api/chat";
import { useState } from "react";
import { LuTrash } from "react-icons/lu";
import { useUserStore } from "../../store/auth";
import { useChats } from "../../store/chat";
import { useLogout } from "../../hooks/api/auth";

const ChatList = () => {
  const navigate = useNavigate();
  const { data, isPending, isError, error } = useGetHistories();
  const { auth } = useUserStore((state) => state);
  const { mutate } = useLogout();
  const { mutateAsync: deleteChat } = useDeleteHistory();
  const { setHistoryId } = useChats((state) => state);

  const handleDeleteChat = async (e, chatId) => {
    e.preventDefault();
    e.stopPropagation();
    await deleteChat({ id: chatId });
  };

  const handleNavigate = (chatId) => {
    setHistoryId(chatId);
  };

  const handleLogout = () => {
    mutate();
    navigate("/");
    localStorage.removeItem("auth-storage");
  };

  return (
    <div className="chatList">
      <span className="title">داشبورد</span>
      <Link to="/dashboard">ایجاد چت جدید</Link>
      <hr />
      <span className="title">آخرین چت‌ها</span>
      <div className="list">
        {isPending
          ? "در حال بارگذاری..."
          : error
          ? "خطایی رخ داده است!"
          : data?.results?.map((chat) => (
              <Link
                to={`dashboard/chats/${chat._id}`} // <-- مسیر صحیح را اینجا قرار دهید
                className="resentChat"
                key={chat._id}
                onClick={() => handleNavigate(chat._id)}
              >
                <span className="chat-title">
                  {chat.title.replace(/^"|"$/g, "")}
                </span>
                <button
                  className="options-button"
                  onClick={(e) => handleDeleteChat(e, chat._id)}
                >
                  <LuTrash />
                </button>
              </Link>
            ))}
      </div>
      <hr />
      <div className="signup-section">
        {auth() ? (
          <button className="logout-button btn" onClick={() => handleLogout()}>
            خروج
          </button>
        ) : (
          <div className="login">
            <div className="texts">
              <span>برای استفاده نامحدود ثبت نام کنید.</span>
            </div>
            <Link to="/login" className="signup-button btn">
              ثبت نام
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
