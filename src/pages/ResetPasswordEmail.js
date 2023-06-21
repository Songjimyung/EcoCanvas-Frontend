import React, { useState } from "react";
import axios from 'axios';
import '../css/AuthForm.css'

const ResetPasswordEmail = () => {
    const [email, setEmail] = useState('');
    const handlePasswordEmailFormSubmit = async (e) => {
        e.preventDefault();
        const emailSendData = {
            email,
        }
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/reset_pw/email_code/`, emailSendData);
            alert(response.data['message'])
        } catch (error) {
            console.error(error.response.data);
        }
    };
    return (
        <div>
            <div>
                <h3 className='inputList'>
                    비밀번호 찾기 / 회원님의 계정 이메일을 입력해주세요.
                </h3>
            </div>
            <div className='inputList'>
                <input
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={handlePasswordEmailFormSubmit}>
                    비밀번호 재설정 링크 받기
                </button>
            </div>
        </div >
    );
};

export { ResetPasswordEmail };