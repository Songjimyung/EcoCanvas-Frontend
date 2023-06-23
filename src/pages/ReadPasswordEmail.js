import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const ReadPasswordEmail = (props) => {
    const navigate = useNavigate();
    let uidb64 = new URL(window.location.href).searchParams.get("uidb64");
    let token_email = new URL(window.location.href).searchParams.get("token")

    useEffect(() => {
        const getParams = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/reset_pw/${uidb64}/${token_email}/`);
                const response_data = response.data;
                const response_status = response.status

                if (response_status === 200) { alert("비밀번호 변경을 진행해 주세요!"); }

                navigate(`/reset-pw/?uidb64=${response_data['uidb64']}&token=${response_data['token']}`);

            } catch (error) {
                
            }
        };

        getParams();
    },);

};

export { ReadPasswordEmail };