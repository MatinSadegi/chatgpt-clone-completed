import React, { useState } from "react";
import { useCreateHistories } from "../../hooks/api/chat";
import { useChats } from "../../store/chat";
import { useNavigate } from "react-router-dom";

function Test() {
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
        <div className="options">
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
        </div>
      </div>
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="text"
            placeholder="پیام خود را بنویسید..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            <img src="/arrow.png" alt="Send" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Test;
