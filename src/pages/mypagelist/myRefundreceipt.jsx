import React from "react";
import Sidebar from "../../components/mypageSidebar/mypageSidebar"
import "../../components/mypageSidebar/mypageSidebar.css"


const MyRefundreceipt = () => {
  return (
    <div className="mypage-container">
      <Sidebar />
      <div>
        환불/취소 페이지
      </div>
    </div>
  );
};

export { MyRefundreceipt };