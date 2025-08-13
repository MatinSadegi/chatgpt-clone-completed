import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
// توجه: هوک‌های next/navigation با معادل آن‌ها در react-router-dom جایگزین شدند
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useCodeVerify } from "../../hooks/api/auth";
import { useUserStore } from "../../store/auth";
import "./loginWithPassword.css";

const LoginWithPassword = ({
  setAction,
  mobileNumber,
  setIsCorrectMobileNumber,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { password: "" },
  });
  const { mutateAsync, isPending: verifyIsMutating } = useCodeVerify();
  // ۲. استفاده از هوک‌های react-router-dom
  const navigate = useNavigate();
  const { setTokens } = useUserStore((state) => state);
  const [searchParams] = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [showPassword, setShowPassword] = useState(false);
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const submitForm = async ({ password }) => {
    const res = await mutateAsync({
      mobileNumber: mobileNumber,
      password: password,
    });

    if (res) {
      setTokens({
        access: res.access,
        refresh: res.refresh,
      });
      const redirectPath = res.isFirstTimeLogin
        ? "/panel/profile"
        : callbackUrl || "/panel";
      // ۳. router.push به navigate تغییر یافت
      navigate(redirectPath);
    }
  };

  return (
    // ۴. Box به form با کلاس CSS تبدیل شد
    <form
      className="login-password-form"
      noValidate
      onSubmit={handleSubmit(submitForm)}
      autoComplete="on"
    >
      {/* ۵. CardContent به div تبدیل شد */}
      <div className="form-content">
        <Controller
          name="password"
          control={control}
          rules={{
            required: "رمز عبور را وارد کنید",
            minLength: {
              value: 8,
              message: "رمز عبور باید حداقل ۸ کاراکتر داشته باشد",
            },
            pattern: {
              value: passwordRegex,
              message: "رمز عبور باید شامل حروف و عدد باشد",
            },
          }}
          render={({ field }) => (
            // ۶. استفاده از همان ساختار سفارشی برای فیلد رمز عبور
            <div className="textfield-container">
              <label htmlFor="password">رمز عبور</label>
              <div className="input-wrapper">
                <input
                  {...field}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className={`textfield-input ltr ${
                    errors.password ? "error" : ""
                  }`}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <FaEyeSlash size={17} />
                  ) : (
                    <FaEye size={17} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="textfield-helper-text">
                  {errors.password.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      {/* ۷. CardActions به div و Button به button تبدیل شد */}
      <div className="form-actions">
        <button
          type="submit"
          className="submit-button"
          disabled={verifyIsMutating}
        >
          ادامه
        </button>
      </div>

      {/* ۸. Box مربوط به "فراموشی رمز" به div تبدیل شد */}
      <div className="forgot-password-container">
        {/* ۹. Typography به یک button برای دسترسی‌پذیری بهتر تبدیل شد */}
        <button
          type="button"
          className="forgot-password-link"
          onClick={() => {
            setAction("forgot");
            setIsCorrectMobileNumber(true);
          }}
        >
          فراموشی رمز عبور؟
        </button>
      </div>
    </form>
  );
};

export default LoginWithPassword;
