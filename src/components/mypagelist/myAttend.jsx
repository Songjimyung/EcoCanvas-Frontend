import React from "react";
import Sidebar from "../mypageSidebar/mypageSidebar"
import "../mypageSidebar/mypageSidebar.css"


const MyAttendCampaign = () => {
  return (
    <div className="mypage-container">
      <Sidebar />
      <div>
        참가한 캠페인 페이지
      </div>
    </div>
  );
};

export { MyAttendCampaign };