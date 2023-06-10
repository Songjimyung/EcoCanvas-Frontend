import React from 'react'
import './topbar.css'
import NotificationsNoneSharpIcon from '@mui/icons-material/NotificationsNoneSharp';
import LanguageSharpIcon from '@mui/icons-material/LanguageSharp';
import SettingsSharpIcon from '@mui/icons-material/SettingsSharp';

export default function Topbar() {
    return (
        <div className='topbar'>
            <div className='topbarWrapper'>
                <div className='topLeft'>
                    <span className='logo'>Admin</span>
                </div>
                <div className='topRight'>
                    <div className="topbarIconContainer">
                        <NotificationsNoneSharpIcon />
                        <span className='topIconbadge'>2</span>
                    </div>
                    <div className="topbarIconContainer">
                        <LanguageSharpIcon />
                        <span className='topIconbadge'>2</span>
                    </div>
                    <div className="topbarIconContainer">
                        <SettingsSharpIcon />
                    </div>
                    <div>
                        Admin
                    </div>
                </div>
            </div>
        </div>
    )
}