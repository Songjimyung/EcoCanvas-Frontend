import React from "react";
import Sidebar from "../../components/mypageSidebar/mypageSidebar"
import "../../components/mypageSidebar/mypageSidebar.css"


const MyOrder = () => {
  return (
    <div className="mypage-container">
      <Sidebar />
      <div>
        주문내역 페이지
      </div>
    </div>
  );
};

export { MyOrder };