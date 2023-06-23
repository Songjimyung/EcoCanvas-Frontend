import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/AuthForm.css'

const UpdatePassword = () => {
    const [confirm_password, setConfirmPassword] = useState('');
    const [password, setPassword] = useState('');
    const [re_password, setPasswordCheck] = useState('');
    const navigate = useNavigate();
    const handleUpdatePasswordFormSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access');
        const updatePasswordData = {
            confirm_password,
            password,
            re_password,
        }
        try {
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/users/update_pw/`,
                updatePasswordData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const response_data = response.data
            const response_status = response.status

            if (response_status === 200) { alert(response_data['message']) }

            navigate(`/mypage`);

        } catch (error) {
            if (error.response.data['confirm_password']) {
                alert(error.response.data['confirm_password'][0]);
            } else if (error.response.data['password']) {
                alert(error.response.data['password'][0]);
            } else if (error.response.data['re_password']) {
                alert(error.response.data['re_password'][0]);
            } else if (error.response.data['re_password']) {
                alert(error.response.data['re_password'][0]);
            }
        }
    };
    return (
        <div className="log-div">
            <div>
                <h3 className='inputList'>
                    비밀번호 변경
                </h3>
            </div>
            <div className='inputList'>
                <input
                    name="confirm_password"
                    type="password"
                    placeholder="현재 비밀번호"
                    value={confirm_password}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
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
                <button onClick={handleUpdatePasswordFormSubmit}>
                    비밀번호 변경
                </button>
            </div>
        </div >
    );
};

export { UpdatePassword };