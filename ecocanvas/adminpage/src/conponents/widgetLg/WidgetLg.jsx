import React from "react";
import './widgetLg.css'

export default function WidgetLg() {
    const Button = ({ type }) => {
        return <button className={"widgetLgButton " + type}>{type}</button>
    }
    return (
        <div className="widgetLg">
            <h3 className="widgetLgTitle">AS TEst </h3>
            <table className="widgetLgTable">
                <thead>
                <tr className="widgetLgTr">
                    <th className="widgetLgTh">구매자</th>
                    <th className="widgetLgTh">날짜</th>
                    <th className="widgetLgTh">가격</th>
                    <th className="widgetLgTh">상태</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="widgetLgTr">
                        <td className="widgetLgName">
                            <span>사람 B</span>
                        </td>
                        <td className="widgetLgDate">2023년 4월 21일</td>
                        <td className="widgetLgAmount">10,000원</td>
                        <td className="widgetLgStatus">
                            <Button type="배송완료"></Button>
                        </td>
                    </tr>
                    <tr className="widgetLgTr">
                        <td className="widgetLgName">
                            <span>사람 C</span>
                        </td>
                        <td className="widgetLgDate">2023년 4월 21일</td>
                        <td className="widgetLgAmount">10,000원</td>
                        <td className="widgetLgStatus">
                            <Button type="상품준비중"></Button>
                        </td>
                    </tr>
                    <tr className="widgetLgTr">
                        <td className="widgetLgName">
                            <span>사람 A</span>
                        </td>
                        <td className="widgetLgDate">2023년 4월 21일</td>
                        <td className="widgetLgAmount">10,000원</td>
                        <td className="widgetLgStatus">
                            <Button type="배송중"></Button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}