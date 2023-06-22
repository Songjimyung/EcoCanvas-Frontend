import React, { useState, useEffect } from "react";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LocalGroceryStoreRoundedIcon from "@mui/icons-material/LocalGroceryStoreRounded";
import "./topbar.css";
import { Link } from "react-router-dom";

export default function Topbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 로그인 상태를 localstorage에서 확인
    const loggedInStatus = localStorage.getItem("access");
    if (loggedInStatus) {
      setIsLoggedIn(true);
    }
  }, []);
  // Logout
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("payload");
    setIsLoggedIn(false);
    alert("로그아웃 되었습니다.");
  };

  return (
    <div className="_topbar">
      <div className="_topbarLeft">
        <div className="_topbarLogo">
          <Link to="/" className="_topbarLogo">
            ECO CANVAS
          </Link>
        </div>
        <div className="_topbarMenu">
          <h3 className="_topbarTitle">
            <Link to="/" className="_topbarTitle">
              Home
            </Link>
          </h3>
          <h3 className="_topbarTitle">
            <Link to="/campaign" className="_topbarTitle">
              지구의 날
            </Link>
          </h3>
          <h3 className="_topbarTitle">
            <Link to="/shop" className="_topbarTitle">
              <LocalGroceryStoreRoundedIcon className="_topbarIcon" />
              Shop
            </Link>
          </h3>
        </div>
      </div>
      <div className="_topbarRight">
        <div className="_topbarLogFunction">
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
          |
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
          <div className="_topbarIconContainer">
            <NotificationsNoneIcon />
            <span className="_topIconBadge">1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
