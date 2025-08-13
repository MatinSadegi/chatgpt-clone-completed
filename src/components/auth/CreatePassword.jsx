import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
// توجه: useRouter از next/navigation با useNavigate از react-router-dom جایگزین شد
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useCreatePassword } from "../../hooks/api/auth";
import "./createPassword.css";

function CreatePassword({ accessToken }) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const { mutateAsync, isPending: resetIsMutating } = useCreatePassword();
  // ۲. استفاده از هوک useNavigate برای مسیریابی
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const passwordRegex = /^[A-Za-z\d@$!%*?&-_()'"#:;=\^\/\[\]]{8,}$/;

  const submitForm = async (data) => {
    const response = await mutateAsync({
      type: "set",
      token: accessToken.token,
      password: data.password,
    });

    if (response) {
      enqueueSnackbar("رمز عبور با موفقیت ایجاد شد.", {
        variant: "success",
      });
      // ۳. router.push به navigate تغییر یافت
      navigate("/panel");
    }
  };
  const password = watch("password");
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    // ۴. Box به form با کلاس CSS تبدیل شد
    <form
      className="create-password-form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(submitForm)}
    >
      {/* ۵. CardContent به div با کلاس CSS تبدیل شد */}
      <div className="form-content">
        {/* ۶. Typography به تگ‌های h1 و span استاندارد تبدیل شد */}
        <h1 className="form-title">تعریف رمز عبور</h1>
        <div className="password-rules-container">
          <span className="password-rule">
            * رمز عبور باید حداقل ۸ کاراکتر داشته باشد
          </span>
          <span className="password-rule">
            * رمز عبور باید حداقل یک حرف بزرگ داشته باشد
          </span>
        </div>

        {/* ۷. Controller و TextField به ساختار سفارشی با CSS تبدیل شدند */}
        <Controller
          name="password"
          control={control}
          defaultValue=""
          rules={{
            required: "رمز عبور را وارد کنید",
            minLength: {
              value: 8,
              message: "رمز عبور باید حداقل ۸ کاراکتر داشته باشد",
            },
            pattern: {
              value: passwordRegex,
              message: "رمز عبور باید شامل حروف بزرگ و عدد باشد",
            },
          }}
          render={({ field }) => (
            <div className="textfield-container">
              <label htmlFor="password">رمز عبور</label>
              <div className="input-wrapper">
                <input
                  {...field}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`textfield-input ltr ${
                    errors.password ? "error" : ""
                  }`}
                  autoComplete="new-password"
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
        <Controller
          name="confirmPassword"
          defaultValue=""
          control={control}
          rules={{
            required: "تایید رمز عبور الزامی است",
            validate: (value) =>
              value === password || "رمزهای عبور مطابقت ندارند",
          }}
          render={({ field }) => (
            <div className="textfield-container">
              <label htmlFor="confirmPassword">تایید رمز عبور</label>
              <div className="input-wrapper">
                <input
                  {...field}
                  id="confirmPassword"
                  autoComplete="new-password"
                  type={showPassword ? "text" : "password"}
                  className={`textfield-input ltr ${
                    errors.confirmPassword ? "error" : ""
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="textfield-helper-text">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      {/* ۸. CardActions به div و Button به button تبدیل شد */}
      <div className="form-actions">
        <button
          type="submit"
          className="submit-button"
          disabled={resetIsMutating}
        >
          ادامه
        </button>
      </div>
    </form>
  );
}

export default CreatePassword;
