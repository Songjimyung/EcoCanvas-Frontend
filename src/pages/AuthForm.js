import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/AuthForm.css'

const AuthForm = ({ type }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [check_code, setCheck_code] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [re_password, setPasswordCheck] = useState('');
  const time_check = String(new Date().getFullYear()) + String(new Date().getMonth() + 1) + String(new Date().getDate());

  const handleSignupFormSubmit = async (e) => {
    e.preventDefault();
    //요청을 보낼 데이터 객체
    const signUpData = {
      email,
      check_code,
      username,
      password,
      re_password,
      time_check
    };
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/signup/`, signUpData);
      alert(response.data['message'])
      navigate("/login");
    } catch (error) {
      if (error.response.data['email']) {
        alert(error.response.data['email']);
      } else if (error.response.data['username']) {
        alert(error.response.data['username']);
      } else if (error.response.data['password']) {
        alert(error.response.data['password']);
      } else if (error.response.data['re_password']) {
        alert(error.response.data['re_password']);
      } else if (error.response.data['username']) {
        alert(error.response.data['username']);
      } else if (error.response.data['empty']) {
        alert(error.response.data['empty'])
      } else if (error.response.data['not_match']) {
        alert(error.response.data['not_match'])
      }

    }
  };
  const handleEmailFormSubmit = async (e) => {
    e.preventDefault();
    const emailSendData = {
      email,
      time_check
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/signup/email_code/`, emailSendData);
      alert(response.data['message'])
    } catch (error) {
      if (error.response.data['email']) {
        alert(error.response.data['email'])
      }
    }
  };
  const handleLoginFormSubmit = async (e) => {
    e.preventDefault();
    // 로그인 요청을 보낼 데이터 객체
    const loginData = {
      email,
      password,
    };
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/login/`, loginData);


      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      const base64Url = response.data.access.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      localStorage.setItem("payload", jsonPayload);
      alert("로그인 성공!");

      window.location.replace("/")
      const payload = localStorage.getItem('payload');
      const payloadObject = JSON.parse(payload);

      if (payloadObject.is_admin) {
        navigate('/admin-home'); // is_admin이 true인 경우 admin-home으로 이동
        window.location.reload();
      } else {
        window.location.replace("/")
      }
    } catch (error) {
      alert("이메일과 비밀번호를 확인해주세요.")

    }
  };
  const SocialKakao = () => {
    const handleLogin = () => {
      const REST_API_KEY = `${process.env.REACT_APP_KAKAO_REST_API_KEY}`;
      const REDIRECT_URI = `${process.env.REACT_APP_FRONTEND_URL}/users/oauth/kakao/callback/`;
      const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

      window.location.href = KAKAO_AUTH_URL;
    };

    return (
      <button onClick={handleLogin}>카카오 로그인</button>
    );
  };

  const SocialGoogle = () => {
    const handleGoogleLogin = () => {
      const GOOGLE_URL = `${process.env.REACT_APP_BACKEND_URL}/users/google/login/`

      window.location.href = GOOGLE_URL;
    };

    return (
      <button onClick={handleGoogleLogin}>구글 로그인</button>
    );
  };

  const handleResetPasswordEmailFormSubmit = () => {
    navigate('/reset-pw/email-code')
  }

  return (
    <div className='log-div'>
      <div>
        <h3 className='inputList'>
          {type === 'signup' ? '회원가입' : '로그인'}
        </h3>
      </div>
      <div className='inputList'>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {type === 'signup' && (
          <button onClick={handleEmailFormSubmit}>
            인증코드 받기
          </button>
        )}
        {type === 'signup' && (
          <input
            type="text"
            placeholder="인증 코드"
            value={check_code}
            onChange={(e) => setCheck_code(e.target.value)}
          />
        )}
        {type === 'signup' && (
          <input
            type="text"
            placeholder="이름"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {type === 'login' && (
          <span onClick={handleResetPasswordEmailFormSubmit} className='find-pw-btn'>
            비밀번호를 잊으셨나요?
          </span>
        )}
        {type === 'signup' && (
          <input
            name="re_password"
            type="password"
            placeholder="비밀번호 확인"
            value={re_password}
            onChange={(e) => setPasswordCheck(e.target.value)}
          />
        )}
        <button onClick={type === 'signup' ? handleSignupFormSubmit : handleLoginFormSubmit}>
          {type === 'signup' ? '가입하기' : '로그인'}
        </button>
        <SocialKakao />
        <SocialGoogle />
      </div>
    </div >
  );
};

export default AuthForm;
