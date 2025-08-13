import React from "react";
import { useAuth, useCodeVerify } from "../../hooks/api/auth";
import { useUserStore } from "../../store/auth";
import { englishNumberConvertor } from "../../utils/numberConverter";
// توجه: useRouter از next/navigation با useNavigate از react-router-dom جایگزین شد
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

// ۱. ایمپورت کردن فایل CSS جدید
import "./VerificationForm.css";
import { useTokens } from "../../store/turnstileToken";

const VerificationForm = ({
  setAction,
  mobileNumber,
  setAccessToken,
  token,
  action,
  fingerprintId,
  callbackUrl,
}) => {
  const { mutate, isPending } = useAuth();
  // ۲. استفاده از هوک useNavigate برای مسیریابی
  const navigate = useNavigate();
  const { setTokens } = useUserStore((state) => state);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    mutate(
      {
        mobileNumber,
        fingerprint: fingerprintId,
        code: data.confirmationCode,
      },
      {
        onSuccess: (data) => {
          handleConfirmationCode(data);
        },
      }
    );
  };

  const changeNumber = () => {
    setAction("mobile-number");
  };

  const handleConfirmationCode = (res) => {
    setAccessToken(res.access);
    console.log(res);

    if (res) {
      setTokens({
        access: res.data.access,
        refresh: res.data.refresh,
      });
      navigate(callbackUrl ? callbackUrl : "/dashboard");
    }
  };

  const handleChangeConfirmationCode = (e) => {
    const modifiedCode = englishNumberConvertor(e.target.value);
    if (!/^-?\d+$/.test(modifiedCode) && modifiedCode !== "") {
      setValue("confirmationCode", getValues("confirmationCode"));
      return;
    }
    setValue("confirmationCode", modifiedCode);
  };

  return (
    // ۴. Box به form با کلاس CSS تبدیل شد
    <form
      className="verification-form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* ۵. CardContent به div با کلاس CSS تبدیل شد */}
      <div className="verification-form-content">
        {/* ۶. Typography به تگ‌های p و button استاندارد تبدیل شد */}
        <p className="verification-subtitle">
          کد تایید ارسال شده به شماره موبایل {mobileNumber} را وارد کنید:
        </p>
        <button
          type="button"
          className="edit-number-button"
          onClick={changeNumber}
        >
          ویرایش شماره موبایل
        </button>

        {/* ۷. TextField به ساختار label و input استاندارد تبدیل شد */}
        <div className="textfield-container">
          <input
            placeholder="کد تایید"
            id="confirmationCode"
            type="tel"
            maxLength={6}
            className={`textfield-input text-center ${
              errors.confirmationCode ? "error" : ""
            }`}
            {...register("confirmationCode", {
              required: "کد تایید الزامی می باشد",
              pattern: {
                value: /^[0-9]+$/i,
                message: "کد تایید باید بصورت عددی باشد",
              },
              maxLength: {
                value: 6,
                message: "کد تایید باید 6 رقمی باشد ",
              },
            })}
            onChange={handleChangeConfirmationCode}
            disabled={isPending}
          />
          {errors.confirmationCode && (
            <p className="textfield-helper-text">
              {errors.confirmationCode.message}
            </p>
          )}
        </div>
      </div>
      {/* ۸. CardActions به div با کلاس CSS تبدیل شد */}
      <div className="verification-form-actions">
        {/* ۹. Button به button استاندارد تبدیل شد */}
        <button
          type="submit"
          className="verification-form-button"
          disabled={isPending}
        >
          تایید
        </button>
      </div>
    </form>
  );
};

export default VerificationForm;
