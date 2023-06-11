import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
axios.defaults.withCredentials = true;

const AuthForm = ({ type }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [re_password, setPasswordCheck] = useState('');

  const handleSignupFormSubmit = async (e) => {
    e.preventDefault();
    //요청을 보낼 데이터 객체
    const signupData = {
      username,
      email,
      password,
      re_password,
    };
    try {
      const response = await axios.post('http://localhost:8000/users/signup/', signupData);
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
      const payload = localStorage.getItem('payload');
      const payloadObject = JSON.parse(payload);
      console.log(payloadObject.is_admin);
      if (payloadObject.is_admin) {
        navigate('/admin_home'); // is_admin이 true인 경우 admin_home으로 이동
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(error); // 로그인 실패 시 서버로부터 받은 에러 데이터 출력
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
  const kakaoLogin = (e) => {
    e.preventDefault();

    let code = new URL(window.location.href).searchParams.get("code");
    return function (dispatch, getState, { navigate }) {
      axios({
        method: "GET",
        url: `http://localhost:8000/users/oauth/kakao/callback/?code=${code}`,
      })
        .then((res) => {
          console.log(res); // 토큰이 넘어올 것임

          const ACCESS_TOKEN = res.data.accessToken;

          localStorage.setItem("token", ACCESS_TOKEN);    //예시로 로컬에 저장함    

          navigate.replace("/main") // 토큰 받았았고 로그인됐으니 화면 전환시켜줌(메인으로)

        }).catch((err) => {
          console.log("소셜로그인 에러", err);
          window.alert("로그인에 실패하였습니다.");
          navigate.replace("/login"); // 로그인 실패하면 로그인화면으로 돌려보냄
        })
    }
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
        <button onClick={kakaoLogin}>저장</button>
      </div>
    </div >
  );
};

export default AuthForm;