import React from "react";
import LoginWithPassword from "./LoginWithPassword";
import { useSendVerificationCode } from "../../hooks/api/auth";
import VerificationForm from "./VerificationForm";

// ۱. ایمپورت کردن فایل CSS جدید
import "./chooseLoginSystem.css";

function ChooseLoginSystem({
  setAction,
  token,
  action,
  mobileNumber,
  setToken,
  setAccessToken,
  setIsCorrectMobileNumber,
}) {
  const { mutateAsync } = useSendVerificationCode();
  const sendOTP = async () => {
    // منطق کامپوننت بدون تغییر باقی مانده است
    if (action === "enterPassword") {
      setAction("numberVerify");
      const res = await mutateAsync({
        mobileNumber,
      });
      setToken(res?.token);
    }
  };

  return (
    <>
      {/* ۲. کامپوننت Box به یک div با کلاس برای تب‌ها تبدیل شد */}
      <div className="login-choice-tabs">
        {/* ۳. Typography های قابل کلیک به button تبدیل شدند */}
        <button
          type="button"
          onClick={() => setAction("enterPassword")}
          // ۴. استایل‌های شرطی با استفاده از یک کلاس 'active' پیاده‌سازی شدند
          className={`login-choice-tab ${
            action === "enterPassword" ? "active" : ""
          }`}
        >
          استفاده از رمز
        </button>
        <button
          type="button"
          onClick={() => sendOTP()}
          className={`login-choice-tab ${
            action === "numberVerify" ? "active" : ""
          }`}
        >
          استفاده از کد تایید
        </button>
      </div>

      {/* ۵. این Box به یک div برای نمایش فرم‌ها تبدیل شد */}
      <div className="login-form-container">
        {/* منطق نمایش شرطی کامپوننت‌ها بدون تغییر باقی مانده است */}
        {action === "enterPassword" && (
          <LoginWithPassword
            setAction={setAction}
            mobileNumber={mobileNumber}
            setIsCorrectMobileNumber={setIsCorrectMobileNumber}
          />
        )}
        {action === "numberVerify" && (
          <VerificationForm
            setAction={setAction}
            mobileNumber={mobileNumber}
            token={token}
            action={action}
            setAccessToken={setAccessToken}
            setIsCorrectMobileNumber={setIsCorrectMobileNumber}
          />
        )}
      </div>
    </>
  );
}

export default ChooseLoginSystem;
