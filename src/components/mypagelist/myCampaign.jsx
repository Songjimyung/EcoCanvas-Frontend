import React from "react";
import Sidebar from "../mypageSidebar/mypageSidebar"
import "../mypageSidebar/mypageSidebar.css"


const MyPostCampaign = () => {
  return (
    <div className="mypage-container">
      <Sidebar />
      <div>
        작성한 캠페인 페이지
      </div>
    </div>
  );
};

export { MyPostCampaign };