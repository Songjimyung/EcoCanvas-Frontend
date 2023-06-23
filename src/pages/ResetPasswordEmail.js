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
            if (error.response.data['email']) {
                alert(error.response.data['email']);
            }
        }
    };
    return (
        <div className="log-div">
            <div>
                <h3 className='inputList'>
                    회원님 계정의 이메일을 입력하시고
                    <br />
                    비밀번호 재설정 링크를 받아보세요!
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