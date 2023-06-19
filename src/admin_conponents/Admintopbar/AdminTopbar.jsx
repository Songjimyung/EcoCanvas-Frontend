import React, { useState, useEffect } from 'react';
import './Admintopbar.css'
import { Link } from 'react-router-dom';

export default function AdminTopbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 로그인 상태를 localstorage에서 확인
    const loggedInStatus = localStorage.getItem('access');
    if (loggedInStatus) {
      setIsLoggedIn(true);
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('payload');
    setIsLoggedIn(false);
    alert("로그아웃 되었습니다.")
    window.location.replace("/")
  };

  return (
    <div className='topbar'>
      <div className='topbarWrapper'>
        <div className='topLeft'>
          <span className='logo'>Admin</span>
        </div>
        <div className='topRight'>
          {isLoggedIn ? (
            <span>
              <Link onClick={handleLogout} className='_signBtn'>로그아웃</Link>
            </span>
          ) : (
            <span>
              <Link to='/login' className='_signBtn'>로그인</Link>
            </span>
          )}
          |
          {isLoggedIn ? (
            <span>
              <Link to='/mypage' className='_signBtn'>마이페이지
              </Link>
            </span>
          ) : (
            <span>
              <Link to='/signup' className='_signBtn'>회원가입</Link>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}