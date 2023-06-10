import React from "react";
import FeaturedInfo from "../../conponents/featuredInfo/FeaturedInfo";
import Chart from "../../conponents/chart/Chart";
import './home.css';
import { userData } from "../../dummyData";
import WidgetLg from "../../conponents/widgetLg/WidgetLg";
import WidgetSm from "../../conponents/widgetSm/WidgetSm";

export default function Home() {
    return (
        <div className="home">
            <FeaturedInfo />
            <Chart
                data = {userData}
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