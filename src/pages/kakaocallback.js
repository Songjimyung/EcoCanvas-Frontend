import { useEffect } from "react";
import axios from "axios";

const CallbackKakao = ({ code }) => {

  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/oauth/kakao/callback/?code=${code}`, {
          headers: {
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
          }
        });

        const { data, status } = response;
        if (status === 200) {
          
          const token_req_json = data;
          localStorage.setItem('access', token_req_json['jwt_token']['access']);
          localStorage.setItem("refresh", token_req_json['jwt_token']['refresh']);
          const base64Url = token_req_json['jwt_token']['access'].split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          localStorage.setItem("payload", jsonPayload);
          alert("카카오 로그인 성공!")
          window.location.replace("/")
        } else if (status === 201) {
          alert("카카오 회원가입 성공!");
          window.location.replace("/");
        } else {
          
        }
      } catch (error) {
        
      }
    };

    getToken();
  }, [code]);
};

export { CallbackKakao };
