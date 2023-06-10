import React from 'react';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import './topbar.css';
import { Link } from 'react-router-dom';


export default function Topbar() {
  return (
    <div className='topbar'>
      <div className='topbarWrapper'>
        <div className='topLeft'>
        </div>
        <div className='topbarWrapper'>
          <div >
            <h2><Link to='/' className='topMiddle'>ECO CANVAS</Link></h2>
          </div>
        </div>
        <div className='topRight'>
          <span><Link to='/login' className='signBtn'>로그인</Link></span> |
          <span><Link to='/signup' className='signBtn'>회원가입</Link></span>
          <div className='topbarIconContainer'>
            <NotificationsNoneIcon />
            <span className='topIconBadge'>1</span>
          </div>
        </div>
      </div>
    </div>
  )
}