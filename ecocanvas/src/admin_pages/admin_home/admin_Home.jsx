import React from "react";
import FeaturedInfo from "../../admin_conponents/featuredInfo/FeaturedInfo";
import Chart from "../../admin_conponents/chart/Chart";
import './admin_home.css';
import { userData } from "../../dummyData";
import WidgetLg from "../../admin_conponents/widgetLg/WidgetLg";
import WidgetSm from "../../admin_conponents/widgetSm/WidgetSm";

export default function AdminHome() {
  return (
    <div className="home">
      <FeaturedInfo />
      <Chart
        data={userData}
        title="유저 현황"
        grid
        dataKey="Active User"
      />
      <div className="homeWidgets">
        <WidgetSm />
        <WidgetLg />
      </div>
    </div>
  )
}

export { AdminHome };