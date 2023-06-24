import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/AuthForm.css'

const ResetPassword = () => {
    let uidb64 = new URL(window.location.href).searchParams.get("uidb64");
    let token = new URL(window.location.href).searchParams.get("token")
    const [password, setPassword] = useState('');
    const [re_password, setPasswordCheck] = useState('');
    const navigate = useNavigate();
    const handleResetPasswordFormSubmit = async (e) => {
        e.preventDefault();
        const resetPasswordData = {
            password,
            re_password,
            uidb64,
            token
        }
        try {
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/users/reset_pw/`, resetPasswordData);
            const response_data = response.data
            const response_status = response.status

            if (response_status === 200) { alert(response_data['message']) }

            navigate(`/`);

        } catch (error) {
            
        }
    };
    return (
        <div>
            <div>
                <h3 className='inputList'>
                    비밀번호 재설정
                </h3>
            </div>
            <div className='inputList'>
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    name="re_password"
                    type="password"
                    placeholder="비밀번호 확인"
                    value={re_password}
                    onChange={(e) => setPasswordCheck(e.target.value)}
                />
                <button onClick={handleResetPasswordFormSubmit}>
                    비밀번호 재설정
                </button>
            </div>
        </div >
    );
};

export { ResetPassword };