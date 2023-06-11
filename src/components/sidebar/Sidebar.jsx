import React from 'react'
import './sidebar.css'
import LocalGroceryStoreRoundedIcon from '@mui/icons-material/LocalGroceryStoreRounded';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className='_sidebar'>
      <div className='_sidebarWrapper'>
        <div className='_sidebarMenu'>
          <h3 className='_sidebarTitle'>
            <Link to='/' className='_sidebarTitle'>Home</Link></h3>
          <h3 className='_sidebarTitle'>
            <Link to='/campaign' className='_sidebarTitle'>지구의 날</Link></h3>
          <h3 className='_sidebarTitle'>
            <Link to='/shop' className='_sidebarTitle'>
              <LocalGroceryStoreRoundedIcon className='_sidebarIcon' />Shop</Link></h3>
        </div>
      </div>
    </div >
  )
}