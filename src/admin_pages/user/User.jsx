import React, { useEffect, useState } from "react";
import './user.css'
import { CalendarToday, MailOutline, PermIdentity } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { format } from 'date-fns';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import { Button } from "@mui/material";

export default function User() {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [user, setUser] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("access");
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/users/` + id + "/",
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          
          const user_info = {
            id: result["id"],
            email: result["email"],
            username: result["username"],
            created_at: result["created_at"],
            is_admin: result["is_admin"],
            is_active: result["is_active"]
          };
          setUser([user_info]);
        }
      } catch (error) {
        
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);


  const handlePermission = () => {
    const token = localStorage.getItem('access');

    fetch(`${process.env.REACT_APP_BACKEND_URL}/users/` + id + "/", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        alert(`유저 등급변경이 정상적으로 완료되었습니다.`);
        window.location.reload();
      })
      .catch(error => {
        
      });
  };

  return (
    <div className="user">
      <div className="userTitleContainer">
        <h1 className="userTitle">유저 정보 수정</h1>

      </div>
      <div className="userContainer">
        <div className="userShow">
          <div className="userShowBottom">
            <span className="userShowTitle">유저 상세 정보 </span>
            {user.map((userInfo) => (
              <React.Fragment key={userInfo.id}>
                <div className="userShowInfo">
                  <MailOutline className="userShowIcon" />
                  <span className="userShowInfoTitle">{userInfo.email}</span>
                </div>
                <div className="userShowInfo">
                  <PermIdentity className="userShowIcon" />
                  <span className="userShowInfoTitle">{userInfo.username}</span>
                </div>
                <div className="userShowInfo">
                  <CalendarToday className="userShowIcon" />
                  <span className="userShowInfoTitle">
                    가입일자: {format(new Date(userInfo.created_at), 'yyyy-MM-dd')}
                  </span>
                </div>
                <div className="userShowInfo">
                  <PermIdentity className="userShowIcon" />
                  <span className="userShowInfoTitle">
                    {userInfo.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="userShowInfo">
                  <AdminPanelSettingsOutlinedIcon className="userShowIcon" />
                  <span className="userShowInfoTitle">
                    {userInfo.is_admin ? "관리자" : "일반유저"}
                  </span>
                </div>
                {userInfo.is_admin ? (
                  <Button style={{ margin: "auto" }} onClick={handlePermission}>
                    일반유저로 변경
                  </Button >
                ) : (
                  <Button style={{ margin: "auto" }} onClick={handlePermission}>
                    관리자로 변경
                  </Button>
                )
                }
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div >

  )
}