import Turnstile from "react-turnstile";
import { useTurnstileToken } from "../../store/turnstileToken";

function TurnstileForm({ isCorrectMobileNumber, isActive }) {
  const setTurnstileToken = useTurnstileToken(
    (state) => state.setNewTurnstileToken
  );
  const CLOUDFLARE_TURNSTILE_SITE_KEY = import.meta.env
    .VITE_CLOUDFLARE_TURNSTILE_SITE_KEY;

  return (
    <Turnstile
      style={{
        marginTop: "20px",
        textAlign: "center",
        display: isActive && isCorrectMobileNumber ? "block" : "none",
      }}
      sitekey={CLOUDFLARE_TURNSTILE_SITE_KEY}
      onError={(e) => console.error(e)}
      onExpire={(e) => {
        setTurnstileToken("");
      }}
      language="fa-ir"
      onVerify={(token) => {
        setTurnstileToken(token);
      }}
    />
  );
}

export default TurnstileForm;
