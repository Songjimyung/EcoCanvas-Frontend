import React, { useState, useEffect } from "react";
import "./Admintopbar.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


export default function AdminTopbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  // const [notificationCount, setNotificationCount] = useState(0);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    // 로그인 상태를 localstorage에서 확인
    const loggedInStatus = localStorage.getItem("access");
    if (loggedInStatus) {
      setIsLoggedIn(true);
    }
  }, []);


  const handleSnackbarOpen = (message) => {
    setNotificationMessage(message);
    setOpen(true);
    // setNotificationCount((prevCount) => prevCount + 1);

  };
  // const handleNotificationCount = () => {
  //   setNotificationCount(0);
  // };

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

  useEffect(() => {
    // 로그인 상태를 localstorage에서 확인
    const loggedInStatus = localStorage.getItem("access");
    if (loggedInStatus) {
      setIsLoggedIn(true);
    }
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("payload");
    setIsLoggedIn(false);
    alert("로그아웃 되었습니다.");
    window.location.replace("/");
  };

  const handleLinkBySelect = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === "userhome") {
      navigate("/");
    } else if (selectedValue === "campaign") {
      navigate("/campaign");
    } else if (selectedValue === "shop") {
      navigate("/shop");
    } else if (selectedValue === "userpage") {
      navigate("/mypage");
    }
  };

  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <Link to="/admin-home" className="_signBtn">
            <span className="logo">Admin</span>
          </Link>
        </div>
        <div className="topRight">
          {isLoggedIn ? (
            <span>
              <Link onClick={handleLogout} className="_signBtn">
                로그아웃
              </Link>
            </span>
          ) : (
            <span>
              <Link to="/login" className="_signBtn">
                로그인
              </Link>
            </span>
          )}
          &nbsp;|&nbsp;
          {isLoggedIn ? (
            <select
              className="category-dropdown"
              onChange={handleLinkBySelect}
              style={{ marginLeft: "5px" }}
            >
              <option value="userhome">EcoCanvas</option>
              <option value="campaign">지구의 날</option>
              <option value="shop">Shop</option>
              <option value="userpage">마이페이지</option>
            </select>
          ) : (
            <span>
              <Link to="/signup" className="_signBtn">
                회원가입
              </Link>
            </span>
          )}
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
