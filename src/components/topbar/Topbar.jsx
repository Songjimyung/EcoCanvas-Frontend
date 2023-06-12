import React, { useState, useEffect } from 'react';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import './Topbar.css';
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
    <div className='_topbar'>
      <div className='_topbarWrapper'>
        <div className='_topLeft'></div>
        <div className='_topbarWrapper'>
          <div>
            <h2>
              <Link to='/' className='_topMiddle'>
                ECO CANVAS
              </Link>
            </h2>
          </div>
        </div>
        <div className='_topRight'>
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
              <Link to='/mypage' className='_signBtn'>마이페이지</Link>
            </span>
          ) : (
            <span>
              <Link to='/login' className='_signBtn'>회원가입</Link>
            </span>
          )}
          <div className='_topbarIconContainer'>
            <NotificationsNoneIcon />
            <span className='_topIconBadge'>1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
