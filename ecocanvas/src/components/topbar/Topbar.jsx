import React, { useState, useEffect } from 'react';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import './topbar.css';
import { Link } from 'react-router-dom';


export default function Topbar() {
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
  };
  
  return (
    <div className='topbar'>
      <div className='topbarWrapper'>
        <div className='topLeft'></div>
        <div className='topbarWrapper'>
          <div>
            <h2>
              <Link to='/' className='topMiddle'>
                ECO CANVAS
              </Link>
            </h2>
          </div>
        </div>
        <div className='topRight'>
          {isLoggedIn ? (
            <span>
              <Link onClick={handleLogout} className='signBtn'>로그아웃</Link>
            </span>
          ) : (
            <span>
              <Link to='/login' className='signBtn'>로그인</Link>
            </span>
          )}
          |
          {isLoggedIn ? (
            <span>
              <Link to='/mypage' className='signBtn'>마이페이지</Link>
            </span>
          ) : (
            <span>
              <Link to='/login' className='signBtn'>회원가입</Link>
            </span>
          )}
          <div className='topbarIconContainer'>
            <NotificationsNoneIcon />
            <span className='topIconBadge'>1</span>
          </div>
        </div>
      </div>
    </div>
  );
}