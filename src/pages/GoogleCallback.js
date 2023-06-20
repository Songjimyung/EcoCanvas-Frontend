import React, { useEffect } from "react";
import axios from "axios";

const CallbackGoogle = (props) => {
    let code = new URL(window.location.href).searchParams.get("code");

    useEffect(() => {
        const getToken = async () => {
            try {
                const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/google/callback/?code=${code}`);
                const token_req_json = response.data;
                localStorage.setItem('access', token_req_json['access']);
                localStorage.setItem("refresh", token_req_json['refresh']);
                const base64Url = token_req_json['access'].split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                localStorage.setItem("payload", jsonPayload);
                alert("구글 로그인 성공!")
                window.location.replace("/")
            } catch (error) {
                console.error(error);
            }
        };

        getToken();
    }, [code]);

    return (
        <div>
            구글 로그인 성공!
        </div>
    );
};

export { CallbackGoogle };
