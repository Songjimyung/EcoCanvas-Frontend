import React from "react";
import './admin_sidebar.css'
import HouseSharpIcon from '@mui/icons-material/HouseSharp';
import CurrencyExchangeSharpIcon from '@mui/icons-material/CurrencyExchangeSharp';
import LeaderboardSharpIcon from '@mui/icons-material/LeaderboardSharp';
import GroupSharpIcon from '@mui/icons-material/GroupSharp';
import StorefrontSharpIcon from '@mui/icons-material/StorefrontSharp';
import PermPhoneMsgSharpIcon from '@mui/icons-material/PermPhoneMsgSharp';
import { Link } from "react-router-dom";


export default function Adminsidebar() {
  return (
    <div className="adminsidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <Link to="/admin_home" className="link">
              <li className="sidebarListItem">
                <HouseSharpIcon className="sidebarIcon" />
                Home
              </li>
            </Link>
            <Link to="/" className="link">
              <li className="sidebarListItem">
                <CurrencyExchangeSharpIcon className="sidebarIcon" />
                결제 현황
              </li>
            </Link>
            <Link to="/" className="link">
              <li className="sidebarListItem">
                <LeaderboardSharpIcon className="sidebarIcon" />
                수익 현황
              </li>
            </Link>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">캠페인/펀딩</h3>
          <ul className="sidebarList">
            <Link to="/admin_campaign" className="link">
              <li className="sidebarListItem">
                <HouseSharpIcon className="sidebarIcon" />
                캠페인 신청내역
              </li>
            </Link>
            <Link to="/" className="link">
              <li className="sidebarListItem">
                <CurrencyExchangeSharpIcon className="sidebarIcon" />
                캠페인 정산
              </li>
            </Link>
            <Link to="/" className="link">
              <li className="sidebarListItem">
                <LeaderboardSharpIcon className="sidebarIcon" />
                펀딩 내역
              </li>
            </Link>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">유저 관리</h3>
          <ul className="sidebarList">
            <Link to="/admin_users" className="link">
              <li className="sidebarListItem">
                <GroupSharpIcon className="sidebarIcon" />
                유저목록
              </li>
            </Link>
            <Link to="/admin_users/:userId" className="link">
              <li className="sidebarListItem">
                <StorefrontSharpIcon className="sidebarIcon" />
                유저정보
              </li>
            </Link>
            <Link to="/admin_createUser" className="link">
              <li className="sidebarListItem">
                <StorefrontSharpIcon className="sidebarIcon" />
                유저등록
              </li>
            </Link>
            <Link to="/chats" className="link">
              <li className="sidebarListItem">
                <PermPhoneMsgSharpIcon className="sidebarIcon" />
                상담
              </li>
            </Link>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">shop</h3>
          <ul className="sidebarList">
            <Link to="/admin_home" className="link">
              <li className="sidebarListItem">
                <HouseSharpIcon className="sidebarIcon" />
                주문내역
              </li>
            </Link>
            <Link to="/admin_products/:productId" className="link">
              <li className="sidebarListItem">
                <CurrencyExchangeSharpIcon className="sidebarIcon" />
                재고관리
              </li>
            </Link>
            <Link to="/admin_createProduct" className="link">
              <li className="sidebarListItem">
                <LeaderboardSharpIcon className="sidebarIcon" />
                상품등록
              </li>
            </Link>
            <Link to="/admin_products" className="link">
              <li className="sidebarListItem">
                <LeaderboardSharpIcon className="sidebarIcon" />
                상품목록
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  )
}