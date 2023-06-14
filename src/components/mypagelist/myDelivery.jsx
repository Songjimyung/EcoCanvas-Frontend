import React from "react";
import Sidebar from "../mypageSidebar/mypageSidebar"
import "../mypageSidebar/mypageSidebar.css"


const MyDelivery = () => {
  return (
    <div className="mypage-container">
      <Sidebar />
      <div>
        배송조회 페이지
      </div>
    </div>
  );
};

export { MyDelivery };