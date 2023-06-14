import React from "react";
import "./mypageSidebar.css";
import { Link, useLocation } from "react-router-dom";
import SidebarItem from "../SidebarItem/SidebarItem";

function Sidebar() {

  // URL의 path값을 받아올 수 있다.
  const pathName = useLocation().pathname;

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

  return (
    <>
      <div className="mypage-sidebar-wrap1">
        <div className="mypage-wrap">
          <div className="myprofile">
          </div>
          <p>이름:</p>
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