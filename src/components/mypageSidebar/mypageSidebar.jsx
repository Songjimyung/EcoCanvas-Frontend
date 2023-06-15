import React, { useEffect, useState } from "react";
import "./mypageSidebar.css";
import { Link, useLocation } from "react-router-dom";
import SidebarItem from "../SidebarItem/SidebarItem";

function Sidebar() {
  const [userData, setUserData] = useState([])
  const [userId, setUserId] = useState();
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // URL의 path값을 받아올 수 있다.
  const pathName = useLocation().pathname;

  //마이페이지 리스트
  const menus = [
    { name: "캠페인 참가 내역", path: "/mypage" },
    { name: "캠페인 작성 내역", path: "/mypage/mypostcampaign" },
    { name: "좋아요", path: "/mypage/mylikes" },
    { name: "리뷰/댓글", path: "/mypage/myreviews" },
  ];
  const menus1 = [
    { name: "주문내역", path: "/mypage/myorders" },
    { name: "배송조회", path: "/mypage/mydelivery" },
    { name: "환불/취소 접수", path: "/mypage/myrefund" }
  ];

  // payload에서 user_id 가져와서 GET요청 
  useEffect(() => {
    const payload = localStorage.getItem('payload');
    if (payload) {
      const payloadObject = JSON.parse(payload);
      setUserId(payloadObject.user_id);
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await fetch(`http://127.0.0.1:8000/users/${userId}/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const result = await response.json();
          const user_info = result.map((user) => ({
            username: user.username,
            email: user.email,
            id: user.id
          }));
          setUserData(user_info);
        } else {
          console.log('Failed to fetch user data');
        }
      } catch (error) {
        console.log('Error while fetching user data:', error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  //모달 open, close
  const openModal = (userId) => {
    setSelectedInfo(userId);
    const modal = document.getElementById("modal");
    modal.style.display = "block";
  };
  const closeModal = () => {
    setSelectedInfo(null);
    const modal = document.getElementById("modal");
    modal.style.display = "none";
  };

  //회원정보 수정 
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setEmail("");
    setPassword("");
  };


  return (
    <>
      <div className="mypage-sidebar-wrap1">
        <div className="mypage-wrap">
          <div className="myprofile">
          </div>
          <div>
            {userData.map((user) => {
              return (
                <div key={user.id}>
                  이름:{user.username}
                  <p>이메일:{user.email}</p>
                  <button className="details-button" onClick={() => openModal(user.id)}>회원정보 수정</button>
                </div>
              );
            })}
          </div>
          <div className="mypage-sidebar">
            <h3>나의 캠페인</h3>
            {menus.map((menu, index) => {
              return (
                <Link to={menu.path} key={index}>
                  <SidebarItem
                    menu={menu}
                    isActive={pathName === menu.path ? true : false}	// 현재 URL pathname과 객체에 담긴 path값 일치 여부 확인
                  />
                </Link>
              );
            })}
          </div>
          <div className="mypage-sidebar">
            <h3>나의 쇼핑</h3>
            {menus1.map((menu, index) => {
              return (
                <Link to={menu.path} key={index}>
                  <SidebarItem
                    menu={menu}
                    isActive={pathName === menu.path ? true : false}	// 현재 URL pathname과 객체에 담긴 path값 일치 여부 확인
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <div id="modal" className="modal">
        <div className="modal-content">
          <span className="close-button" onClick={closeModal}>&times;</span>
          {selectedInfo && (
            <div>
              {userData.map((user) => {
                if (user.id === selectedInfo) {
                  return (
                    <form onSubmit={handleSubmit} key={user.id}>
                      <label>
                        이메일:
                        <input type="email" value={email} onChange={handleEmailChange} />
                      </label>
                      <br />
                      <label>
                        비밀번호:
                        <input type="password" value={password} onChange={handlePasswordChange} />
                      </label>
                      <br />
                      <button type="submit">저장</button>
                      <button type="submit">회원탈퇴</button>
                    </form>
                  );
                }
                return null;
              })}
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default Sidebar;