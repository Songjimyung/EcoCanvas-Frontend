import React from "react";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from './AuthForm';

const Login = () => {
  // 로그인 시 주소창 접근 제한
  const navigate = useNavigate();
  const token = localStorage.getItem('access')

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [navigate, token]);

  return (
    <div>
      <AuthForm type='login' />
    </div>
  );
};

export { Login };