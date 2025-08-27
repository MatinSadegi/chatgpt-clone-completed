import { Link, useNavigate } from "react-router-dom";
import "./homepage.css";
import { TypeAnimation } from "react-type-animation";
import { useEffect, useState } from "react";
import useMediaQuery from "../../hooks/useMediaQuery";

const Homepage = () => {
  const [typingStatus, setTypingStatus] = useState("human1");
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 900px)");
  return (
    <div className="homepage">
      {!isMobile && (
        <img src="/orbital.png" alt="های-بات" className="orbital" />
      )}

      <div className="left">
        <h1>های بات</h1>
        <h2>مکالمه را شروع کنید</h2>
        <h3>
          دستیار هوش مصنوعی شما برای پاسخ به هر سوال و انجام هر کاری آماده است.
        </h3>
        <button
          className="getStarted"
          onClick={async () => {
            navigate(`/dashboard`);
          }}
        >
          شروع کنید
        </button>
      </div>
      <div className="right">
        <div className="imgContainer">
          <div className="bgContainer">
            <div className="bg"></div>
          </div>
          <img src="/bot.png" alt="" className="bot" />
          <div className="chat">
            <img
              src={
                typingStatus === "human1"
                  ? "/human1.jpeg"
                  : typingStatus === "human2"
                  ? "/human2.jpeg"
                  : "bot.png"
              }
              alt=""
            />
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                "کاربر: بلندترین قله جهان چیه؟",
                2000,
                () => {
                  setTypingStatus("bot");
                },
                "بات: بلندترین قله جهان قله اورست است که در رشته کوه‌های هیمالیا قرار دارد و ارتفاع آن ۸٬۸۴۸ متر از سطح دریاست.",
                2000,
                () => {
                  setTypingStatus("human2");
                },
                "کاربر: چطور می‌تونم در جاوا اسکریپت تاریخ امروز رو بگیرم؟",
                2000,
                () => {
                  setTypingStatus("bot");
                },
                "بات: خیلی ساده! می‌تونید از این کد استفاده کنید: const today = new Date(); این دستور یک آبجکت از نوع تاریخ با اطلاعات کامل امروز به شما می‌دهد.",
                2000,
                () => {
                  setTypingStatus("human1");
                },
              ]}
              wrapper="span"
              repeat={Infinity}
              cursor={true}
              omitDeletionAnimation={true}
            />
          </div>
        </div>
      </div>
      <div className="terms">
        {/* <img src="/logo.png" alt="" />
        <div className="links">
          <Link to="/">حریم خصوصی</Link>
        </div> */}
      </div>
    </div>
  );
};

export default Homepage;
