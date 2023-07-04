import { useEffect } from "react";
import axios from "axios";

function getCookie(name) {
  const cookieString = document.cookie;
  const cookies = cookieString.split(";").map((cookie) => cookie.trim());

  for (const cookie of cookies) {
    if (cookie.startsWith(`${name}=`)) {
      return cookie.substring(name.length + 1);
    }
  }

  return null;
}

const TokenRefreshComponent = () => {
  useEffect(() => {
    const previousAccessToken = localStorage.getItem("access");
    const refreshToken = getCookie("refresh");

    const accessTokenGenerator = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/users/login/refresh/`,
          { refresh: refreshToken },
          {
            headers: {
              Authorization: `Bearer ${previousAccessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const newAccessToken = response.data['access'];
        localStorage.setItem("access", newAccessToken);
      } catch (error) {}
    };

    const interval = setInterval(accessTokenGenerator, 1000 * 60 * 60);

    return () => clearInterval(interval);
  }, []);
};

export default TokenRefreshComponent;
