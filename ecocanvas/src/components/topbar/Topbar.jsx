import React from 'react';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import './Topbar.css';
import { Link } from 'react-router-dom';


export default function Topbar() {
  return (
    <div className='_topbar'>
      <div className='_topbarWrapper'>
        <div className='_topLeft'>
        </div>
        <div className='_topbarWrapper'>
          <div >
            <h2><Link to='/' className='_topMiddle'>ECO CANVAS</Link></h2>
          </div>
        </div>
        <div className='_topRight'>
          <span><Link to='/login' className='_signBtn'>로그인</Link></span> |
          <span><Link to='/signup' className='_signBtn'>회원가입</Link></span>
          <div className='_topbarIconContainer'>
            <NotificationsNoneIcon />
            <span className='_topIconBadge'>1</span>
          </div>
        </div>
      </div>
    </div>
  )
}