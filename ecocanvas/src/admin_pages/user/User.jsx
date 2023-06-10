import React, { useEffect, useState } from "react";
import './user.css'
import { CalendarToday, LocationCity, MailOutline, PermIdentity } from "@mui/icons-material";
import { useLocation } from "react-router-dom";



export default function User() {
    const location = useLocation();
    const id = location.pathname.split("/")[2];
    const [user, setUser] = useState([]);
    useEffect(() => {
        fetch("http://127.0.0.1:8000/users/"+id+"/", {
            method: 'GET',
        }).then(response => response.json())
        .then(result => {
            setUser(result[0])
        })
    },[]);
    return (
        <div className="user">
            <div className="userTitleContainer">
                <h1 className="userTitle">유저 정보 수정</h1>
                
            </div>
            <div className="userContainer">
                <div className="userShow">
                    <div className="userShowBottom">
                        <span className="userShowTitle">유저 상세 정보 </span>
                        <div className="userShowInfo">
                            <MailOutline className="userShowIcon" />
                            <span className="userShowInfoTitle">{ user.email }</span>
                        </div>
                        <div className="userShowInfo">
                            <PermIdentity className="userShowIcon" />
                            <span className="userShowInfoTitle">{ user.username }</span>
                        </div>
                        <div className="userShowInfo">
                            <CalendarToday className="userShowIcon" />
                            <span className="userShowInfoTitle">가입일자</span>
                        </div>
                        <div className="userShowInfo">
                            <LocationCity className="userShowIcon" />
                            <span className="userShowInfoTitle">주소</span>
                        </div>
                    </div>
                </div>
                
                <div className="userUpdate">
                    <span className="userUpdateTitle">수정</span>
                    <form className="userUpdateForm">
                        <div className="userUpdateLeft">
                            <div className="userUpdateItem">
                                <label>유저 이름</label>
                                <input
                                    type="text"
                                    placeholder="변경할 이름"
                                    className="userUpdateInput"
                                />
                            </div>
                            <div className="userUpdateItem">
                                <label>주소</label>
                                <input
                                    type="text"
                                    placeholder="변경할 주소"
                                    className="userUpdateInput"
                                />
                            </div>
                        </div>
                        <div className="userUpdateRight">
                            <button className="userUpdateButton">수정하기</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}