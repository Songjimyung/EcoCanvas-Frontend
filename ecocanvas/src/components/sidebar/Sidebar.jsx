import React from 'react'
import './sidebar.css'
import LocalGroceryStoreRoundedIcon from '@mui/icons-material/LocalGroceryStoreRounded';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className='sidebar'>
      <div className='sidebarWrapper'>
        <div className='sidebarMenu'>
          <h3 className='sidebarTitle'>
            <Link to='/' className='sidebarTitle'>Home</Link></h3>
          <h3 className='sidebarTitle'>
            <Link to='/campaign' className='sidebarTitle'>지구의 날</Link></h3>
          <h3 className='sidebarTitle'>
            <Link to='/shop' className='sidebarTitle'>
              <LocalGroceryStoreRoundedIcon className='sidebarIcon' />Shop</Link></h3>

        </div>
      </div>
    </div >
  )
}