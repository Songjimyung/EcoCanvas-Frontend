import React, { useState } from "react";
import axios from 'axios';
import '../css/AuthForm.css'

const UserWithdrawal = () => {
  const [confirm_password, setConfirmPassword] = useState('');
  const payload = JSON.parse(localStorage.getItem('payload'));
  const userId = payload ? payload.user_id : '';


  const handleUserWithdrawalFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');
    const userWithdrawalData = {
      confirm_password,
    }
    try {
      const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/users/`, {
        data: userWithdrawalData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const response_data = response.data
      const response_status = response.status

      if (response_status === 200) {
        alert(response_data['message']);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("payload");
        localStorage.removeItem(`cartItems_${userId}`);
      }

      window.location.replace("/")

    } catch (error) {
      if (error.response.data['confirm_password']) {
        alert(error.response.data['confirm_password'][0]);
      } else if (error.response.data['password']) {
        alert(error.response.data['password'][0]);
      }
    }
  };
  return (
    <div className="log-div">
      <div>
        <h3 className='inputList'>
          회원 탈퇴
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
        <button onClick={handleUserWithdrawalFormSubmit}>
          회원 탈퇴
        </button>
      </div>
    </div >
  );
};

export { UserWithdrawal };