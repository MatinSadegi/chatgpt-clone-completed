import React, { useEffect, useState } from "react";

import ChooseLoginSystem from "./ChooseLoginSystem";
import CreatePassword from "./CreatePassword";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthForm from "./AuthForm";
import VerificationForm from "./VerificationForm";
import { useUserStore } from "../../store/auth";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
function AuthCard() {
  const [mobileNumber, setMobileNumber] = useState(null);
  const [token, setToken] = useState(null);
  const [fingerprintId, setFingerprintId] = useState("");
  const [action, setAction] = useState("mobile-number");
  const [accessToken, setAccessToken] = useState();
  const [isCorrectMobileNumber, setIsCorrectMobileNumber] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const callbackUrl = searchParams.get("callbackUrl");
  const { user } = useUserStore((state) => state);
  useEffect(() => {
    const getVisitorId = async () => {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        setFingerprintId(result.visitorId);
      } catch (error) {
        console.error("Error getting visitor ID", error);
      }
    };
    getVisitorId();
  }, []);

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      navigate(callbackUrl ? callbackUrl : "/panel");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const renderStep = () => {
    switch (action) {
      case "forgot":
      case "mobile-number":
        return (
          <AuthForm
            setMobileNumber={setMobileNumber}
            setAction={setAction}
            action={action}
            setToken={setToken}
            mobileNumber={mobileNumber}
            isCorrectMobileNumber={isCorrectMobileNumber}
            setIsCorrectMobileNumber={setIsCorrectMobileNumber}
            fingerprintId={fingerprintId}
          />
        );
      case "enterPassword":
      case "numberVerify":
        return (
          <ChooseLoginSystem
            setAction={setAction}
            action={action}
            setToken={setToken}
            mobileNumber={mobileNumber}
            token={token}
            setAccessToken={setAccessToken}
            setIsCorrectMobileNumber={setIsCorrectMobileNumber}
          />
        );
      case "createPassword":
        return <CreatePassword accessToken={accessToken} />;
      case "OTP":
        return (
          <VerificationForm
            mobileNumber={mobileNumber}
            callbackUrl={callbackUrl}
            token={token}
            action={action}
            setAction={setAction}
            setAccessToken={setAccessToken}
            fingerprintId={fingerprintId}
          />
        );
      // case 'forgot':
      //   return <ForgotPassword setForgotData={setForgotData} />;
      default:
        return null;
    }
  };
  return <>{renderStep()}</>;
}

export default AuthCard;
