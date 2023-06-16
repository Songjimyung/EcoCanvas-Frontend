import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// axios.defaults.withCredentials = true;

const AuthForm = ({ type }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [re_password, setPasswordCheck] = useState('');

  const handleSignupFormSubmit = async (e) => {
    e.preventDefault();
    //요청을 보낼 데이터 객체
    const signUpData = {
      email,
      username,
      password,
      re_password,
    };
    try {
      const response = await axios.post('http://localhost:8000/users/signup/', signUpData);
      console.log(response.data); // 회원가입 성공 시 서버로부터 받은 응답 데이터 출력

      alert("회원가입 성공!")
      navigate("/login");
    } catch (error) {
      console.error(error.response.data); // 회원가입 실패 시 서버로부터 받은 에러 데이터 출력
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
      const response = await axios.post('http://localhost:8000/users/login/', loginData);
      console.log(response.data); // 로그인 성공 시 서버로부터 받은 응답 데이터 출력

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
      console.log(payloadObject.is_admin);
      if (payloadObject.is_admin) {
        navigate('/admin_home'); // is_admin이 true인 경우 admin_home으로 이동
        window.location.reload();
      } else {
        window.location.replace("/")
      }
    } catch (error) {
      alert("이메일과 비밀번호를 확인해주세요.")
      console.log(error)
    }
  };
  const SocialKakao = () => {
    const handleLogin = () => {
      const REST_API_KEY = "0d5db60d8b7cf11250d01452825aea32";
      const REDIRECT_URI = "http://localhost:3000/users/oauth/kakao/callback";
      const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

      window.location.href = KAKAO_AUTH_URL;
    };

    return (
      <button onClick={handleLogin}>카카오로 로그인</button>
    );
  };

  const SocialGoogle = () => {
    const handleGoogleLogin = () => {
      const GOOGLE_URL = 'http://127.0.0.1:8000/users/google/login/'

      window.location.href = GOOGLE_URL;
    };

    return (
      <button onClick={handleGoogleLogin}>구글로 로그인</button>
    );
  };


  return (
    <div>
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
