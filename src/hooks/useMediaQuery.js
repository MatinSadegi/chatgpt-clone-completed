import { useState, useEffect } from "react";

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const handleChange = (event) => {
      setMatches(event.matches);
    };

    handleChange(mediaQueryList);
    mediaQueryList.addEventListener("change", handleChange);

    return () => {
      mediaQueryList.removeEventListener("change", handleChange);
    };
  }, [query]); // این افکت فقط زمانی دوباره اجرا می‌شود که query تغییر کند

  return matches;
};

export default useMediaQuery;
