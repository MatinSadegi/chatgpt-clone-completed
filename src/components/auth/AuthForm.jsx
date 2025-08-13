import { useAuth } from "../../hooks/api/auth";
import { englishNumberConvertor } from "../../utils/numberConverter";
import { useForm } from "react-hook-form";
import TurnstileForm from "./TurnstileForm";
import { useTokens, useTurnstileToken } from "../../store/turnstileToken";
// توجه: وابستگی به Next.js با معادل آن در React جایگزین شد
import { useUnleashContext, useFlag } from "@unleash/proxy-client-react";
import "./authForm.css";
import { useSnackbar } from "notistack";

const AuthForm = ({
  setMobileNumber,
  setAction,
  setToken,
  fingerprintId,
  setIsCorrectMobileNumber,
  isCorrectMobileNumber,
  mobileNumber = "",
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const turnstileToken = useTurnstileToken((state) => state.turnstileToken);
  const setTurnstileToken = useTurnstileToken(
    (state) => state.setNewTurnstileToken
  );
  const updateContext = useUnleashContext();
  const isActive = useFlag("USE_TURNSTILE_CLOUDFLARE");

  const { mutateAsync, isPending } = useAuth();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  // منطق فرم بدون تغییر باقی مانده است
  const onSubmit = async (data) => {
    const res = await mutateAsync(
      isActive
        ? {
            mobileNumber: data.mobileNumber,
            // cloudflareTurnstileResponse: turnstileToken,
            fingerprint: fingerprintId,
          }
        : {
            mobileNumber: data.mobileNumber,
            fingerprint: fingerprintId,
          }
    );
    try {
      if (res) {
        setAction("OTP");
        setMobileNumber(data.mobileNumber);
        setTurnstileToken(null);
      }
    } catch (error) {
      enqueueSnackbar("مجدد امتحان کنید", {
        variant: "error",
      });
    }
  };

  const handleChangeMobileNumber = (e) => {
    const modifiedMobileNumber = englishNumberConvertor(e.target.value);
    if (!/^-?\d+$/.test(modifiedMobileNumber) && modifiedMobileNumber !== "") {
      setValue("mobileNumber", getValues("mobileNumber"));
      return;
    }
    setValue("mobileNumber", modifiedMobileNumber);
    if (e.target.value.length === 11) {
      updateContext({ userId: e.target.value });
      setIsCorrectMobileNumber(true);
    } else {
      setIsCorrectMobileNumber(false);
    }
  };

  return (
    <div className="auth-form-container">
      <form
        className="auth-form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* ۳. CardContent به div با کلاس CSS تبدیل شد */}
        <div className="auth-form-content">
          {/* ۴. Typography به تگ‌های h1 و p استاندارد تبدیل شد */}
          <h1 className="auth-form-title">ورود | ثبت نام</h1>
          <p className="auth-form-subtitle">
            برای ثبت نام شماره موبایل خود را وارد کنید.
          </p>

          {/* ۵. TextField به ساختار label و input استاندارد تبدیل شد */}
          <div className="textfield-container">
            {/* <label htmlFor="mobileNumber" className="textfield-label">
              شماره موبایل
            </label> */}
            <input
              id="mobileNumber"
              type="tel" // type="tel" برای شماره موبایل مناسب‌تر است
              autoComplete="username"
              defaultValue={mobileNumber}
              maxLength={11}
              className={`textfield-input ${
                errors.mobileNumber ? "error" : ""
              }`}
              {...register("mobileNumber", {
                required: "شماره موبایل اجباری است",
                pattern: {
                  value: /^09\d{9}$/,
                  message: "شماره موبایل باید عددی و با 09 شروع شده باشد",
                },
                minLength: {
                  value: 11,
                  message: "شماره موبایل باید 11 رقمی باشد ",
                },
              })}
              onChange={handleChangeMobileNumber}
              disabled={isPending}
            />
            {errors.mobileNumber && (
              <p className="textfield-helper-text">
                {errors.mobileNumber.message}
              </p>
            )}
          </div>

          <TurnstileForm
            isCorrectMobileNumber={isCorrectMobileNumber}
            isActive={isActive}
          />
        </div>
        {/* ۶. CardActions به div با کلاس CSS تبدیل شد */}
        <div className="auth-form-actions">
          {/* ۷. Button به button استاندارد تبدیل شد */}
          <button
            type="submit"
            className="auth-form-button"
            disabled={
              ((isCorrectMobileNumber && !isActive) ||
              (turnstileToken && isCorrectMobileNumber)
                ? false
                : true) || isPending
            }
          >
            ادامه
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
