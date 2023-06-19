import { useEffect } from "react";
import axios from "axios";

const CallbackKakao = (props) => {
  let code = new URL(window.location.href).searchParams.get("code");
  console.log(code);

  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/oauth/kakao/callback/?code=${code}`);
        const token_req_json = response.data;
        localStorage.setItem('access', token_req_json['jwt_token']['access']);
        localStorage.setItem("refresh", token_req_json['jwt_token']['refresh']);
        const base64Url = token_req_json['jwt_token']['access'].split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        localStorage.setItem("payload", jsonPayload);
        console.log('카카오로그인 성공')
        alert("카카오 로그인 성공!")
        window.location.replace("/")
      } catch (error) {
        console.error(error);
      }
    };

    getToken();
  }, [code]);
};

export { CallbackKakao };
