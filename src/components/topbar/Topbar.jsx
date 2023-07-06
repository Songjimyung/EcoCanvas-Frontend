import React, { useState, useEffect} from "react";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocalGroceryStoreRoundedIcon from "@mui/icons-material/LocalGroceryStoreRounded";
import "./topbar.css";
import { Link } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import SlideMenuBtn from "../../img/menu.png";

export default function Topbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [socket, setSocket] = useState(null);
  const [open, setOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);

  const handleClose = () => {
    setOpen(false);
  };

  const handleNotificationCount = () => {
    setNotificationCount(0);
  };

  const handleSnackbarOpen = (message) => {
    setNotificationMessage(message);
    setOpen(true);
    setNotificationCount((prevCount) => prevCount + 1);
  };
  useEffect(() => {
    const newSocket = new WebSocket(
      `${process.env.REACT_APP_WEBSOCK_URL}/ws/notification/`
    ); // WebSocket 연결 URL
    setSocket(newSocket);

    newSocket.onopen = () => {
      // notification_group 그룹 구독 요청
      newSocket.send(
        JSON.stringify({
          command: "subscribe",
          group: "notification_group",
        })
      );
    };
    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const message = data.message;
      handleSnackbarOpen(message);
    };
    newSocket.onclose = () => {};

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    // 로그인 상태를 localstorage에서 확인
    const loggedInStatus = localStorage.getItem("access");
    if (loggedInStatus) {
      setIsLoggedIn(true);
    }
  }, []);
  // Logout
  const handleLogout = () => {
    const currentDate = new Date();
    const expiresDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    const expires = expiresDate.toUTCString();

    localStorage.removeItem("access");
    document.cookie =
      "refresh=; path=/; expires=" + expires + "; Secure; SameSite=Lax";
    localStorage.removeItem("payload");
    setIsLoggedIn(false);
    socket.close();
    alert("로그아웃 되었습니다.");
  };

  const handleCart = () => {
    window.location.replace("/cart");
  };

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      // 슬라이드 메뉴 숨김 처리
      if (screenWidth > 950) {
        closeSlideMenu();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSlideMenu = () => {
    const slideMenu = document.querySelector("._topbar-slideMenu");

    if (!slideMenu.classList.contains("_topbar-slideMenu--visible")) {
      slideMenu.classList.add("_topbar-slideMenu--visible");
      setTimeout(() => {
        slideMenu.style.opacity = "1";
      }, 0);
    } else {
      slideMenu.style.opacity = "0";
      setTimeout(() => {
        slideMenu.classList.remove("_topbar-slideMenu--visible");
      }, 200);
    }
  };

  const closeSlideMenu = () => {
    const slideMenu = document.querySelector("._topbar-slideMenu");
    if (slideMenu.classList.contains("_topbar-slideMenu--visible")) {
      slideMenu.style.opacity = "0";
      slideMenu.classList.remove("_topbar-slideMenu--visible");
    }
  };

  return (
    <div className="_topbar">
      <div className="_topbar-normalMenu">
        <div className="_topbarLeft">
          <div className="_topbarLogo" onClick={closeSlideMenu}>
            <Link to="/" className="_topbarLogo">
              ECO CANVAS
            </Link>
          </div>
          <div className="_topbarMenu">
            <h3 className="_topbarTitle">
              <Link to="/campaign" className="_topbarMainTitle">
                지구의 날
              </Link>
            </h3>
            <h3 className="_topbarTitle">
              <Link to="/shop" className="_topbarTitle">
                Shop
                <StorefrontIcon />
              </Link>
            </h3>
          </div>
        </div>
        <div className="_topbarRight">
          <div className="_topbarRight-functionBox">
            <div style={{ marginRight: "30px" }} className="_topbarLogFunction">
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
              <span className="_signBtn">|</span>
              {isLoggedIn ? (
                <span>
                  <Link to="/mypage" className="_signBtn">
                    마이페이지
                  </Link>
                </span>
              ) : (
                <span>
                  <Link to="/signup" className="_signBtn">
                    회원가입
                  </Link>
                </span>
              )}
            </div>
            <div className="_topbarNotiShopFunction">
              <span>
                <Link
                  to="/notification"
                  className="_signBtn"
                  onClick={() => { handleNotificationCount(); closeSlideMenu(); }}
                >
                  <NotificationsNoneIcon className="_topbarIconContainer" />
                  {notificationCount > 0 && (
                    <span className="_topIconBadge">{notificationCount}</span>
                  )}
                </Link>
              </span>
              <span>|</span>
              <span>
                <Link onClick={() => { handleCart(); closeSlideMenu(); }} className="_signBtn">
                  <LocalGroceryStoreRoundedIcon className="_topbarIcon" />
                </Link>
              </span>
            </div>
            <button className="slideMenu-btn" onClick={handleSlideMenu}>
              <img src={SlideMenuBtn} alt="" />
            </button>
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
      </div>
      <div className="_topbar-slideMenu _topbar-slideMenu-flex">
        <Link to="/campaign" onClick={closeSlideMenu} className="slideMenu-links">
          <span>지구의 날</span>
        </Link>
        <Link to="/shop" onClick={closeSlideMenu} className="slideMenu-links">
          <span>Shop</span>
          <StorefrontIcon />
        </Link>
        {isLoggedIn ? (
          <Link
            onClick={() => {
              handleLogout();
              closeSlideMenu();
            }}
            className="slideMenu-links"
          >
            <span>로그아웃</span>
          </Link>
        ) : (
          <Link to="/login" onClick={closeSlideMenu} className="slideMenu-links">
            <span>로그인</span>
          </Link>
        )}
        {isLoggedIn ? (
          <Link to="/mypage" onClick={closeSlideMenu} className="slideMenu-links">
            <span>마이페이지</span>
          </Link>
        ) : (
          <Link to="/signup" onClick={closeSlideMenu} className="slideMenu-links">
            <span>회원가입</span>
          </Link>
        )}
      </div>
    </div>
  );
}
