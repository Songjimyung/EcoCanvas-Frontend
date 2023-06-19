import React, { useEffect, useState } from "react";
import "./mypageSidebar.css";
import { Link, useLocation } from "react-router-dom";
import SidebarItem from "../SidebarItem/SidebarItem";
import profile_default_image from '../../img/profile_default_image.png';

function Sidebar() {
  const [userData, setUserData] = useState([])
  const [userId, setUserId] = useState();


  const getImageUrl = (imagePath) => {
    return `http://localhost:8000${imagePath}`;
  };
  const onErrorImg = (e) => {
    e.target.src = profile_default_image;
  };

  // URL의 path값을 받아오기
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
        let response = await fetch(`http://127.0.0.1:8000/users/profile/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (response.ok) {
          const result = await response.json();
          console.log(result.image)
          const user_info = {
            id: result['user']['id'],
            email: result['user']['email'],
            username: result['user']['username'],
            image: result.image
          };
          setUserData([user_info]);
        }
        else {
          // 응답이 실패인 경우
          const defaultUserInfo = {
            id: null,
            email: '프로필이 존재하지 않습니다.',
            username: '프로필이 존재하지 않습니다.',
            image: profile_default_image
          };
          setUserData([defaultUserInfo]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);


  return (
    <>
      <div className="mypage-sidebar-wrap1">
        <div className="mypage-wrap">
          <Link to="/mypage/profile">
            <div className="myprofile">
              {userData.map((user) => (
                <img
                  src={getImageUrl(user.image)}
                  onError={onErrorImg}
                  alt="profile_image"
                />
              ))}
            </div>
          </Link>
          <div>
            {userData.map((user) => {
              return (
                <div key={user.id}>
                  이름: {user.username}
                  <p>이메일: {user.email}</p>
                  <button className="details-button">
                    <Link to="/mypage/profile">회원정보 수정</Link>
                  </button>
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

    </>
  );
}

export default Sidebar;