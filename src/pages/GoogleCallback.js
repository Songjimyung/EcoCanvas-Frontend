import React, { useEffect } from "react";
import axios from "axios";

const CallbackGoogle = (props) => {
    let code = new URL(window.location.href).searchParams.get("code");
    console.log(code);

    useEffect(() => {
        const getToken = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/google/callback/?code=${code}`);
                const token_req_json = response.data;
                let error = token_req_json.error;
                if (error !== null) {
                    throw new Error(error);
                }
                let access_token = token_req_json.access_token;
                console.log(access_token);
            } catch (error) {
                console.error(error);
            }
        };

        getToken();
    }, [code]);

    return (
        <div>
            dddddddddddddfsdafasdfasdfasddfsd
        </div>
    );
};

export { CallbackGoogle };
