import React from "react";
import './sidebar.css'
import HouseSharpIcon from '@mui/icons-material/HouseSharp';
import CurrencyExchangeSharpIcon from '@mui/icons-material/CurrencyExchangeSharp';
import LeaderboardSharpIcon from '@mui/icons-material/LeaderboardSharp';
import GroupSharpIcon from '@mui/icons-material/GroupSharp';
import StorefrontSharpIcon from '@mui/icons-material/StorefrontSharp';
import CampaignSharpIcon from '@mui/icons-material/CampaignSharp';
import PermPhoneMsgSharpIcon from '@mui/icons-material/PermPhoneMsgSharp';
import { Link } from "react-router-dom";


export default function sidebar() {
    return (
        <div className="sidebar">
            <div className="sidebarWrapper">
                <div className="sidebarMenu">
                    <h3 className="sidebarTitle">Dashboard</h3>
                    <ul className="sidebarList">
                        <Link to="/" className="link">
                            <li className="sidebarListItem">
                                <HouseSharpIcon className="sidebarIcon"/>
                                Home
                            </li>
                        </Link>
                        <Link to="/" className="link">
                            <li className="sidebarListItem">
                                <CurrencyExchangeSharpIcon className="sidebarIcon"/>
                                결제 현황
                            </li>
                        </Link>
                        <Link to="/" className="link">
                            <li className="sidebarListItem">
                                <LeaderboardSharpIcon className="sidebarIcon"/>
                                수익 현황
                            </li>
                        </Link>
                    </ul>
                </div>
                <div className="sidebarMenu">
                    <h3 className="sidebarTitle">메뉴</h3>
                    <ul className="sidebarList">
                        <Link to="/users" className="link">
                            <li className="sidebarListItem">
                                <GroupSharpIcon className="sidebarIcon"/>
                                유저
                            </li>
                        </Link>
                        <Link to="/products" className="link">
                            <li className="sidebarListItem">
                                <StorefrontSharpIcon className="sidebarIcon"/>
                                상품
                            </li>
                        </Link>
                        <Link to="/campaigns" className="link">
                            <li className="sidebarListItem">
                                <CampaignSharpIcon className="sidebarIcon"/>
                                캠페인
                            </li>
                        </Link>
                        <Link to="/chats" className="link">
                            <li className="sidebarListItem">
                                <PermPhoneMsgSharpIcon className="sidebarIcon"/>
                                상담
                            </li>
                        </Link>
                    </ul>
                </div>
            </div>
        </div>
    ) 
}