import React, { useState, useEffect } from "react";
import "./Admintopbar.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export default function AdminTopbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    // 로그인 상태를 localstorage에서 확인
    const loggedInStatus = localStorage.getItem("access");
    if (loggedInStatus) {
      setIsLoggedIn(true);
    }
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
    </div>
  );
}
