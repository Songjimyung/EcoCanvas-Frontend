import React from "react";
import Sidebar from "../../components/mypageSidebar/MypageSidebar"
import "../../components/mypageSidebar/mypageSidebar.css"

const MyLikes = () => {
  return (
    <div className="mypage-container">
      <Sidebar />
      <div>
        내 좋아요 목록 페이지
      </div>
    </div>
  );
};

export { MyLikes };