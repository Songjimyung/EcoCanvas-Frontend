import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button } from "@mui/material";
import axios from 'axios';
import "./notificationhistory.css";

const NotificationHistory = () => {
  const [notifications, setNotifications] = useState([]);
  const [restockNotifications, setRestockNotifications] = useState([]);

  const mergedNotifications = [...notifications, ...restockNotifications];
  mergedNotifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));


  useEffect(() => {
    const token = localStorage.getItem('access');

    fetch(`${process.env.REACT_APP_BACKEND_URL}/users/notifications/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(response => response.json())
      .then(result => {
        console.log(result)
        setNotifications(result.notifications);
        setRestockNotifications(result.restock_notifications);

      })
  }, []);

  const handleConfirmClick = (notificationId) => {
    const token = localStorage.getItem('access');

    axios.delete(`${process.env.REACT_APP_BACKEND_URL}/users/notifications/`, {
      data: { notification_id: notificationId },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        console.log("알림 삭제");
        alert("알림 삭제 완료")
        window.location.reload();
      })
      .catch((error) => {

        console.error("알림 삭제 실패", error);
      });
  };

  const handleDeleteAllClick = () => {
    const token = localStorage.getItem('access');

    axios.delete(`${process.env.REACT_APP_BACKEND_URL}/users/notifications/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        console.log("알림 일괄 삭제");
        alert("알림 일괄 삭제 완료");
        setNotifications([]);
      })
      .catch((error) => {
        console.error("알림 일괄 삭제 실패", error);
      });
  };




  return (
    <div className="notification-cardWrapper">
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>알림 내역</h2>
      <div className='deleteBtnWrapper'>
        <Button
          variant="contained"
          color="secondary"
          className="delete-all-button"
          onClick={handleDeleteAllClick}
        >
          알림 일괄 삭제
        </Button>
      </div>
      {mergedNotifications.map((notification) => (
        <Card key={notification.id} variant="outlined" className="notification-card">
          <CardContent className="notification-cardContent">
            <Typography variant="body1">{notification.message}</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleConfirmClick(notification.id)}
            >
              확인
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NotificationHistory;
