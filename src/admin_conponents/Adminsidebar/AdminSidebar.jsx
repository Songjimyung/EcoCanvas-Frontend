import React, { useState, useEffect } from "react";
import "./admin_sidebar.css";
import HouseSharpIcon from "@mui/icons-material/HouseSharp";
import CurrencyExchangeSharpIcon from "@mui/icons-material/CurrencyExchangeSharp";
import LeaderboardSharpIcon from "@mui/icons-material/LeaderboardSharp";
import GroupSharpIcon from "@mui/icons-material/GroupSharp";
import PermPhoneMsgSharpIcon from "@mui/icons-material/PermPhoneMsgSharp";
import { Link } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


export default function Adminsidebar() {
  const [open, setOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [changeColor, setChangeColor] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleSnackbarOpen = (message) => {
    setNotificationMessage(message);
    setOpen(true);
    setChangeColor(true);
  }
  const handleSidebarItemClick = () => {
    setChangeColor(false)
  }

  useEffect(() => {
    const notificationSocket = new WebSocket(`${process.env.REACT_APP_WEBSOCK_URL}/ws/chat/alarm/`);

    notificationSocket.onopen = () => {
      // notification_admin_group 그룹 구독 요청
      notificationSocket.send(
        JSON.stringify({
          command: "subscribe",
          group: "notification_admin_group",
        })
      );
    };

    notificationSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const message = data.message;
      handleSnackbarOpen(message);
    };

    notificationSocket.onclose = () => {

    };


    return () => {
      notificationSocket.close();
    };
  }, []);

  return (
    <div className="adminsidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <Link to="/admin-home" className="link">
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
            <Link to="/admin-campaign" className="link">
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
            <Link to="/admin-users" className="link">
              <li className="sidebarListItem">
                <GroupSharpIcon className="sidebarIcon" />
                유저목록
              </li>
            </Link>
            <a href="/chats" className="link">
              <li className={`sidebarListItem ${changeColor ? "highlighted" : ""}`}
                onClick={handleSidebarItemClick}>
                <PermPhoneMsgSharpIcon className="sidebarIcon" />
                상담
              </li>
            </a>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">shop</h3>
          <ul className="sidebarList">
            <Link to="/admin-orderlist" className="link">
              <li className="sidebarListItem">
                <HouseSharpIcon className="sidebarIcon" />
                주문내역
              </li>
            </Link>
            <Link to="/admin-products/:productId" className="link">
              <li className="sidebarListItem">
                <CurrencyExchangeSharpIcon className="sidebarIcon" />
                재고관리
              </li>
            </Link>
            <Link to="/admin-createProduct" className="link">
              <li className="sidebarListItem">
                <LeaderboardSharpIcon className="sidebarIcon" />
                상품등록
              </li>
            </Link>
            <Link to="/admin-products" className="link">
              <li className="sidebarListItem">
                <LeaderboardSharpIcon className="sidebarIcon" />
                상품목록
              </li>
            </Link>
          </ul>
        </div>
      </div>
      <div>
        <Snackbar
          open={open}
          autoHideDuration={9000}
          onClose={handleClose}
          message={notificationMessage}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
          sx={{
            "& .MuiSnackbarContent-root": {
              backgroundColor: "midnightblue",
              color: "white",
            },
          }}
        />
      </div>
    </div>
  );
}
