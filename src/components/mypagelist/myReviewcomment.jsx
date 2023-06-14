import React from "react";
import Sidebar from "../mypageSidebar/mypageSidebar"
import "../mypageSidebar/mypageSidebar.css"


const MyReviewComment = () => {
  return (
    <div className="mypage-container">
      <Sidebar />
      <div>
        내 캠페인 리뷰/댓글 페이지
      </div>
    </div>
  );
};

export { MyReviewComment };